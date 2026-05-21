import type { SpendFormData, ToolEntry } from "@/types";

import {
  API_USAGE_ASSUMPTION,
  estimateApiBlendRate,
  getAnnualOrMonthlySpend,
  getApiProfile,
  getFixedPlan,
  getStandardMonthlySpend,
  getToolPricing,
  getCurrentPricingSnapshot,
  type FixedPlanDefinition,
} from "./pricingCatalog.ts";

type RecommendationKind =
  | "current"
  | "seat-fit"
  | "same-vendor"
  | "alternative"
  | "api-optimization";

export interface RecommendationOption {
  kind: RecommendationKind;
  label: string;
  spend: number;
  reason: string;
}

export interface AuditRecommendation {
  toolName: string;
  currentPlan: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSpend: number;
  savings: number;
  reason: string;
  strategy: RecommendationKind;
  strategyLabel: string;
  consideredOptions: RecommendationOption[];
}

export interface AuditResult {
  id: string;
  recommendations: AuditRecommendation[];
  totalCurrentSpend: number;
  totalRecommendedSpend: number;
  totalSavingsMonthly: number;
  totalSavingsAnnual: number;
  showCredexCTA: boolean;
  isOptimal: boolean;
  inputData: SpendFormData;
  aiSummary?: string;
  pricingSnapshot?: ReturnType<typeof getCurrentPricingSnapshot>;
}

const CREDex_SAVINGS_THRESHOLD = 500;
const OPTIMAL_SAVINGS_THRESHOLD = 10;
const EPSILON = 0.01;

const STRATEGY_LABELS: Record<RecommendationKind, string> = {
  current: "Keep current setup",
  "seat-fit": "Seat-fit business plan",
  "same-vendor": "Cheaper plan from same vendor",
  alternative: "Cheaper alternative for the use case",
  "api-optimization": "API optimization",
};

export function runAudit(data: SpendFormData): AuditResult {
  const activeTools = data.tools.filter((tool) => tool.monthlySpend > 0);
  const recommendations = activeTools.map((tool) => evaluateTool(tool, data));
  const totalCurrentSpend = roundCurrency(
    recommendations.reduce((total, recommendation) => total + recommendation.currentSpend, 0)
  );
  const totalRecommendedSpend = roundCurrency(
    recommendations.reduce(
      (total, recommendation) => total + recommendation.recommendedSpend,
      0
    )
  );
  const totalSavingsMonthly = roundCurrency(
    totalCurrentSpend - totalRecommendedSpend
  );

  return {
    id: crypto.randomUUID(),
    recommendations,
    totalCurrentSpend,
    totalRecommendedSpend,
    totalSavingsMonthly,
    totalSavingsAnnual: roundCurrency(totalSavingsMonthly * 12),
    showCredexCTA: totalSavingsMonthly >= CREDex_SAVINGS_THRESHOLD,
    isOptimal: totalSavingsMonthly <= OPTIMAL_SAVINGS_THRESHOLD,
    inputData: data,
    pricingSnapshot: getCurrentPricingSnapshot(),
  };
}

function evaluateTool(tool: ToolEntry, data: SpendFormData): AuditRecommendation {
  const options = buildOptions(tool, data)
    .map((option) => ({
      ...option,
      spend: roundCurrency(option.spend),
    }))
    .sort((left, right) => left.spend - right.spend);
  const currentOption = options.find((option) => option.kind === "current");
  const winningOption = pickWinningOption(options);
  const currentSpend = currentOption?.spend ?? roundCurrency(tool.monthlySpend);
  const recommendedSpend = winningOption.spend;

  return {
    toolName: tool.name,
    currentPlan: tool.plan,
    currentSpend,
    recommendedPlan: winningOption.label,
    recommendedSpend,
    savings: roundCurrency(Math.max(0, currentSpend - recommendedSpend)),
    reason:
      winningOption.kind === "current"
        ? "Current spend already beats the seat-fit, same-vendor, annual, API, and cross-tool alternatives we checked."
        : winningOption.reason,
    strategy: winningOption.kind,
    strategyLabel: STRATEGY_LABELS[winningOption.kind],
    consideredOptions: dedupeOptions(options),
  };
}

function buildOptions(
  tool: ToolEntry,
  data: SpendFormData
): RecommendationOption[] {
  const options: RecommendationOption[] = [
    {
      kind: "current",
      label: tool.plan,
      spend: tool.monthlySpend,
      reason: "Keep the current setup.",
    },
  ];

  const fixedPlan = getFixedPlan(tool.name, tool.plan);
  const toolPricing = getToolPricing(tool.name);

  if (fixedPlan) {
    const listPrice = getStandardMonthlySpend(fixedPlan, tool.seats);
    if (listPrice !== null && listPrice + EPSILON < tool.monthlySpend) {
      options.push({
        kind: "same-vendor",
        label: fixedPlan.label,
        spend: listPrice,
        reason: `Official list pricing for ${fixedPlan.label} is lower than the entered spend.`,
      });
    }

    const annualPrice = getAnnualOrMonthlySpend(fixedPlan, tool.seats, true);
    if (
      fixedPlan.annualMonthlyPrice !== undefined &&
      annualPrice !== null &&
      annualPrice + EPSILON < tool.monthlySpend
    ) {
      options.push({
        kind: "same-vendor",
        label: `${fixedPlan.label} (annual billing)`,
        spend: annualPrice,
        reason: `Official annual billing lowers ${fixedPlan.label} to ${formatSeatSpend(
          annualPrice,
          tool.seats
        )}.`,
      });
    }

    const cheaperSameVendorPlan = findCheaperSameVendorPlan(tool, fixedPlan);
    if (cheaperSameVendorPlan) {
      options.push(cheaperSameVendorPlan);
    }

    const seatFitOption = findSeatFitOption(tool, fixedPlan);
    if (seatFitOption) {
      options.push(seatFitOption);
    }
  }

  const alternativeOption = findUseCaseAlternativeOption(tool, data.primaryUseCase);
  if (alternativeOption) {
    options.push(alternativeOption);
  }

  if (tool.plan === "API Direct" || toolPricing?.useCaseGroup === "api") {
    const apiOptimization = buildApiOptimizationOption(tool);
    if (apiOptimization) {
      options.push(apiOptimization);
    }
  }

  return options;
}

function findCheaperSameVendorPlan(
  tool: ToolEntry,
  fixedPlan: FixedPlanDefinition
): RecommendationOption | null {
  const toolPricing = getToolPricing(tool.name);
  if (!toolPricing) {
    return null;
  }

  const plansInSegment = toolPricing.fixedPlans
    .filter((plan) => plan.category === fixedPlan.category)
    .filter((plan) => isPlanCompatible(plan, tool.seats))
    .sort((left, right) => left.order - right.order);

  const currentIndex = plansInSegment.findIndex((plan) => plan.label === fixedPlan.label);
  const cheaperPlan = plansInSegment
    .slice(0, currentIndex)
    .reverse()
    .find((plan) => plan.monthlyPrice !== null);

  if (!cheaperPlan) {
    return null;
  }

  const spend = getBestFixedPlanSpend(cheaperPlan, tool.seats);
  if (spend === null) {
    return null;
  }

  return {
    kind: "same-vendor",
    label: describePlanWithBilling(cheaperPlan),
    spend,
    reason: `The next cheaper ${tool.name} tier is ${describePlanWithBilling(
      cheaperPlan
    )}, which costs ${formatSeatSpend(spend, tool.seats)} at the documented rate.`,
  };
}

function findSeatFitOption(
  tool: ToolEntry,
  fixedPlan: FixedPlanDefinition
): RecommendationOption | null {
  const toolPricing = getToolPricing(tool.name);
  if (
    !toolPricing?.recommendedBusinessPlan ||
    toolPricing.businessThreshold === undefined ||
    tool.seats < toolPricing.businessThreshold ||
    fixedPlan.category !== "consumer"
  ) {
    return null;
  }

  const recommendedBusinessPlan = getFixedPlan(
    tool.name,
    toolPricing.recommendedBusinessPlan
  );
  if (!recommendedBusinessPlan || !isPlanCompatible(recommendedBusinessPlan, tool.seats)) {
    return null;
  }

  const spend = getBestFixedPlanSpend(recommendedBusinessPlan, tool.seats);
  if (spend === null) {
    return null;
  }

  return {
    kind: "seat-fit",
    label: describePlanWithBilling(recommendedBusinessPlan),
    spend,
    reason: `${tool.name} steers teams of ${toolPricing.businessThreshold}+ seats to ${recommendedBusinessPlan.label}; this is the documented seat-fit option we checked.`,
  };
}

function findUseCaseAlternativeOption(
  tool: ToolEntry,
  useCase: SpendFormData["primaryUseCase"]
): RecommendationOption | null {
  const toolPricing = getToolPricing(tool.name);
  const reference = resolveAlternativeReference(
    toolPricing?.alternativePlanByUseCase?.[useCase],
    tool.seats
  );
  if (!reference) {
    return null;
  }

  if (reference.label.endsWith("Batch")) {
    return buildApiAlternativeOption(tool, reference);
  }

  const targetPlan = getFixedPlan(reference.toolName, reference.label);
  if (!targetPlan || !isPlanCompatible(targetPlan, tool.seats)) {
    return null;
  }

  const spend = getBestFixedPlanSpend(targetPlan, tool.seats);
  if (spend === null) {
    return null;
  }

  return {
    kind: "alternative",
    label: `${reference.toolName} ${describePlanWithBilling(targetPlan)}`,
    spend,
    reason: `For ${useCase} work, ${reference.toolName} ${describePlanWithBilling(
      targetPlan
    )} is the lower-cost peer plan we checked.`,
  };
}

function resolveAlternativeReference(
  reference: { toolName: string; label: string } | undefined,
  seats: number
): { toolName: string; label: string } | undefined {
  if (!reference) {
    return reference;
  }

  const targetTool = getToolPricing(reference.toolName);
  const targetPlan = getFixedPlan(reference.toolName, reference.label);

  if (
    targetTool?.businessThreshold !== undefined &&
    seats >= targetTool.businessThreshold &&
    targetPlan?.category === "consumer" &&
    targetTool.recommendedBusinessPlan
  ) {
    return {
      toolName: reference.toolName,
      label: targetTool.recommendedBusinessPlan,
    };
  }

  return reference;
}

function buildApiOptimizationOption(tool: ToolEntry): RecommendationOption | null {
  const profile = getApiProfile(tool.name) ?? getApiProfile(mapApiProxy(tool.name));
  if (!profile || profile.batchInputPer1M === undefined || profile.batchOutputPer1M === undefined) {
    return null;
  }

  return {
    kind: "api-optimization",
    label: `${profile.label} Batch`,
    spend: tool.monthlySpend * 0.5,
    reason: `Batch processing is an official 50% discount for this API family, so it cuts the modeled spend in half before any model switch.`,
  };
}

function buildApiAlternativeOption(
  tool: ToolEntry,
  reference: { toolName: string; label: string }
): RecommendationOption | null {
  const currentProfile = getApiProfile(tool.name) ?? getApiProfile(mapApiProxy(tool.name));
  const targetLabel = reference.label.replace(/ Batch$/, "");
  const targetProfile =
    getApiProfile(reference.toolName, targetLabel) ?? getApiProfile(mapApiProxy(reference.toolName), targetLabel);

  if (!currentProfile || !targetProfile) {
    return null;
  }

  const currentRate = estimateApiBlendRate(currentProfile, "standard");
  const targetRate = estimateApiBlendRate(targetProfile, reference.label.endsWith("Batch") ? "batch" : "standard");
  if (currentRate <= 0) {
    return null;
  }

  return {
    kind: "alternative",
    label: `${reference.toolName} ${reference.label}`,
    spend: tool.monthlySpend * (targetRate / currentRate),
    reason: `Using ${API_USAGE_ASSUMPTION} from official per-token pricing, ${reference.toolName} ${reference.label} is the cheaper use-case alternative we checked.`,
  };
}

function mapApiProxy(toolName: string): string {
  if (toolName === "Anthropic") return "Claude";
  if (toolName === "OpenAI") return "ChatGPT";
  return toolName;
}

function getBestFixedPlanSpend(
  plan: FixedPlanDefinition,
  seats: number
): number | null {
  const annual = getAnnualOrMonthlySpend(plan, seats, true);
  const monthly = getStandardMonthlySpend(plan, seats);

  if (annual === null) return monthly;
  if (monthly === null) return annual;

  return Math.min(annual, monthly);
}

function describePlanWithBilling(plan: FixedPlanDefinition): string {
  if (
    plan.annualMonthlyPrice !== undefined &&
    plan.monthlyPrice !== null &&
    plan.annualMonthlyPrice < plan.monthlyPrice
  ) {
    return `${plan.label} (annual billing)`;
  }

  return plan.label;
}

function isPlanCompatible(plan: FixedPlanDefinition, seats: number): boolean {
  return plan.seatMinimum === undefined || seats >= plan.seatMinimum;
}

function pickWinningOption(options: RecommendationOption[]): RecommendationOption {
  return options.reduce((best, candidate) => {
    if (candidate.spend + EPSILON < best.spend) {
      return candidate;
    }

    if (Math.abs(candidate.spend - best.spend) <= EPSILON) {
      return priorityFor(candidate.kind) < priorityFor(best.kind) ? candidate : best;
    }

    return best;
  });
}

function priorityFor(kind: RecommendationKind): number {
  switch (kind) {
    case "current":
      return 0;
    case "same-vendor":
      return 1;
    case "seat-fit":
      return 2;
    case "api-optimization":
      return 3;
    case "alternative":
      return 4;
  }
}

function dedupeOptions(options: RecommendationOption[]): RecommendationOption[] {
  const seen = new Set<string>();

  return options.filter((option) => {
    const key = `${option.kind}:${option.label}:${roundCurrency(option.spend).toFixed(2)}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function formatSeatSpend(totalSpend: number, seats: number): string {
  if (seats <= 1) {
    return `$${roundCurrency(totalSpend).toFixed(2)}/mo`;
  }

  return `$${roundCurrency(totalSpend).toFixed(2)}/mo for ${seats} seats`;
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
