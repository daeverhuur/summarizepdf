import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Create document record after file upload
export const create = mutation({
  args: {
    title: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    pageCount: v.number(),
    storageId: v.id("_storage"),
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

    // Check usage limits
    const canUpload = await ctx.runQuery(api.usage.checkLimit, {
      action: "upload_document",
    });

    if (!canUpload.allowed) {
      throw new Error(canUpload.reason || "Upload limit reached");
    }

    const documentId = await ctx.db.insert("documents", {
      userId: user._id,
      title: args.title,
      fileName: args.fileName,
      fileSize: args.fileSize,
      pageCount: args.pageCount,
      storageId: args.storageId,
      extractedText: [],
      status: "uploading",
      createdAt: Date.now(),
    });

    return documentId;
  },
});

// Get single document by ID
export const get = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if user owns the document or has team access
    if (document.userId !== user._id) {
      if (user.teamId) {
        const team = await ctx.db.get(user.teamId);
        if (!team || !team.sharedDocumentIds.includes(args.documentId)) {
          throw new Error("Access denied");
        }
      } else {
        throw new Error("Access denied");
      }
    }

    return document;
  },
});

// List user's documents with pagination and search
export const list = query({
  args: {
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.union(v.string(), v.null()),
      })
    ),
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

    let query = ctx.db
      .query("documents")
      .withIndex("by_user_created", (q) => q.eq("userId", user._id))
      .order("desc");

    const documents = await query.collect();

    // Filter by search term if provided
    let filtered = documents;
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      filtered = documents.filter(
        (doc) =>
          doc.title.toLowerCase().includes(searchLower) ||
          doc.fileName.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  },
});

// Update document status (internal use for processing pipeline)
export const updateStatus = internalMutation({
  args: {
    documentId: v.id("documents"),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      status: args.status,
      errorMessage: args.errorMessage,
    });
  },
});

// Update extracted text (internal use for processing pipeline)
export const updateExtractedText = internalMutation({
  args: {
    documentId: v.id("documents"),
    extractedText: v.array(
      v.object({
        pageNumber: v.number(),
        content: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      extractedText: args.extractedText,
      pageCount: args.extractedText.length, // Update page count based on extracted pages
    });
  },
});

// Delete document and associated data
export const deleteDocument = mutation({
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

    // Delete associated summaries
    const summaries = await ctx.db
      .query("summaries")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const summary of summaries) {
      await ctx.db.delete(summary._id);
    }

    // Delete associated chat messages
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete file from storage
    await ctx.storage.delete(document.storageId);

    // Delete document
    await ctx.db.delete(args.documentId);

    return { success: true };
  },
});

// Get document for shared view (public access via share token)
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

    // Check if link is expired
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
      document,
      summary,
    };
  },
});
