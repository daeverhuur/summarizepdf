import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Create a team (Team plan only)
export const create = mutation({
  args: {
    name: v.string(),
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

    if (user.tier !== "team") {
      throw new Error("Team features require Team plan subscription");
    }

    const teamId = await ctx.db.insert("teams", {
      name: args.name,
      ownerId: user._id,
      memberIds: [user._id],
      sharedDocumentIds: [],
      createdAt: Date.now(),
    });

    // Link user to team
    await ctx.db.patch(user._id, {
      teamId,
    });

    return teamId;
  },
});

// Get team details
export const get = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (!team.memberIds.includes(user._id)) {
      throw new Error("Access denied");
    }

    return team;
  },
});

// Add member to team
export const addMember = mutation({
  args: {
    teamId: v.id("teams"),
    userEmail: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (team.ownerId !== currentUser._id) {
      throw new Error("Only team owner can add members");
    }

    const newMember = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .unique();

    if (!newMember) {
      throw new Error("User not found with that email");
    }

    if (team.memberIds.includes(newMember._id)) {
      throw new Error("User is already a team member");
    }

    // Add to team
    await ctx.db.patch(args.teamId, {
      memberIds: [...team.memberIds, newMember._id],
    });

    // Link user to team
    await ctx.db.patch(newMember._id, {
      teamId: args.teamId,
    });

    return { success: true };
  },
});

// Remove member from team
export const removeMember = mutation({
  args: {
    teamId: v.id("teams"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!currentUser) {
      throw new Error("User not found");
    }

    if (team.ownerId !== currentUser._id) {
      throw new Error("Only team owner can remove members");
    }

    if (args.userId === team.ownerId) {
      throw new Error("Cannot remove team owner");
    }

    // Remove from team
    await ctx.db.patch(args.teamId, {
      memberIds: team.memberIds.filter((id) => id !== args.userId),
    });

    // Unlink user from team
    await ctx.db.patch(args.userId, {
      teamId: undefined,
    });

    return { success: true };
  },
});

// Share document with team
export const shareToTeam = mutation({
  args: {
    teamId: v.id("teams"),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (!team.memberIds.includes(user._id)) {
      throw new Error("Access denied");
    }

    const document = await ctx.db.get(args.documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    if (document.userId !== user._id) {
      throw new Error("Can only share your own documents");
    }

    if (team.sharedDocumentIds.includes(args.documentId)) {
      throw new Error("Document already shared with team");
    }

    await ctx.db.patch(args.teamId, {
      sharedDocumentIds: [...team.sharedDocumentIds, args.documentId],
    });

    return { success: true };
  },
});

// Get team's shared documents
export const getTeamDocuments = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const team = await ctx.db.get(args.teamId);
    if (!team) {
      throw new Error("Team not found");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    if (!team.memberIds.includes(user._id)) {
      throw new Error("Access denied");
    }

    const documents = await Promise.all(
      team.sharedDocumentIds.map((id) => ctx.db.get(id))
    );

    return documents.filter((doc): doc is Doc<"documents"> => doc !== null);
  },
});
