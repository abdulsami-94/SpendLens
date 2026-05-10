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
  const defaultNames = ["Cursor", "GitHub Copilot", "Claude"];
  const defaultTools = defaultNames
    .map((name) => TOOLS_CONFIG.find((t) => t.name === name))
    .filter(Boolean)
    .map((tool) => ({
      name: tool.name,
      plan: tool.plans[0] ?? "Unknown",
      seats: 1,
      monthlySpend: 0,
    }));

  return {
    tools: defaultTools,
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
    const storedTools = Array.isArray(parsed?.tools) ? parsed.tools : null;

    if (storedTools && storedTools.length > 0) {
      // Validate stored tools against TOOLS_CONFIG and normalize
      const validToolNames = TOOLS_CONFIG.map((t) => t.name);
      const tools = storedTools
        .filter((entry) => validToolNames.includes(entry?.name))
        .map((storedTool) => {
          const catalogTool = TOOLS_CONFIG.find((t) => t.name === storedTool.name);
          return {
            name: storedTool.name,
            plan:
              catalogTool && catalogTool.plans.includes(storedTool?.plan)
                ? storedTool.plan
                : catalogTool?.plans[0] ?? "Unknown",
            seats: toPositiveInteger(storedTool?.seats, 1),
            monthlySpend: toNonNegativeNumber(storedTool?.monthlySpend, 0),
          };
        });

      // If no valid stored tools found, fall back
      return tools.length > 0
        ? {
            teamSize: toPositiveInteger(parsed?.teamSize, fallback.teamSize),
            primaryUseCase: PRIMARY_USE_CASES.has(parsed?.primaryUseCase)
              ? parsed.primaryUseCase
              : fallback.primaryUseCase,
            tools,
          }
        : fallback;
    }

    return fallback;
  } catch {
    return fallback;
  }
}
