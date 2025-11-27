import { AuthConfig } from "convex/server";

export default {
  providers: [
    {
      // Clerk JWT authentication
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN || "https://sweet-filly-99.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
} satisfies AuthConfig;
