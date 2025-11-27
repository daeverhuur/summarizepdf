import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// Get user by Clerk ID (internal use)
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Sync user from Clerk (called by UserSync component on sign-in/sign-up)
export const syncUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) {
      // Update existing user if email or name changed
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
      });
      return existingUser._id;
    }

    // Create new user with free tier
    const userId = await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      tier: "free",
      createdAt: Date.now(),
    });

    // Initialize usage tracking for new user
    const now = Date.now();
    const periodStart = new Date(now);
    periodStart.setDate(1); // Start of current month
    periodStart.setHours(0, 0, 0, 0);

    const periodEnd = new Date(periodStart);
    periodEnd.setMonth(periodEnd.getMonth() + 1); // End of current month

    await ctx.db.insert("usageTracking", {
      userId,
      periodStart: periodStart.getTime(),
      periodEnd: periodEnd.getTime(),
      documentsProcessed: 0,
      pagesProcessed: 0,
      questionsAsked: 0,
      apiCalls: 0,
    });

    return userId;
  },
});

// Upsert user (create or update)
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    return await ctx.runMutation(api.users.syncUser, args);
  },
});

// Update user tier (internal use for subscription changes)
export const updateTier = internalMutation({
  args: {
    userId: v.id("users"),
    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro"),
      v.literal("team")
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      tier: args.tier,
    });
  },
});

// Update user settings
export const updateSettings = mutation({
  args: {
    defaultSummaryFormat: v.optional(v.string()),
    defaultSummaryLength: v.optional(v.string()),
    emailNotifications: v.optional(v.boolean()),
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

    await ctx.db.patch(user._id, {
      settings: {
        defaultSummaryFormat: args.defaultSummaryFormat,
        defaultSummaryLength: args.defaultSummaryLength,
        emailNotifications: args.emailNotifications,
      },
    });

    return { success: true };
  },
});

// Import API for internal mutations
import { api } from "./_generated/api";
