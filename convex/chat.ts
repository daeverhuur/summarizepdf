import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";

// Get chat history for a document
export const getHistory = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Access denied");
    }

    return await ctx.db
      .query("chatMessages")
      .withIndex("by_document_created", (q) =>
        q.eq("documentId", args.documentId)
      )
      .order("asc")
      .collect();
  },
});

// Save user message (AI response will be saved by action)
export const saveUserMessage = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Access denied");
    }

    // Check usage limits for questions
    const canAsk = await ctx.runQuery(api.usage.checkLimit, {
      action: "ask_question",
    });

    if (!canAsk.allowed) {
      throw new Error(canAsk.reason || "Question limit reached");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: user._id,
      role: "user",
      content: args.content,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Save assistant response (called by AI action)
export const saveAssistantMessage = mutation({
  args: {
    documentId: v.id("documents"),
    content: v.string(),
    pageReferences: v.optional(v.array(v.number())),
    model: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    const messageId = await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: user._id,
      role: "assistant",
      content: args.content,
      pageReferences: args.pageReferences,
      model: args.model,
      tokensUsed: args.tokensUsed,
      createdAt: Date.now(),
    });

    // Increment usage counter
    await ctx.runMutation(internal.usage.increment, {
      userId: user._id,
      questionsAsked: 1,
    });

    return messageId;
  },
});

// Clear chat history for a document
export const clearHistory = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Access denied");
    }

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    return { success: true };
  },
});
