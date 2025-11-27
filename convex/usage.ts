import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// Plan limits configuration
export const PLAN_LIMITS = {
  free: {
    documentsPerDay: 3,
    maxPages: 20,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    questionsPerDocument: 0, // No chat for free
    librarySize: 0, // No library for free
    apiCalls: 0,
  },
  starter: {
    documentsPerDay: 25,
    maxPages: 100,
    maxFileSize: 25 * 1024 * 1024, // 25MB
    questionsPerDocument: 10,
    librarySize: 50,
    apiCalls: 0,
  },
  pro: {
    documentsPerDay: -1, // unlimited
    maxPages: 500,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    questionsPerDocument: -1, // unlimited
    librarySize: 500,
    apiCalls: 1000,
  },
  team: {
    documentsPerDay: -1, // unlimited
    maxPages: 500,
    maxFileSize: 100 * 1024 * 1024, // 100MB
    questionsPerDocument: -1, // unlimited
    librarySize: -1, // unlimited
    apiCalls: 10000,
  },
};

// Get current billing period usage (read-only, returns null if no period exists)
export const getCurrentPeriod = query({
  args: {},
  handler: async (ctx) => {
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

    const now = Date.now();
    const periodStart = new Date(now);
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_user_period", (q) =>
        q.eq("userId", user._id).eq("periodStart", periodStart.getTime())
      )
      .unique();

    return usage;
  },
});

// Check if user can perform an action based on tier limits
export const checkLimit = query({
  args: {
    action: v.union(
      v.literal("upload_document"),
      v.literal("ask_question"),
      v.literal("api_call")
    ),
    documentPageCount: v.optional(v.number()),
    fileSize: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { allowed: false, reason: "Not authenticated" };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return { allowed: false, reason: "User not found" };
    }

    const limits = PLAN_LIMITS[user.tier];
    const usage = await ctx.runQuery(api.usage.getCurrentPeriod, {});

    if (!usage) {
      return { allowed: false, reason: "Usage tracking error" };
    }

    // Check document upload limits
    if (args.action === "upload_document") {
      // Check daily document limit
      if (limits.documentsPerDay !== -1) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMs = today.getTime();

        const todayDocs = await ctx.db
          .query("documents")
          .withIndex("by_user_created", (q) => q.eq("userId", user._id))
          .filter((q) => q.gte(q.field("createdAt"), todayMs))
          .collect();

        if (todayDocs.length >= limits.documentsPerDay) {
          return {
            allowed: false,
            reason: `Daily document limit reached (${limits.documentsPerDay}/day). Upgrade to process more.`,
          };
        }
      }

      // Check page count limit
      if (
        args.documentPageCount &&
        limits.maxPages !== -1 &&
        args.documentPageCount > limits.maxPages
      ) {
        return {
          allowed: false,
          reason: `Document exceeds ${limits.maxPages} page limit. Upgrade to process larger documents.`,
        };
      }

      // Check file size limit
      if (
        args.fileSize &&
        limits.maxFileSize !== -1 &&
        args.fileSize > limits.maxFileSize
      ) {
        return {
          allowed: false,
          reason: `File size exceeds ${Math.round(limits.maxFileSize / 1024 / 1024)}MB limit. Upgrade to upload larger files.`,
        };
      }

      // Check library size
      if (limits.librarySize !== -1) {
        const userDocs = await ctx.db
          .query("documents")
          .withIndex("by_user", (q) => q.eq("userId", user._id))
          .collect();

        if (userDocs.length >= limits.librarySize) {
          return {
            allowed: false,
            reason: `Library is full (${limits.librarySize} documents). Delete old documents or upgrade.`,
          };
        }
      }
    }

    // Check question limits
    if (args.action === "ask_question") {
      if (limits.questionsPerDocument === 0) {
        return {
          allowed: false,
          reason: "Chat feature not available on free plan. Upgrade to ask questions.",
        };
      }

      if (
        limits.questionsPerDocument !== -1 &&
        usage.questionsAsked >= limits.questionsPerDocument
      ) {
        return {
          allowed: false,
          reason: `Monthly question limit reached (${limits.questionsPerDocument}). Upgrade for more.`,
        };
      }
    }

    // Check API call limits
    if (args.action === "api_call") {
      if (limits.apiCalls === 0) {
        return {
          allowed: false,
          reason: "API access not available. Upgrade to Pro or Team plan.",
        };
      }

      if (limits.apiCalls !== -1 && usage.apiCalls >= limits.apiCalls) {
        return {
          allowed: false,
          reason: `Monthly API limit reached (${limits.apiCalls}). Upgrade for more calls.`,
        };
      }
    }

    return { allowed: true };
  },
});

// Increment usage counters (internal use)
export const increment = internalMutation({
  args: {
    userId: v.id("users"),
    documentsProcessed: v.optional(v.number()),
    pagesProcessed: v.optional(v.number()),
    questionsAsked: v.optional(v.number()),
    apiCalls: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const periodStart = new Date(now);
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const usage = await ctx.db
      .query("usageTracking")
      .withIndex("by_user_period", (q) =>
        q.eq("userId", args.userId).eq("periodStart", periodStart.getTime())
      )
      .unique();

    if (!usage) {
      throw new Error("Usage tracking record not found");
    }

    const updates: Partial<Doc<"usageTracking">> = {};

    if (args.documentsProcessed !== undefined) {
      updates.documentsProcessed =
        usage.documentsProcessed + args.documentsProcessed;
    }

    if (args.pagesProcessed !== undefined) {
      updates.pagesProcessed = usage.pagesProcessed + args.pagesProcessed;
    }

    if (args.questionsAsked !== undefined) {
      updates.questionsAsked = usage.questionsAsked + args.questionsAsked;
    }

    if (args.apiCalls !== undefined) {
      updates.apiCalls = usage.apiCalls + args.apiCalls;
    }

    await ctx.db.patch(usage._id, updates);
  },
});

// Reset usage for new billing period (internal use)
export const reset = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const now = Date.now();
    const periodStart = new Date(now);
    periodStart.setDate(1);
    periodStart.setHours(0, 0, 0, 0);

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await ctx.db.insert("usageTracking", {
      userId: args.userId,
      periodStart: periodStart.getTime(),
      periodEnd: periodEnd.getTime(),
      documentsProcessed: 0,
      pagesProcessed: 0,
      questionsAsked: 0,
      apiCalls: 0,
    });
  },
});

// Get user usage stats (for dashboard)
export const getUserUsage = query({
  args: {},
  handler: async (ctx): Promise<{
    tier: "free" | "starter" | "pro" | "team";
    usage: any;
    limits: any;
  }> => {
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

    const usage = await ctx.runQuery(api.usage.getCurrentPeriod, {});
    const limits = PLAN_LIMITS[user.tier];

    return {
      tier: user.tier,
      usage: usage || {
        documentsProcessed: 0,
        pagesProcessed: 0,
        questionsAsked: 0,
        apiCalls: 0,
      },
      limits,
    };
  },
});
