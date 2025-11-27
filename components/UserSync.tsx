"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * UserSync Component
 *
 * Automatically syncs Clerk user to Convex database on sign-in/sign-up.
 * This ensures every authenticated user has a record in the Convex users table.
 *
 * Add this component to your app/providers.tsx inside ConvexProviderWithClerk.
 */
export function UserSync() {
  const { user, isLoaded } = useUser();
  const syncUser = useMutation(api.users.syncUser);

  useEffect(() => {
    if (isLoaded && user) {
      syncUser({
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || undefined,
      }).catch((error) => {
        console.error("Failed to sync user:", error);
      });
    }
  }, [isLoaded, user, syncUser]);

  return null;
}
