export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,

  products: {
    starter: {
      productId: "prod_TV6uoMS7nK3bDM",
      monthlyPriceId: "price_1SY6hT2IubKBnq2izjqzgdGZ",
      yearlyPriceId: "price_1SY6hV2IubKBnq2iCFVzmtRe",
    },
    pro: {
      productId: "prod_TV6uQcF0bLWkQF",
      monthlyPriceId: "price_1SY6hX2IubKBnq2igjGmzhTM",
      yearlyPriceId: "price_1SY6hb2IubKBnq2ibvdFmef5",
    },
    team: {
      productId: "prod_TV6uZUaHfzRrsm",
      monthlyPriceId: "price_1SY6hd2IubKBnq2iVvK3JBW6",
      yearlyPriceId: "price_1SY6hi2IubKBnq2iiQOASQ5s",
    },
  },
} as const;

export type PricingTier = "free" | "starter" | "pro" | "team";
export type BillingInterval = "month" | "year";
