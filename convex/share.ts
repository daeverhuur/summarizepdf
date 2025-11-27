import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Generate a random share token
function generateShareToken(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

// Create share link for summary
export const createShareLink = mutation({
  args: {
    summaryId: v.id("summaries"),
    expiresInDays: v.optional(v.number()),
  },
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

    // Check if share link already exists
    const existingShare = await ctx.db
      .query("sharedSummaries")
      .withIndex("by_summary", (q) => q.eq("summaryId", args.summaryId))
      .unique();

    if (existingShare) {
      return {
        shareToken: existingShare.shareToken,
        expiresAt: existingShare.expiresAt,
      };
    }

    // Create new share link
    const shareToken = generateShareToken();
    const expiresAt = args.expiresInDays
      ? Date.now() + args.expiresInDays * 24 * 60 * 60 * 1000
      : undefined;

    await ctx.db.insert("sharedSummaries", {
      summaryId: args.summaryId,
      shareToken,
      expiresAt,
      accessCount: 0,
      createdAt: Date.now(),
    });

    return { shareToken, expiresAt };
  },
});

// Get shared summary by token (public access)
export const getShared = query({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const sharedSummary = await ctx.db
      .query("sharedSummaries")
      .withIndex("by_token", (q) => q.eq("shareToken", args.shareToken))
      .unique();

    if (!sharedSummary) {
      throw new Error("Invalid share link");
    }

    // Check if expired
    if (
      sharedSummary.expiresAt &&
      sharedSummary.expiresAt < Date.now()
    ) {
      throw new Error("Share link has expired");
    }

    const summary = await ctx.db.get(sharedSummary.summaryId);
    if (!summary) {
      throw new Error("Summary not found");
    }

    const document = await ctx.db.get(summary.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    return {
      summary,
      document: {
        title: document.title,
        fileName: document.fileName,
        pageCount: document.pageCount,
        createdAt: document.createdAt,
      },
      accessCount: sharedSummary.accessCount,
    };
  },
});

// Increment access count
export const incrementAccess = mutation({
  args: { shareToken: v.string() },
  handler: async (ctx, args) => {
    const sharedSummary = await ctx.db
      .query("sharedSummaries")
      .withIndex("by_token", (q) => q.eq("shareToken", args.shareToken))
      .unique();

    if (!sharedSummary) {
      throw new Error("Invalid share link");
    }

    await ctx.db.patch(sharedSummary._id, {
      accessCount: sharedSummary.accessCount + 1,
    });

    return { success: true };
  },
});

// Delete share link
export const deleteShareLink = mutation({
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

    const sharedSummary = await ctx.db
      .query("sharedSummaries")
      .withIndex("by_summary", (q) => q.eq("summaryId", args.summaryId))
      .unique();

    if (sharedSummary) {
      await ctx.db.delete(sharedSummary._id);
    }

    return { success: true };
  },
});
