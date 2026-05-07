import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateTotalMonthlySpend,
  TOOLS_CONFIG,
  createInitialFormData,
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

test("calculateTotalMonthlySpend multiplies monthly spend by seats", () => {
  const total = calculateTotalMonthlySpend([
    { name: "Cursor", plan: "Pro", seats: 3, monthlySpend: 20 },
    { name: "ChatGPT", plan: "Team", seats: 5, monthlySpend: 30 },
    { name: "Claude", plan: "Max", seats: 1, monthlySpend: 100 },
  ]);

  assert.equal(total, 310);
});
