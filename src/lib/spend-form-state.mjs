/** @typedef {import("../types").SpendFormData} SpendFormData */
import {
  TOOL_PRICING_CATALOG,
  getFormPlans,
  getFixedPlan,
  getStandardMonthlySpend,
} from "./pricingCatalog.ts";

export const TOOLS_CONFIG = TOOL_PRICING_CATALOG.map((tool) => ({
  name: tool.toolName,
  plans: [...tool.formPlans],
}));

/** @param {import("../types").ToolEntry} tool */
export function getToolMonthlySpend(tool) {
  const fixedPlan = getFixedPlan(tool.name, tool.plan);
  const monthly = fixedPlan ? getStandardMonthlySpend(fixedPlan, tool.seats) : null;

  return monthly !== null ? monthly : toNonNegativeNumber(tool.monthlySpend, 0);
}

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
  const defaultTools = TOOLS_CONFIG.map((tool) => {
    const entry = {
      name: tool.name,
      plan: tool.plans[0] ?? "Unknown",
      seats: 1,
      monthlySpend: 0,
    };

    return {
      ...entry,
      monthlySpend: getToolMonthlySpend(entry),
    };
  });

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
      const knownToolNames = TOOLS_CONFIG.map((t) => t.name);
      const normalizedStoredTools = storedTools
        .filter((entry) => knownToolNames.includes(entry?.name))
        .map((storedTool) => {
          const catalogTool = TOOLS_CONFIG.find((t) => t.name === storedTool.name);
          const normalizedTool = {
            name: storedTool.name,
            plan:
              catalogTool && catalogTool.plans.includes(storedTool?.plan)
                ? storedTool.plan
                : catalogTool?.plans[0] ?? "Unknown",
            seats: toPositiveInteger(storedTool?.seats, 1),
            monthlySpend: toNonNegativeNumber(storedTool?.monthlySpend, 0),
          };

          return {
            ...normalizedTool,
            monthlySpend:
              normalizedTool.monthlySpend > 0
                ? normalizedTool.monthlySpend
                : getToolMonthlySpend(normalizedTool),
          };
        });

      const tools = TOOLS_CONFIG.map((configTool) => {
        const storedTool = normalizedStoredTools.find((tool) => tool.name === configTool.name);

        if (storedTool) {
          return storedTool;
        }

        const defaultEntry = {
          name: configTool.name,
          plan: configTool.plans[0] ?? "Unknown",
          seats: 1,
          monthlySpend: 0,
        };

        return {
          ...defaultEntry,
          monthlySpend: getToolMonthlySpend(defaultEntry),
        };
      });

      return {
        teamSize: toPositiveInteger(parsed?.teamSize, fallback.teamSize),
        primaryUseCase: PRIMARY_USE_CASES.has(parsed?.primaryUseCase)
          ? parsed.primaryUseCase
          : fallback.primaryUseCase,
        tools,
      };
    }
  } catch {
    return fallback;
  }

  return fallback;
}
