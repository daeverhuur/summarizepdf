"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import OpenAI from "openai";
import { OPENAI_MODELS, MODEL_CONFIG } from "./models";

// Type definitions for structured summary
interface KeyInsight {
  text: string;
  type: "finding" | "recommendation" | "warning" | "statistic" | "conclusion";
}

interface Section {
  title: string;
  content: string;
}

interface StructuredSummary {
  summary: string;
  keyInsights: KeyInsight[];
  sections: Section[];
  suggestedQuestions: string[];
}

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

    // Build prompt for structured JSON output
    const systemPrompt = buildStructuredSystemPrompt();
    const userPrompt = buildStructuredUserPrompt(fullText, args.format, args.length);

    try {
      // Try with primary model first (gpt-4o-mini)
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
          max_tokens: MODEL_CONFIG.maxTokens[args.length] + 1000, // Extra tokens for JSON structure
          top_p: MODEL_CONFIG.top_p,
          frequency_penalty: MODEL_CONFIG.frequency_penalty,
          presence_penalty: MODEL_CONFIG.presence_penalty,
          response_format: { type: "json_object" },
        });
      } catch (error: any) {
        // If primary model fails (rate limit, etc.), fall back to gpt-4o
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
            max_tokens: MODEL_CONFIG.maxTokens[args.length] + 1000,
            top_p: MODEL_CONFIG.top_p,
            frequency_penalty: MODEL_CONFIG.frequency_penalty,
            presence_penalty: MODEL_CONFIG.presence_penalty,
            response_format: { type: "json_object" },
          });
        } else {
          throw error;
        }
      }

      const rawContent = response.choices[0]?.message?.content;
      if (!rawContent) {
        throw new Error("No summary generated");
      }

      // Parse the JSON response
      let structuredData: StructuredSummary;
      try {
        structuredData = JSON.parse(rawContent);
      } catch {
        // If JSON parsing fails, use the raw content as the summary
        structuredData = {
          summary: rawContent,
          keyInsights: [],
          sections: [],
          suggestedQuestions: [],
        };
      }

      // Calculate tokens used
      const tokensUsed =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);

      // Save summary to database with structured data
      const summaryId = await ctx.runMutation(api.summaries.create, {
        documentId: args.documentId,
        format: args.format,
        length: args.length,
        content: structuredData.summary,
        keyInsights: structuredData.keyInsights,
        sections: structuredData.sections,
        suggestedQuestions: structuredData.suggestedQuestions,
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
        content: structuredData.summary,
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

// Build system prompt for structured JSON output
function buildStructuredSystemPrompt(): string {
  return `You are an expert PDF summarization assistant. You analyze documents and provide structured insights in JSON format.

Your response must be a valid JSON object with this exact structure:
{
  "summary": "The main summary text (formatted based on user's requested format)",
  "keyInsights": [
    {"text": "Key insight 1", "type": "finding|recommendation|warning|statistic|conclusion"},
    {"text": "Key insight 2", "type": "finding|recommendation|warning|statistic|conclusion"}
  ],
  "sections": [
    {"title": "Section Title", "content": "Section content..."},
    {"title": "Another Section", "content": "More content..."}
  ],
  "suggestedQuestions": [
    "Question 1 that a reader might want to ask about this document?",
    "Question 2 about specific details?"
  ]
}

Insight types:
- "finding": A key discovery or fact from the document
- "recommendation": An action item or suggestion
- "warning": A risk, concern, or caution mentioned
- "statistic": A notable number, percentage, or data point
- "conclusion": A final takeaway or conclusion

Always provide 3-5 key insights, 2-4 sections, and 3-4 suggested questions.`;
}

// Build user prompt for structured output
function buildStructuredUserPrompt(
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
    bullet: "Format the summary as clear bullet points with • symbols",
    paragraph: "Format the summary as flowing, professional paragraphs",
    detailed: "Format the summary as a comprehensive section-by-section analysis",
  };

  return `Analyze the following document and provide a structured JSON response.

Summary format: ${formatInstruction[format]}
Summary length: approximately ${lengthGuide[length]}

Document content:
${text}

Remember:
- Extract the most important and actionable insights
- Identify key findings, recommendations, warnings, statistics, and conclusions
- Break down the content into logical sections
- Suggest questions that would help readers understand the document better
- Ensure the summary is accurate to the source material`;
}
