import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Get summary by ID
export const get = query({
  args: { summaryId: v.id("summaries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const summary = await ctx.db.get(args.summaryId);
    if (!summary) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (summary.userId !== user._id) {
      throw new Error("Access denied");
    }

    return summary;
  },
});

// List all summaries for a document
export const listByDocument = query({
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
      .query("summaries")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

// List all user's summaries (for library view)
export const listByUser = query({
  args: {
    search: v.optional(v.string()),
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

    let summaries = await ctx.db
      .query("summaries")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();

    // Filter by search term if provided
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      summaries = summaries.filter((summary) =>
        summary.content.toLowerCase().includes(searchLower)
      );
    }

    return summaries;
  },
});

// Search summaries by content
export const search = query({
  args: { searchTerm: v.string() },
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

    const allSummaries = await ctx.db
      .query("summaries")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const searchLower = args.searchTerm.toLowerCase();
    return allSummaries.filter((summary) =>
      summary.content.toLowerCase().includes(searchLower)
    );
  },
});

// Create a summary (will be called by AI action)
export const create = mutation({
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
    content: v.string(),
    keyInsights: v.optional(v.array(v.object({
      text: v.string(),
      type: v.union(
        v.literal("finding"),
        v.literal("recommendation"),
        v.literal("warning"),
        v.literal("statistic"),
        v.literal("conclusion")
      ),
    }))),
    sections: v.optional(v.array(v.object({
      title: v.string(),
      content: v.string(),
    }))),
    suggestedQuestions: v.optional(v.array(v.string())),
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

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Access denied");
    }

    const summaryId = await ctx.db.insert("summaries", {
      documentId: args.documentId,
      userId: user._id,
      format: args.format,
      length: args.length,
      content: args.content,
      keyInsights: args.keyInsights,
      sections: args.sections,
      suggestedQuestions: args.suggestedQuestions,
      model: args.model,
      tokensUsed: args.tokensUsed,
      createdAt: Date.now(),
    });

    return summaryId;
  },
});

// Delete a summary
export const deleteSummary = mutation({
  args: { summaryId: v.id("summaries") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const summary = await ctx.db.get(args.summaryId);
    if (!summary) {
      throw new Error("Summary not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (summary.userId !== user._id) {
      throw new Error("Access denied");
    }

    await ctx.db.delete(args.summaryId);

    return { success: true };
  },
});
