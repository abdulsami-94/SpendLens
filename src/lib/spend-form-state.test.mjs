import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateTotalMonthlySpend,
  TOOLS_CONFIG,
  createInitialFormData,
  getToolPlans,
  restoreSpendFormData,
} from "./spend-form-state.mjs";

test("createInitialFormData creates one default entry per configured tool", () => {
  const formData = createInitialFormData();

  assert.equal(formData.teamSize, 1);
  assert.equal(formData.primaryUseCase, "coding");
  assert.equal(formData.tools.length, TOOLS_CONFIG.length);
  assert.deepEqual(formData.tools[0], {
    name: "Cursor",
    plan: "Hobby",
    seats: 1,
    monthlySpend: 0,
  });
});

test("getToolPlans exposes the researched official plans for all 8 tools", () => {
  assert.deepEqual(getToolPlans("Cursor"), [
    "Hobby",
    "Pro",
    "Pro+",
    "Ultra",
    "Teams",
    "Enterprise",
  ]);
  assert.deepEqual(getToolPlans("GitHub Copilot"), [
    "Free",
    "Pro",
    "Pro+",
    "Business",
    "Enterprise",
  ]);
  assert.deepEqual(getToolPlans("Claude"), [
    "Free",
    "Pro",
    "Max 5x",
    "Max 20x",
    "Team Standard",
    "Team Premium",
    "Enterprise",
    "API Direct",
  ]);
  assert.deepEqual(getToolPlans("ChatGPT"), [
    "Free",
    "Go",
    "Plus",
    "Pro 5x",
    "Pro 20x",
    "Business",
    "Enterprise",
    "API Direct",
  ]);
  assert.deepEqual(getToolPlans("Anthropic"), ["API Direct"]);
  assert.deepEqual(getToolPlans("OpenAI"), ["API Direct"]);
  assert.deepEqual(getToolPlans("Gemini"), [
    "Free",
    "Google AI Pro",
    "Google AI Ultra",
    "Workspace Business Starter",
    "Workspace Business Standard",
    "Workspace Business Plus",
    "Enterprise",
    "API Direct",
  ]);
  assert.deepEqual(getToolPlans("Windsurf AI"), [
    "Free",
    "Pro",
    "Max",
    "Teams",
    "Enterprise",
  ]);
});

test("restoreSpendFormData merges saved values with tool defaults", () => {
  const restored = restoreSpendFormData(
    JSON.stringify({
      teamSize: 12,
      primaryUseCase: "research",
      tools: [
        {
          name: "ChatGPT",
          plan: "Enterprise",
          seats: 8,
          monthlySpend: 240,
        },
        {
          name: "Cursor",
          plan: "Invalid Plan",
          seats: -4,
          monthlySpend: 99,
        },
      ],
    })
  );

  assert.equal(restored.teamSize, 12);
  assert.equal(restored.primaryUseCase, "research");

  const chatgpt = restored.tools.find((tool) => tool.name === "ChatGPT");
  assert.deepEqual(chatgpt, {
    name: "ChatGPT",
    plan: "Enterprise",
    seats: 8,
    monthlySpend: 240,
  });

  const cursor = restored.tools.find((tool) => tool.name === "Cursor");
  assert.deepEqual(cursor, {
    name: "Cursor",
    plan: "Hobby",
    seats: 1,
    monthlySpend: 99,
  });

  assert.equal(restored.tools.length, TOOLS_CONFIG.length);
});

test("calculateTotalMonthlySpend sums monthly spend for all tools", () => {
  const total = calculateTotalMonthlySpend([
    { name: "Cursor", plan: "Pro", seats: 3, monthlySpend: 20 },
    { name: "ChatGPT", plan: "Business", seats: 5, monthlySpend: 30 },
    { name: "Claude", plan: "Max 5x", seats: 1, monthlySpend: 100 },
  ]);

  assert.equal(total, 150);
});

test("restoreSpendFormData computes monthlySpend from plan and seats when saved value is zero", () => {
  const restored = restoreSpendFormData(
    JSON.stringify({
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        {
          name: "GitHub Copilot",
          plan: "Pro",
          seats: 2,
          monthlySpend: 0,
        },
      ],
    })
  );

  const copilot = restored.tools.find((tool) => tool.name === "GitHub Copilot");
  assert.deepEqual(copilot, {
    name: "GitHub Copilot",
    plan: "Pro",
    seats: 2,
    monthlySpend: 20,
  });
});
