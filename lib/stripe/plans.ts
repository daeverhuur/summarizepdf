import type { PricingTier } from "./config";

export type { PricingTier };

export interface PlanFeatures {
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    pdfsPerDay: number | "unlimited";
    maxPagesPerPdf: number;
    chatQuestionsPerDoc: number | "unlimited";
    documentLibrarySize: number;
    batchUpload: boolean;
    batchUploadLimit?: number;
    apiAccess: boolean;
    apiCallsPerMonth?: number;
    priorityProcessing: boolean;
    exportFormats: boolean;
    teamSeats?: number;
    sharedLibrary: boolean;
    adminDashboard: boolean;
    ssoIntegration: boolean;
    customBranding: boolean;
    support: "email" | "priority" | "dedicated";
  };
  cta: string;
  popular?: boolean;
}

export const PLANS: Record<PricingTier, PlanFeatures> = {
  free: {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: {
      pdfsPerDay: 5,
      maxPagesPerPdf: 25,
      chatQuestionsPerDoc: 3,
      documentLibrarySize: 10,
      batchUpload: false,
      apiAccess: false,
      priorityProcessing: false,
      exportFormats: false,
      sharedLibrary: false,
      adminDashboard: false,
      ssoIntegration: false,
      customBranding: false,
      support: "email",
    },
    cta: "Get Started",
  },
  starter: {
    name: "Starter",
    price: {
      monthly: 9,
      yearly: 86, // 20% discount
    },
    features: {
      pdfsPerDay: 25,
      maxPagesPerPdf: 100,
      chatQuestionsPerDoc: 10,
      documentLibrarySize: 50,
      batchUpload: false,
      apiAccess: false,
      priorityProcessing: false,
      exportFormats: true,
      sharedLibrary: false,
      adminDashboard: false,
      ssoIntegration: false,
      customBranding: false,
      support: "email",
    },
    cta: "Start Free Trial",
  },
  pro: {
    name: "Pro",
    price: {
      monthly: 19,
      yearly: 182, // 20% discount
    },
    features: {
      pdfsPerDay: "unlimited",
      maxPagesPerPdf: 500,
      chatQuestionsPerDoc: "unlimited",
      documentLibrarySize: 500,
      batchUpload: true,
      batchUploadLimit: 10,
      apiAccess: true,
      apiCallsPerMonth: 1000,
      priorityProcessing: true,
      exportFormats: true,
      sharedLibrary: false,
      adminDashboard: false,
      ssoIntegration: false,
      customBranding: false,
      support: "priority",
    },
    cta: "Start Free Trial",
    popular: true,
  },
  team: {
    name: "Team",
    price: {
      monthly: 49,
      yearly: 470, // 20% discount
    },
    features: {
      pdfsPerDay: "unlimited",
      maxPagesPerPdf: 500,
      chatQuestionsPerDoc: "unlimited",
      documentLibrarySize: 999999, // Effectively unlimited
      batchUpload: true,
      batchUploadLimit: 50,
      apiAccess: true,
      apiCallsPerMonth: 10000,
      priorityProcessing: true,
      exportFormats: true,
      teamSeats: 5,
      sharedLibrary: true,
      adminDashboard: true,
      ssoIntegration: true,
      customBranding: true,
      support: "dedicated",
    },
    cta: "Contact Sales",
  },
};

export function getPlanLimits(tier: PricingTier) {
  return PLANS[tier].features;
}

export function canPerformAction(
  tier: PricingTier,
  usage: number,
  action: keyof PlanFeatures["features"]
): boolean {
  const limit = PLANS[tier].features[action];

  if (limit === "unlimited") return true;
  if (typeof limit === "boolean") return limit;
  if (typeof limit === "number") return usage < limit;

  return false;
}

export function checkDailyPdfLimit(tier: PricingTier, todayCount: number): boolean {
  const limit = PLANS[tier].features.pdfsPerDay;
  if (limit === "unlimited") return true;
  return todayCount < limit;
}

export function checkChatQuestionLimit(tier: PricingTier, questionsAsked: number): boolean {
  const limit = PLANS[tier].features.chatQuestionsPerDoc;
  if (limit === "unlimited") return true;
  return questionsAsked < limit;
}
