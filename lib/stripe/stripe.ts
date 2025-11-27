import Stripe from "stripe";
import { STRIPE_CONFIG } from "./config";

if (!STRIPE_CONFIG.secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(STRIPE_CONFIG.secretKey, {
  apiVersion: "2025-11-17.clover",
  typescript: true,
});
