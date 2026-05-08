import test from "node:test";
import assert from "node:assert/strict";
import { runAudit } from "./auditEngine.ts";
import type { SpendFormData } from "@/types";

test("runAudit keeps every official tool in scope", () => {
  const data: SpendFormData = {
    teamSize: 12,
    primaryUseCase: "mixed",
    tools: [
      { name: "Cursor", plan: "Ultra", seats: 1, monthlySpend: 200 },
      { name: "GitHub Copilot", plan: "Enterprise", seats: 5, monthlySpend: 195 },
      { name: "Claude", plan: "Max 20x", seats: 1, monthlySpend: 200 },
      { name: "ChatGPT", plan: "Pro 20x", seats: 1, monthlySpend: 200 },
      { name: "Anthropic", plan: "API Direct", seats: 12, monthlySpend: 300 },
      { name: "OpenAI", plan: "API Direct", seats: 12, monthlySpend: 450 },
      { name: "Gemini", plan: "Google AI Ultra", seats: 1, monthlySpend: 249.99 },
      { name: "Windsurf AI", plan: "Max", seats: 1, monthlySpend: 200 },
    ],
  };

  const result = runAudit(data);

  assert.equal(result.recommendations.length, 8);
});

test("Cursor checks seat fit, same-vendor downgrade, and coding alternatives", () => {
  const data: SpendFormData = {
    teamSize: 6,
    primaryUseCase: "coding",
    tools: [
      { name: "Cursor", plan: "Ultra", seats: 6, monthlySpend: 1200 },
    ],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.equal(rec.recommendedPlan, "GitHub Copilot Business");
  assert.ok(rec.consideredOptions.some((option) => option.kind === "seat-fit"));
  assert.ok(rec.consideredOptions.some((option) => option.kind === "same-vendor"));
  assert.ok(rec.consideredOptions.some((option) => option.kind === "alternative"));
});

test("Claude hits the 5-seat boundary and evaluates the team plan", () => {
  const data: SpendFormData = {
    teamSize: 5,
    primaryUseCase: "writing",
    tools: [
      { name: "Claude", plan: "Pro", seats: 5, monthlySpend: 100 },
    ],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.ok(
    rec.consideredOptions.some(
      (option) =>
        option.kind === "seat-fit" && option.label === "Team Standard (annual billing)"
    )
  );
});

test("ChatGPT recommends annual business billing for a team", () => {
  const data: SpendFormData = {
    teamSize: 6,
    primaryUseCase: "research",
    tools: [
      { name: "ChatGPT", plan: "Business", seats: 6, monthlySpend: 150 },
    ],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.ok(
    rec.consideredOptions.some(
      (option) =>
        option.kind === "same-vendor" && option.label === "Business (annual billing)"
    )
  );
  assert.equal(rec.recommendedPlan, "Gemini Workspace Business Standard (annual billing)");
  assert.equal(rec.strategy, "alternative");
});

test("OpenAI API recommends batch optimization and an alternative API profile", () => {
  const data: SpendFormData = {
    teamSize: 1,
    primaryUseCase: "data",
    tools: [
      { name: "OpenAI", plan: "API Direct", seats: 1, monthlySpend: 100 },
    ],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.ok(
    rec.consideredOptions.some(
      (option) => option.kind === "api-optimization" && option.label === "GPT-5.5 Batch"
    )
  );
  assert.ok(
    rec.consideredOptions.some(
      (option) =>
        option.kind === "alternative" && option.label === "Gemini Gemini 2.5 Flash Batch"
    )
  );
  assert.ok(rec.recommendedSpend < 50);
});

test("Gemini uses Workspace Standard as the business-seat fit plan", () => {
  const data: SpendFormData = {
    teamSize: 8,
    primaryUseCase: "research",
    tools: [
      {
        name: "Gemini",
        plan: "Google AI Pro",
        seats: 8,
        monthlySpend: 8 * 19.99,
      },
    ],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.ok(
    rec.consideredOptions.some(
      (option) =>
        option.kind === "seat-fit" &&
        option.label === "Workspace Business Standard (annual billing)"
    )
  );
  assert.equal(rec.recommendedPlan, "Workspace Business Standard (annual billing)");
});

test("Windsurf checks the cheaper coding alternative", () => {
  const data: SpendFormData = {
    teamSize: 1,
    primaryUseCase: "coding",
    tools: [{ name: "Windsurf AI", plan: "Max", seats: 1, monthlySpend: 200 }],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.equal(rec.recommendedPlan, "GitHub Copilot Pro (annual billing)");
});

test("Anthropic API uses the API alternative path for research workloads", () => {
  const data: SpendFormData = {
    teamSize: 3,
    primaryUseCase: "research",
    tools: [{ name: "Anthropic", plan: "API Direct", seats: 3, monthlySpend: 240 }],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.ok(rec.recommendedSpend < 120);
  assert.ok(rec.reason.includes("3:1 input-to-output token mix"));
});

test("GitHub Copilot can step down from enterprise to business", () => {
  const data: SpendFormData = {
    teamSize: 4,
    primaryUseCase: "coding",
    tools: [{ name: "GitHub Copilot", plan: "Enterprise", seats: 4, monthlySpend: 156 }],
  };

  const result = runAudit(data);
  const rec = result.recommendations[0];

  assert.equal(rec.recommendedPlan, "Business");
  assert.equal(rec.recommendedSpend, 76);
});

test("CTA threshold is inclusive at $500 monthly savings", () => {
  const belowThreshold = runAudit({
    teamSize: 24,
    primaryUseCase: "coding",
    tools: [
      { name: "GitHub Copilot", plan: "Enterprise", seats: 24, monthlySpend: 936 },
    ],
  });
  assert.equal(belowThreshold.showCredexCTA, false);

  const atThreshold = runAudit({
    teamSize: 25,
    primaryUseCase: "coding",
    tools: [
      { name: "GitHub Copilot", plan: "Enterprise", seats: 25, monthlySpend: 975 },
    ],
  });
  assert.equal(atThreshold.showCredexCTA, true);
});
