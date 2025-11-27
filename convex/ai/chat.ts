"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import { api, internal } from "../_generated/api";
import OpenAI from "openai";
import { OPENAI_MODELS, MODEL_CONFIG } from "./models";

// Chat with PDF document
export const chatWithDocument = action({
  args: {
    documentId: v.id("documents"),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
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

    // Check if user can ask questions (tier limits)
    const canAsk = await ctx.runQuery(api.usage.checkLimit, {
      action: "ask_question",
    });

    if (!canAsk.allowed) {
      throw new Error(canAsk.reason || "Question limit reached");
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
        `Document not ready. Status: ${document.status}`
      );
    }

    if (!document.extractedText || document.extractedText.length === 0) {
      throw new Error("No text extracted from document");
    }

    // Save user message first
    await ctx.runMutation(api.chat.saveUserMessage, {
      documentId: args.documentId,
      content: args.userMessage,
    });

    // Get chat history for context
    const chatHistory = await ctx.runQuery(api.chat.getHistory, {
      documentId: args.documentId,
    });

    // Combine extracted text from all pages
    const fullText = document.extractedText
      .sort((a: any, b: any) => a.pageNumber - b.pageNumber)
      .map((page: any) => `[Page ${page.pageNumber}]\n${page.content}`)
      .join("\n\n");

    // Build messages for OpenAI
    const systemPrompt = buildChatSystemPrompt(document.title);
    const documentContext = buildDocumentContext(fullText);

    // Convert chat history to OpenAI format (excluding the just-saved user message)
    const historyMessages = chatHistory
      .slice(0, -1) // Exclude the last message (just saved)
      .slice(-10) // Keep last 10 messages for context (5 exchanges)
      .map((msg: any) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }));

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: documentContext },
      ...historyMessages,
      { role: "user", content: args.userMessage },
    ];

    try {
      // Try with primary model first (gpt-5-nano)
      let model: string = OPENAI_MODELS.PRIMARY;
      let response;

      try {
        response = await openai.chat.completions.create({
          model,
          messages,
          temperature: MODEL_CONFIG.temperature,
          max_tokens: 1000, // Reasonable length for chat responses
          top_p: MODEL_CONFIG.top_p,
        });
      } catch (error: any) {
        // If primary model fails, fall back to gpt-5-mini
        if (error.status === 429 || error.code === "rate_limit_exceeded") {
          console.log("Rate limited on primary model, using fallback");
          model = OPENAI_MODELS.FALLBACK;

          response = await openai.chat.completions.create({
            model,
            messages,
            temperature: MODEL_CONFIG.temperature,
            max_tokens: 1000,
            top_p: MODEL_CONFIG.top_p,
          });
        } else {
          throw error;
        }
      }

      const answer = response.choices[0]?.message?.content;
      if (!answer) {
        throw new Error("No response generated");
      }

      // Extract page references from the answer (if AI mentioned page numbers)
      const pageReferences = extractPageReferences(answer);

      // Calculate tokens used
      const tokensUsed =
        (response.usage?.prompt_tokens || 0) +
        (response.usage?.completion_tokens || 0);

      // Save assistant response
      await ctx.runMutation(api.chat.saveAssistantMessage, {
        documentId: args.documentId,
        content: answer,
        pageReferences: pageReferences.length > 0 ? pageReferences : undefined,
        model,
        tokensUsed,
      });

      return {
        answer,
        pageReferences,
        model,
        tokensUsed,
      };
    } catch (error: any) {
      console.error("Chat error:", error);
      throw new Error(
        `Failed to generate response: ${error.message || "Unknown error"}`
      );
    }
  },
});

// Build system prompt for chat
function buildChatSystemPrompt(documentTitle: string): string {
  return `You are a helpful AI assistant specialized in answering questions about PDF documents.

You are currently helping with the document: "${documentTitle}"

IMPORTANT RULES:
1. Answer ONLY based on the document content provided
2. If information is not in the document, clearly state: "I couldn't find this information in the document."
3. When referencing specific information, mention the page number when possible (e.g., "On page 5...")
4. Be concise but thorough in your answers
5. If asked to summarize, focus on the most relevant parts
6. Maintain a helpful, professional tone

Do not make up information or use external knowledge beyond the document content.`;
}

// Build document context for chat
function buildDocumentContext(fullText: string): string {
  // If text is very long, we might need to chunk it
  // For now, include full text (400K token context can handle most PDFs)
  return `Here is the complete document content:\n\n${fullText}`;
}

// Extract page numbers referenced in the answer
function extractPageReferences(text: string): number[] {
  const pageNumbers: number[] = [];

  // Match patterns like "page 5", "Page 10", "pages 3-5", "[Page 7]"
  const patterns = [
    /\bpage\s+(\d+)/gi,
    /\bpages\s+(\d+)/gi,
    /\[page\s+(\d+)\]/gi,
  ];

  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const pageNum = parseInt(match[1], 10);
      if (!isNaN(pageNum) && !pageNumbers.includes(pageNum)) {
        pageNumbers.push(pageNum);
      }
    }
  }

  return pageNumbers.sort((a, b) => a - b);
}
