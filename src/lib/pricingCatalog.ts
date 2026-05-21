import type { SpendFormData } from "@/types";

export type PrimaryUseCase = SpendFormData["primaryUseCase"];

export type ToolName =
  | "Cursor"
  | "GitHub Copilot"
  | "Claude"
  | "ChatGPT"
  | "Anthropic"
  | "OpenAI"
  | "Gemini"
  | "Windsurf AI";

export interface PricingSource {
  url: string;
  verifiedAt: string;
}

export interface FixedPlanDefinition {
  label: string;
  category: "free" | "consumer" | "business" | "enterprise";
  monthlyPrice: number | null;
  annualMonthlyPrice?: number;
  seatMinimum?: number;
  recommendedFromSeats?: number;
  order: number;
  source: PricingSource;
  note?: string;
}

export interface ApiProfileDefinition {
  label: string;
  standardInputPer1M: number;
  standardOutputPer1M: number;
  cachedInputPer1M?: number;
  batchInputPer1M?: number;
  batchOutputPer1M?: number;
  order: number;
  source: PricingSource;
  note?: string;
}

export interface ToolPricingDefinition {
  toolName: ToolName;
  useCaseGroup: "coding" | "assistant" | "api";
  formPlans: string[];
  fixedPlans: FixedPlanDefinition[];
  apiProfiles: ApiProfileDefinition[];
  businessThreshold?: number;
  recommendedBusinessPlan?: string;
  alternativePlanByUseCase?: Partial<Record<PrimaryUseCase, ToolPlanReference>>;
}

export interface ToolPlanReference {
  toolName: ToolName;
  label: string;
}

const VERIFIED_AT = "2026-05-08";

const SOURCES = {
  cursor: { url: "https://cursor.com/pricing", verifiedAt: VERIFIED_AT },
  copilotPlans: {
    url: "https://github.com/features/copilot/plans",
    verifiedAt: VERIFIED_AT,
  },
  copilotDocs: {
    url: "https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot",
    verifiedAt: VERIFIED_AT,
  },
  copilotBilling: {
    url: "https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/billing/organizations-and-enterprises",
    verifiedAt: VERIFIED_AT,
  },
  claudePricing: { url: "https://claude.com/pricing", verifiedAt: VERIFIED_AT },
  claudeSupport: {
    url: "https://support.claude.com/en/articles/9797557-about-claude-s-plan-options",
    verifiedAt: VERIFIED_AT,
  },
  anthropicApi: {
    url: "https://docs.anthropic.com/en/docs/about-claude/pricing",
    verifiedAt: VERIFIED_AT,
  },
  chatgptPricing: {
    url: "https://chatgpt.com/pricing",
    verifiedAt: VERIFIED_AT,
  },
  chatgptGo: {
    url: "https://openai.com/index/introducing-chatgpt-go/",
    verifiedAt: VERIFIED_AT,
  },
  chatgptPro: {
    url: "https://openai.com/index/introducing-chatgpt-pro/",
    verifiedAt: VERIFIED_AT,
  },
  openaiApi: {
    url: "https://openai.com/api/pricing/",
    verifiedAt: VERIFIED_AT,
  },
  googleOne: { url: "https://one.google.com/plans", verifiedAt: VERIFIED_AT },
  googleAiUltra: {
    url: "https://blog.google/products-and-platforms/products/google-one/google-ai-ultra/",
    verifiedAt: VERIFIED_AT,
  },
  googleWorkspace: {
    url: "https://workspace.google.com/pricing",
    verifiedAt: VERIFIED_AT,
  },
  geminiApi: { url: "https://ai.google.dev/pricing", verifiedAt: VERIFIED_AT },
  windsurfPricing: {
    url: "https://windsurf.com/pricing",
    verifiedAt: VERIFIED_AT,
  },
  windsurfDocs: {
    url: "https://docs.windsurf.com/windsurf/accounts/usage",
    verifiedAt: VERIFIED_AT,
  },
  windsurfEnterprise: {
    url: "https://windsurf.com/enterprise",
    verifiedAt: VERIFIED_AT,
  },
} as const;

export const TOOL_PRICING_CATALOG: readonly ToolPricingDefinition[] = [
  {
    toolName: "Cursor",
    useCaseGroup: "coding",
    formPlans: ["Hobby", "Pro", "Pro+", "Ultra", "Teams", "Enterprise"],
    fixedPlans: [
      {
        label: "Hobby",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.cursor,
      },
      {
        label: "Pro",
        category: "consumer",
        monthlyPrice: 25,
        order: 1,
        source: SOURCES.cursor,
      },
      {
        label: "Pro+",
        category: "consumer",
        monthlyPrice: 60,
        order: 2,
        source: SOURCES.cursor,
      },
      {
        label: "Ultra",
        category: "consumer",
        monthlyPrice: 200,
        order: 3,
        source: SOURCES.cursor,
      },
      {
        label: "Teams",
        category: "business",
        monthlyPrice: 40,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 4,
        source: SOURCES.cursor,
      },
      {
        label: "Enterprise",
        category: "enterprise",
        monthlyPrice: null,
        seatMinimum: 2,
        recommendedFromSeats: 10,
        order: 5,
        source: SOURCES.cursor,
        note: "Custom pricing.",
      },
    ],
    apiProfiles: [],
    businessThreshold: 2,
    recommendedBusinessPlan: "Teams",
    alternativePlanByUseCase: {
      coding: { toolName: "GitHub Copilot", label: "Pro" },
      mixed: { toolName: "GitHub Copilot", label: "Pro" },
    },
  },
  {
    toolName: "GitHub Copilot",
    useCaseGroup: "coding",
    formPlans: ["Free", "Pro", "Pro+", "Business", "Enterprise"],
    fixedPlans: [
      {
        label: "Free",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.copilotPlans,
      },
      {
        label: "Pro",
        category: "consumer",
        monthlyPrice: 10,
        annualMonthlyPrice: 100 / 12,
        order: 1,
        source: SOURCES.copilotDocs,
      },
      {
        label: "Pro+",
        category: "consumer",
        monthlyPrice: 39,
        annualMonthlyPrice: 390 / 12,
        order: 2,
        source: SOURCES.copilotDocs,
      },
      {
        label: "Business",
        category: "business",
        monthlyPrice: 19,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 3,
        source: SOURCES.copilotBilling,
      },
      {
        label: "Enterprise",
        category: "business",
        monthlyPrice: 39,
        seatMinimum: 2,
        recommendedFromSeats: 5,
        order: 4,
        source: SOURCES.copilotBilling,
      },
    ],
    apiProfiles: [],
    businessThreshold: 2,
    recommendedBusinessPlan: "Business",
    alternativePlanByUseCase: {
      coding: { toolName: "Cursor", label: "Pro" },
      mixed: { toolName: "Cursor", label: "Pro" },
    },
  },
  {
    toolName: "Claude",
    useCaseGroup: "assistant",
    formPlans: [
      "Free",
      "Pro",
      "Max 5x",
      "Max 20x",
      "Team Standard",
      "Team Premium",
      "Enterprise",
      "API Direct",
    ],
    fixedPlans: [
      {
        label: "Free",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.claudePricing,
      },
      {
        label: "Pro",
        category: "consumer",
        monthlyPrice: 20,
        annualMonthlyPrice: 17,
        order: 1,
        source: SOURCES.claudeSupport,
      },
      {
        label: "Max 5x",
        category: "consumer",
        monthlyPrice: 100,
        annualMonthlyPrice: 85,
        order: 2,
        source: SOURCES.claudeSupport,
      },
      {
        label: "Max 20x",
        category: "consumer",
        monthlyPrice: 200,
        annualMonthlyPrice: 170,
        order: 3,
        source: SOURCES.claudeSupport,
      },
      {
        label: "Team Standard",
        category: "business",
        monthlyPrice: 25,
        annualMonthlyPrice: 20,
        seatMinimum: 5,
        recommendedFromSeats: 5,
        order: 4,
        source: SOURCES.claudeSupport,
      },
      {
        label: "Team Premium",
        category: "business",
        monthlyPrice: 125,
        annualMonthlyPrice: 100,
        seatMinimum: 5,
        recommendedFromSeats: 5,
        order: 5,
        source: SOURCES.claudeSupport,
      },
      {
        label: "Enterprise",
        category: "enterprise",
        monthlyPrice: null,
        seatMinimum: 5,
        recommendedFromSeats: 25,
        order: 6,
        source: SOURCES.claudePricing,
        note: "Custom pricing.",
      },
    ],
    apiProfiles: [
      {
        label: "Claude Sonnet 4",
        standardInputPer1M: 3,
        standardOutputPer1M: 15,
        cachedInputPer1M: 0.3,
        batchInputPer1M: 1.5,
        batchOutputPer1M: 7.5,
        order: 0,
        source: SOURCES.anthropicApi,
      },
    ],
    businessThreshold: 5,
    recommendedBusinessPlan: "Team Standard",
    alternativePlanByUseCase: {
      writing: { toolName: "Gemini", label: "Google AI Pro" },
      research: { toolName: "Gemini", label: "Google AI Pro" },
      mixed: { toolName: "ChatGPT", label: "Plus" },
    },
  },
  {
    toolName: "ChatGPT",
    useCaseGroup: "assistant",
    formPlans: [
      "Free",
      "Go",
      "Plus",
      "Pro 5x",
      "Pro 20x",
      "Business",
      "Enterprise",
      "API Direct",
    ],
    fixedPlans: [
      {
        label: "Free",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.chatgptPricing,
      },
      {
        label: "Go",
        category: "consumer",
        monthlyPrice: 8,
        order: 1,
        source: SOURCES.chatgptGo,
      },
      {
        label: "Plus",
        category: "consumer",
        monthlyPrice: 20,
        order: 2,
        source: SOURCES.chatgptPricing,
      },
      {
        label: "Pro 5x",
        category: "consumer",
        monthlyPrice: 100,
        order: 3,
        source: SOURCES.chatgptPro,
      },
      {
        label: "Pro 20x",
        category: "consumer",
        monthlyPrice: 200,
        order: 4,
        source: SOURCES.chatgptPro,
      },
      {
        label: "Business",
        category: "business",
        monthlyPrice: 25,
        annualMonthlyPrice: 20,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 5,
        source: SOURCES.chatgptPricing,
      },
      {
        label: "Enterprise",
        category: "enterprise",
        monthlyPrice: null,
        seatMinimum: 2,
        recommendedFromSeats: 10,
        order: 6,
        source: SOURCES.chatgptPricing,
        note: "Custom pricing.",
      },
    ],
    apiProfiles: [
      {
        label: "GPT-5.5",
        standardInputPer1M: 5,
        standardOutputPer1M: 30,
        cachedInputPer1M: 0.5,
        batchInputPer1M: 2.5,
        batchOutputPer1M: 15,
        order: 0,
        source: SOURCES.openaiApi,
      },
      {
        label: "GPT-5.4 mini",
        standardInputPer1M: 0.75,
        standardOutputPer1M: 4.5,
        cachedInputPer1M: 0.075,
        batchInputPer1M: 0.375,
        batchOutputPer1M: 2.25,
        order: 1,
        source: SOURCES.openaiApi,
      },
    ],
    businessThreshold: 2,
    recommendedBusinessPlan: "Business",
    alternativePlanByUseCase: {
      writing: { toolName: "Gemini", label: "Google AI Pro" },
      research: { toolName: "Gemini", label: "Google AI Pro" },
      mixed: { toolName: "Claude", label: "Pro" },
    },
  },
  {
    toolName: "Anthropic",
    useCaseGroup: "api",
    formPlans: ["API Direct"],
    fixedPlans: [],
    apiProfiles: [
      {
        label: "Claude Sonnet 4",
        standardInputPer1M: 3,
        standardOutputPer1M: 15,
        cachedInputPer1M: 0.3,
        batchInputPer1M: 1.5,
        batchOutputPer1M: 7.5,
        order: 0,
        source: SOURCES.anthropicApi,
      },
    ],
    alternativePlanByUseCase: {
      coding: { toolName: "OpenAI", label: "GPT-5.4 mini Batch" },
      data: { toolName: "Gemini", label: "Gemini 2.5 Flash Batch" },
      mixed: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
      research: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
      writing: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
    },
  },
  {
    toolName: "OpenAI",
    useCaseGroup: "api",
    formPlans: ["API Direct"],
    fixedPlans: [],
    apiProfiles: [
      {
        label: "GPT-5.5",
        standardInputPer1M: 5,
        standardOutputPer1M: 30,
        cachedInputPer1M: 0.5,
        batchInputPer1M: 2.5,
        batchOutputPer1M: 15,
        order: 0,
        source: SOURCES.openaiApi,
      },
      {
        label: "GPT-5.4 mini",
        standardInputPer1M: 0.75,
        standardOutputPer1M: 4.5,
        cachedInputPer1M: 0.075,
        batchInputPer1M: 0.375,
        batchOutputPer1M: 2.25,
        order: 1,
        source: SOURCES.openaiApi,
      },
    ],
    alternativePlanByUseCase: {
      coding: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
      data: { toolName: "Gemini", label: "Gemini 2.5 Flash Batch" },
      mixed: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
      research: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
      writing: { toolName: "Gemini", label: "Gemini 2.5 Pro Batch" },
    },
  },
  {
    toolName: "Gemini",
    useCaseGroup: "assistant",
    formPlans: [
      "Free",
      "Google AI Pro",
      "Google AI Ultra",
      "Workspace Business Starter",
      "Workspace Business Standard",
      "Workspace Business Plus",
      "Enterprise",
      "API Direct",
    ],
    fixedPlans: [
      {
        label: "Free",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.googleOne,
      },
      {
        label: "Google AI Pro",
        category: "consumer",
        monthlyPrice: 19.99,
        order: 1,
        source: SOURCES.googleOne,
      },
      {
        label: "Google AI Ultra",
        category: "consumer",
        monthlyPrice: 249.99,
        order: 2,
        source: SOURCES.googleAiUltra,
      },
      {
        label: "Workspace Business Starter",
        category: "business",
        monthlyPrice: 8.4,
        annualMonthlyPrice: 7,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 3,
        source: SOURCES.googleWorkspace,
        note: "Includes Gemini in Gmail and the Gemini app.",
      },
      {
        label: "Workspace Business Standard",
        category: "business",
        monthlyPrice: 16.8,
        annualMonthlyPrice: 14,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 4,
        source: SOURCES.googleWorkspace,
        note: "Google markets this tier as unlocking expanded Gemini access.",
      },
      {
        label: "Workspace Business Plus",
        category: "business",
        monthlyPrice: 26.4,
        annualMonthlyPrice: 22,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 5,
        source: SOURCES.googleWorkspace,
      },
      {
        label: "Enterprise",
        category: "enterprise",
        monthlyPrice: null,
        seatMinimum: 2,
        recommendedFromSeats: 10,
        order: 6,
        source: SOURCES.googleWorkspace,
        note: "Custom pricing.",
      },
    ],
    apiProfiles: [
      {
        label: "Gemini 2.5 Pro",
        standardInputPer1M: 1.25,
        standardOutputPer1M: 10,
        cachedInputPer1M: 0.125,
        batchInputPer1M: 0.625,
        batchOutputPer1M: 5,
        order: 0,
        source: SOURCES.geminiApi,
      },
      {
        label: "Gemini 2.5 Flash",
        standardInputPer1M: 0.3,
        standardOutputPer1M: 2.5,
        cachedInputPer1M: 0.03,
        batchInputPer1M: 0.15,
        batchOutputPer1M: 1.25,
        order: 1,
        source: SOURCES.geminiApi,
      },
    ],
    businessThreshold: 2,
    recommendedBusinessPlan: "Workspace Business Standard",
    alternativePlanByUseCase: {
      coding: { toolName: "ChatGPT", label: "Plus" },
      mixed: { toolName: "ChatGPT", label: "Plus" },
      research: { toolName: "Claude", label: "Pro" },
      writing: { toolName: "ChatGPT", label: "Plus" },
    },
  },
  {
    toolName: "Windsurf AI",
    useCaseGroup: "coding",
    formPlans: ["Free", "Pro", "Max", "Teams", "Enterprise"],
    fixedPlans: [
      {
        label: "Free",
        category: "free",
        monthlyPrice: 0,
        order: 0,
        source: SOURCES.windsurfPricing,
      },
      {
        label: "Pro",
        category: "consumer",
        monthlyPrice: 20,
        order: 1,
        source: SOURCES.windsurfPricing,
      },
      {
        label: "Max",
        category: "consumer",
        monthlyPrice: 200,
        order: 2,
        source: SOURCES.windsurfPricing,
      },
      {
        label: "Teams",
        category: "business",
        monthlyPrice: 40,
        seatMinimum: 2,
        recommendedFromSeats: 2,
        order: 3,
        source: SOURCES.windsurfEnterprise,
      },
      {
        label: "Enterprise",
        category: "enterprise",
        monthlyPrice: null,
        seatMinimum: 2,
        recommendedFromSeats: 10,
        order: 4,
        source: SOURCES.windsurfPricing,
        note: "Custom pricing.",
      },
    ],
    apiProfiles: [],
    businessThreshold: 2,
    recommendedBusinessPlan: "Teams",
    alternativePlanByUseCase: {
      coding: { toolName: "GitHub Copilot", label: "Pro" },
      mixed: { toolName: "GitHub Copilot", label: "Pro" },
    },
  },
] as const;

export const API_USAGE_ASSUMPTION = "3:1 input-to-output token mix";

export function getToolPricing(toolName: string): ToolPricingDefinition | undefined {
  return TOOL_PRICING_CATALOG.find((tool) => tool.toolName === toolName);
}

export function getFormPlans(toolName: string): string[] {
  return getToolPricing(toolName)?.formPlans ?? [];
}

export function getFixedPlan(
  toolName: string,
  planLabel: string
): FixedPlanDefinition | undefined {
  return getToolPricing(toolName)?.fixedPlans.find(
    (plan) => plan.label === planLabel
  );
}

export function getApiProfile(
  toolName: string,
  label?: string
): ApiProfileDefinition | undefined {
  const profiles = getToolPricing(toolName)?.apiProfiles ?? [];

  if (!label) {
    return profiles[0];
  }

  return profiles.find((profile) => profile.label === label);
}

export function getAnnualOrMonthlySpend(
  plan: FixedPlanDefinition,
  seats: number,
  preferAnnual = true
): number | null {
  if (plan.monthlyPrice === null) {
    return null;
  }

  const pricePerSeat =
    preferAnnual && plan.annualMonthlyPrice !== undefined
      ? plan.annualMonthlyPrice
      : plan.monthlyPrice;

  return roundCurrency(pricePerSeat * seats);
}

export function getStandardMonthlySpend(
  plan: FixedPlanDefinition,
  seats: number
): number | null {
  if (plan.monthlyPrice === null) {
    return null;
  }

  return roundCurrency(plan.monthlyPrice * seats);
}

export function estimateApiBlendRate(
  profile: ApiProfileDefinition,
  mode: "standard" | "batch"
): number {
  const input =
    mode === "batch"
      ? profile.batchInputPer1M ?? profile.standardInputPer1M
      : profile.standardInputPer1M;
  const output =
    mode === "batch"
      ? profile.batchOutputPer1M ?? profile.standardOutputPer1M
      : profile.standardOutputPer1M;

  return roundCurrency((input * 3 + output) / 4);
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export const PRICING_SNAPSHOT_VERSION = "2026-05-08";

export const getCurrentPricingSnapshot = () => ({
  version: PRICING_SNAPSHOT_VERSION,
  catalog: TOOL_PRICING_CATALOG,
});

export function detectPricingChanges(snapshot: ReturnType<typeof getCurrentPricingSnapshot>): string[] {
  const current = TOOL_PRICING_CATALOG;
  const changedTools: string[] = [];

  snapshot.catalog.forEach((oldTool: any) => {
    const currentTool = current.find((t) => t.toolName === oldTool.toolName);
    if (!currentTool) return;

    // Compare fixed plans
    oldTool.fixedPlans.forEach((oldPlan: any) => {
      const currentPlan = currentTool.fixedPlans.find((p) => p.label === oldPlan.label);
      if (
        currentPlan &&
        (currentPlan.monthlyPrice !== oldPlan.monthlyPrice ||
          currentPlan.annualMonthlyPrice !== oldPlan.annualMonthlyPrice)
      ) {
        if (!changedTools.includes(oldTool.toolName)) {
          changedTools.push(oldTool.toolName as string);
        }
      }
    });

    // Compare API profiles
    oldTool.apiProfiles.forEach((oldProfile: any) => {
      const currentProfile = currentTool.apiProfiles.find((p) => p.label === oldProfile.label);
      if (
        currentProfile &&
        (currentProfile.standardInputPer1M !== oldProfile.standardInputPer1M ||
          currentProfile.standardOutputPer1M !== oldProfile.standardOutputPer1M)
      ) {
        if (!changedTools.includes(oldTool.toolName)) {
          changedTools.push(oldTool.toolName as string);
        }
      }
    });
  });

  return changedTools;
}


