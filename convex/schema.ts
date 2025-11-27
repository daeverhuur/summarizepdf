import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // User profiles synced from Clerk
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro"),
      v.literal("team")
    ),
    teamId: v.optional(v.id("teams")),
    settings: v.optional(
      v.object({
        defaultSummaryFormat: v.optional(v.string()),
        defaultSummaryLength: v.optional(v.string()),
        emailNotifications: v.optional(v.boolean()),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_team", ["teamId"]),

  // PDF documents uploaded by users
  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    fileName: v.string(),
    fileSize: v.number(),
    pageCount: v.number(),
    storageId: v.id("_storage"),
    extractedText: v.array(
      v.object({
        pageNumber: v.number(),
        content: v.string(),
      })
    ),
    status: v.union(
      v.literal("uploading"),
      v.literal("processing"),
      v.literal("ready"),
      v.literal("error")
    ),
    errorMessage: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"])
    .index("by_status", ["status"]),

  // AI-generated summaries
  summaries: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
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
    model: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_user", ["userId"])
    .index("by_user_created", ["userId", "createdAt"]),

  // Chat messages with PDFs
  chatMessages: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    pageReferences: v.optional(v.array(v.number())),
    model: v.optional(v.string()),
    tokensUsed: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_document", ["documentId"])
    .index("by_document_created", ["documentId", "createdAt"])
    .index("by_user", ["userId"]),

  // Stripe subscriptions
  subscriptions: defineTable({
    userId: v.id("users"),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    tier: v.union(
      v.literal("free"),
      v.literal("starter"),
      v.literal("pro"),
      v.literal("team")
    ),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("incomplete"),
      v.literal("trialing")
    ),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    cancelAtPeriodEnd: v.boolean(),
    trialEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_stripe_customer", ["stripeCustomerId"])
    .index("by_stripe_subscription", ["stripeSubscriptionId"])
    .index("by_status", ["status"]),

  // Usage tracking per billing period
  usageTracking: defineTable({
    userId: v.id("users"),
    periodStart: v.number(),
    periodEnd: v.number(),
    documentsProcessed: v.number(),
    pagesProcessed: v.number(),
    questionsAsked: v.number(),
    apiCalls: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_period", ["userId", "periodStart"])
    .index("by_period", ["periodStart"]),

  // Team collaboration (for team tier)
  teams: defineTable({
    name: v.string(),
    ownerId: v.id("users"),
    memberIds: v.array(v.id("users")),
    sharedDocumentIds: v.array(v.id("documents")),
    settings: v.optional(
      v.object({
        customBranding: v.optional(v.boolean()),
        ssoEnabled: v.optional(v.boolean()),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_owner", ["ownerId"])
    .index("by_member", ["memberIds"]),

  // Shared summary links
  sharedSummaries: defineTable({
    summaryId: v.id("summaries"),
    shareToken: v.string(),
    expiresAt: v.optional(v.number()),
    accessCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_summary", ["summaryId"])
    .index("by_token", ["shareToken"])
    .index("by_expires", ["expiresAt"]),
});
