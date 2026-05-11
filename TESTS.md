# TESTS.md

## How to Run

```bash
node --experimental-strip-types --test src/lib/spend-form-state.test.mjs src/lib/auditEngine.test.mts
```

No additional dependencies required. Uses Node's built-in test runner (`node:test`) with `--experimental-strip-types` for TypeScript support.

---

## Test Suites

### `src/lib/auditEngine.test.mts` — Audit Engine (10 tests)

| # | Test Name | What It Covers |
|---|-----------|----------------|
| 1 | `runAudit keeps every official tool in scope` | All 8 tools submitted → 8 recommendations returned. Ensures no tool is silently dropped from the audit. |
| 2 | `Cursor checks seat fit, same-vendor downgrade, and coding alternatives` | Cursor Ultra × 6 seats → recommends GitHub Copilot Business. Verifies all three option kinds (seat-fit, same-vendor, alternative) are considered. |
| 3 | `Claude hits the 5-seat boundary and evaluates the team plan` | Claude Pro × 5 seats → seat-fit option for Team Standard (annual billing) appears in consideredOptions. Tests the business threshold boundary. |
| 4 | `ChatGPT recommends annual business billing for a team` | ChatGPT Business × 6 seats → same-vendor annual option present, final recommendation is Gemini Workspace Business Standard. Tests cross-tool alternative routing. |
| 5 | `OpenAI API recommends batch optimization and an alternative API profile` | OpenAI API Direct → api-optimization (GPT-5.5 Batch) and alternative (Gemini 2.5 Flash Batch) both appear; recommendedSpend < $50 on $100 input. |
| 6 | `Gemini uses Workspace Standard as the business-seat fit plan` | Gemini Google AI Pro × 8 seats → seat-fit resolves to Workspace Business Standard (annual billing) and wins as recommendedPlan. |
| 7 | `Windsurf checks the cheaper coding alternative` | Windsurf Max × 1 seat → recommendedPlan is GitHub Copilot Pro (annual billing). Tests coding use-case alternative routing. |
| 8 | `Anthropic API uses the API alternative path for research workloads` | Anthropic API Direct × 3 seats, $240 spend → recommendedSpend < $120, reason includes the documented 3:1 token mix assumption. |
| 9 | `GitHub Copilot can step down from enterprise to business` | GitHub Copilot Enterprise × 4 seats, $156 spend → recommendedPlan is Business, recommendedSpend is exactly $76. |
| 10 | `CTA threshold is inclusive at $500 monthly savings` | 24 Enterprise seats ($936 spend) → showCredexCTA false. 25 Enterprise seats ($975 spend) → showCredexCTA true. Tests the inclusive boundary. |

---

### `src/lib/spend-form-state.test.mjs` — Form State (5 tests)

| # | Test Name | What It Covers |
|---|-----------|----------------|
| 1 | `createInitialFormData creates one default entry per configured tool` | Initial form state has teamSize 1, primaryUseCase "coding", one entry per tool with correct defaults. |
| 2 | `getToolPlans exposes the researched official plans for all 8 tools` | Plan lists for all 8 tools match the official pricing pages exactly — acts as a regression guard on plan data. |
| 3 | `restoreSpendFormData merges saved values with tool defaults` | Saved data with a valid tool (ChatGPT Enterprise) and an invalid one (Cursor with bad plan/seats) → valid entry restored as-is, invalid entry falls back to defaults while keeping monthlySpend. |
| 4 | `calculateTotalMonthlySpend sums monthly spend for all tools` | Three tools with spend 20 + 30 + 100 → total is exactly 150. |
| 5 | `restoreSpendFormData computes monthlySpend from plan and seats when saved value is zero` | GitHub Copilot Pro × 2 seats with monthlySpend 0 → restored with computed spend of $20. |

---

## Results

```
✔ runAudit keeps every official tool in scope
✔ Cursor checks seat fit, same-vendor downgrade, and coding alternatives
✔ Claude hits the 5-seat boundary and evaluates the team plan
✔ ChatGPT recommends annual business billing for a team
✔ OpenAI API recommends batch optimization and an alternative API profile
✔ Gemini uses Workspace Standard as the business-seat fit plan
✔ Windsurf checks the cheaper coding alternative
✔ Anthropic API uses the API alternative path for research workloads
✔ GitHub Copilot can step down from enterprise to business
✔ CTA threshold is inclusive at $500 monthly savings
✔ createInitialFormData creates one default entry per configured tool
✔ getToolPlans exposes the researched official plans for all 8 tools
✔ restoreSpendFormData merges saved values with tool defaults
✔ calculateTotalMonthlySpend sums monthly spend for all tools
✔ restoreSpendFormData computes monthlySpend from plan and seats when saved value is zero

tests 15 | pass 15 | fail 0
```