"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import OpenAI from "openai";
import { OPENAI_MODELS, MODEL_CONFIG } from "./models";

// Generate summary from PDF document
export const generateSummary = action({
  args: {
    documentId: v.id("documents"),
    format: v.union(
      v.literal("bullet"),
      v.literal("paragraph"),
      v.literal("detailed")
    ),
    length: v.union(
      v.literal("short"),
      v.literal("medium"),
      v.literal("detailed")
    ),
  },
  handler: async (ctx, args): Promise<{
    summaryId: any;
    content: string;
    model: string;
    tokensUsed: number;
  }> => {
    // Initialize OpenAI client
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not configured");
    }

    const openai = new OpenAI({ apiKey });

    // Get user identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get user from database
    const user = await ctx.runQuery(api.users.getUserByClerkId, {
      clerkId: identity.subject,
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check usage limits before processing
    const canProcess = await ctx.runQuery(api.usage.checkLimit, {
      action: "upload_document",
      documentPageCount: 0, // Will check in document retrieval
    });

    if (!canProcess.allowed) {
      throw new Error(canProcess.reason || "Usage limit exceeded");
    }

    // Get document with extracted text
    const document = await ctx.runQuery(api.documents.get, {
      documentId: args.documentId,
    });

    if (!document) {
      throw new Error("Document not found");
    }

    if (document.status !== "ready") {
      throw new Error(
        `Document not ready for summarization. Status: ${document.status}`
      );
    }

    if (!document.extractedText || document.extractedText.length === 0) {
      throw new Error("No text extracted from document");
    }

    // Combine extracted text from all pages
    const fullText = document.extractedText
      .sort((a: any, b: any) => a.pageNumber - b.pageNumber)
      .map((page: any) => `[Page ${page.pageNumber}]\n${page.content}`)
      .join("\n\n");

    if (fullText.trim().length === 0) {
      throw new Error("Document appears to be empty");
    }

    // Build prompt based on format and length
    const systemPrompt = buildSystemPrompt(args.format, args.length);
    const userPrompt = buildUserPrompt(fullText, args.format, args.length);

    try {
      // Try with primary model first (gpt-5-nano)
      let model: string = OPENAI_MODELS.PRIMARY;
      let response;

      try {
        response = await openai.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: MODEL_CONFIG.temperature,
          max_tokens: MODEL_CONFIG.maxTokens[args.length],
          top_p: MODEL_CONFIG.top_p,
          frequency_penalty: MODEL_CONFIG.frequency_penalty,
          presence_penalty: MODEL_CONFIG.presence_penalty,
        });
      } catch (error: any) {
        // If primary model fails (rate limit, etc.), fall back to gpt-5-mini
        if (error.status === 429 || error.code === "rate_limit_exceeded") {
          console.log("Rate limited on primary model, using fallback");
          model = OPENAI_MODELS.FALLBACK;

          response = await openai.chat.completions.create({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: MODEL_CONFIG.temperature,
            max_tokens: MODEL_CONFIG.maxTokens[args.length],
            top_p: MODEL_CONFIG.top_p,
            frequency_penalty: MODEL_CONFIG.frequency_penalty,
            presence_penalty: MODEL_CONFIG.presence_penalty,
          });
        } else {
          throw error;
        }
      }

      const summary = response.choices[0]?.message?.content;
      if (!summary) {
        throw new Error("No summary generated");
      }

      // Calculate tokens used
      const tokensUsed =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);

      // Save summary to database
      const summaryId = await ctx.runMutation(api.summaries.create, {
        documentId: args.documentId,
        format: args.format,
        length: args.length,
        content: summary,
        model,
        tokensUsed,
      });

      // Increment usage counters
      await ctx.runMutation(internal.usage.increment, {
        userId: user._id,
        documentsProcessed: 1,
        pagesProcessed: document.pageCount,
      });

      return {
        summaryId,
        content: summary,
        model,
        tokensUsed,
      };
    } catch (error: any) {
      console.error("Summarization error:", error);
      throw new Error(
        `Failed to generate summary: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Build system prompt based on format
function buildSystemPrompt(
  format: "bullet" | "paragraph" | "detailed",
  length: "short" | "medium" | "detailed"
): string {
  const basePrompt =
    "You are an expert PDF summarization assistant. Your summaries are accurate, concise, and capture the key points of the document.";

  switch (format) {
    case "bullet":
      return `${basePrompt}\n\nProvide summaries as clear, organized bullet points. Each bullet should be a complete, standalone statement. Group related points under clear headings when appropriate.`;

    case "paragraph":
      return `${basePrompt}\n\nProvide summaries as flowing, well-structured paragraphs. Use clear topic sentences and smooth transitions. Write in an executive summary style.`;

    case "detailed":
      return `${basePrompt}\n\nProvide comprehensive, section-by-section analysis. Include key details, main arguments, supporting evidence, and conclusions. Maintain the logical flow of the original document.`;

    default:
      return basePrompt;
  }
}

// Build user prompt based on length
function buildUserPrompt(
  text: string,
  format: "bullet" | "paragraph" | "detailed",
  length: "short" | "medium" | "detailed"
): string {
  const lengthGuide = {
    short: "200-300 words",
    medium: "500-700 words",
    detailed: "1000-1500 words",
  };

  const formatInstruction = {
    bullet: "Extract the key takeaways as bullet points",
    paragraph: "Write an executive summary in flowing paragraphs",
    detailed: "Provide a section-by-section analysis",
  };

  return `${formatInstruction[format]} of approximately ${lengthGuide[length]} from the following document:

${text}

Remember to:
- Focus on the most important information
- Maintain accuracy to the source material
- ${format === "bullet" ? "Use clear, concise bullet points" : ""}
- ${format === "paragraph" ? "Use smooth, professional prose" : ""}
- ${format === "detailed" ? "Cover all major sections and their key points" : ""}`;
}
