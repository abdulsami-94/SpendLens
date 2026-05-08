/** @typedef {import("../types").SpendFormData} SpendFormData */
import { TOOL_PRICING_CATALOG, getFormPlans } from "./pricingCatalog.ts";

export const TOOLS_CONFIG = TOOL_PRICING_CATALOG.map((tool) => ({
  name: tool.toolName,
  plans: [...tool.formPlans],
}));

export const SPEND_FORM_STORAGE_KEY = "spendlens-spend-form";

const PRIMARY_USE_CASES = new Set([
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
]);

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeNumber(value, fallback) {
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function getToolPlans(toolName) {
  return getFormPlans(toolName);
}

/** @returns {SpendFormData} */
export function createInitialFormData() {
  return {
    tools: TOOLS_CONFIG.map((tool) => ({
      name: tool.name,
      plan: tool.plans[0] ?? "Unknown",
      seats: 1,
      monthlySpend: 0,
    })),
    teamSize: 1,
    primaryUseCase: "coding",
  };
}

export function calculateTotalMonthlySpend(tools) {
  return tools.reduce((total, tool) => total + tool.monthlySpend, 0);
}

/** @param {string | null} rawValue */
/** @returns {SpendFormData} */
export function restoreSpendFormData(rawValue) {
  const fallback = createInitialFormData();

  if (!rawValue) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(rawValue);
    const storedTools = Array.isArray(parsed?.tools) ? parsed.tools : [];

    return {
      teamSize: toPositiveInteger(parsed?.teamSize, fallback.teamSize),
      primaryUseCase: PRIMARY_USE_CASES.has(parsed?.primaryUseCase)
        ? parsed.primaryUseCase
        : fallback.primaryUseCase,
      tools: TOOLS_CONFIG.map((tool) => {
        const storedTool = storedTools.find(
          (entry) => entry?.name === tool.name
        );

        return {
          name: tool.name,
          plan: tool.plans.includes(storedTool?.plan)
            ? storedTool.plan
            : tool.plans[0] ?? "Unknown",
          seats: toPositiveInteger(storedTool?.seats, 1),
          monthlySpend: toNonNegativeNumber(storedTool?.monthlySpend, 0),
        };
      }),
    };
  } catch {
    return fallback;
  }
}
