## Day 1 — 2026-05-06

**Hours worked:** 2

**What I did:** Initialised Next.js + TypeScript project with 
Tailwind. Created all required markdown files. Set up GitHub 
repo. Decided on app name (SpendLens). Reviewed full 
assignment brief and planned feature breakdown.

**What I learned:** The git history is checked programmatically 
— commits need to be spread across 5+ distinct days. 
Entrepreneurial files carry equal weight to code.

**Blockers / what I'm stuck on:** Need to start planning the 
audit engine logic — pricing rules will take time to research 
accurately.

**Plan for tomorrow:** Build the spend input form with all 
required tools. Set up form state persistence with localStorage.


## Day 2 — 2026-05-07

**Hours worked:** 4

**What I did:** Built the spend input form with all 8 required 
AI tools (Cursor, Copilot, Claude, ChatGPT, Anthropic API, 
OpenAI API, Gemini, Windsurf). Each row has plan selector, 
seats, and monthly spend input. Form state persists across 
reloads via localStorage with hydration safety handled via 
hasHydrated ref to avoid Next.js server/client mismatch.

**What I learned:** Hydration in Next.js — server renders 
default state, client renders localStorage state, so you need 
to defer localStorage reads until after first render.

**Blockers / what I'm stuck on:** Need to clarify audit engine 
logic — specifically how to handle API direct tools where 
there's no fixed plan pricing.

**Plan for tomorrow:** Build the audit engine. Hardcoded pricing 
rules for all 8 tools, research official pricing pages, populate 
PRICING_DATA.md with source URLs.

## Day 3 — 2026-05-08

**Hours worked:** 5

**What I did:** Finalized the core Audit Engine logic. Implemented vendor-specific rules for all 8 tools and integrated annual billing discounts (20%). Added "Consolidation Heuristics" to detect redundant tools (e.g., Cursor vs. Copilot). Built the Results Page UI, making Monthly Savings the primary hero metric. Verified and documented all pricing sources in PRICING_DATA.md. Set up a basic test suite using Node.js experimental TypeScript support.

## Day 4 — 2026-05-09

**Hours worked:** 3

**What I did:** 
- Supabase setup: created `audits` and `leads` tables, migrated audit store from local file storage to database.
- Gemini API integration: `/api/summary` endpoint generates personalized ~100-word summaries based on audit results, with fallback templated summary if API fails.
- Lead capture modal: appears 2 seconds after audit results load (never before), captures email, company, role, team size.
- Resend email integration: sends transactional confirmation email with link to audit report.
- Abuse protection: implemented **honeypot field** (hidden `website` field in form; rejects submission if filled by bot).

**Why honeypot over rate limiting:**
- Zero friction for real users (no false positives)
- Effective against typical bot spam
- Simple to implement and maintain
- No IP/email-based blocking that could accidentally exclude legitimate users

**What I learned:** Honeypot is a pragmatic first-line defense for lead forms. Rate limiting can come later if needed.

**Plan for tomorrow:** Shareable audit URLs with OG tags, UI polish, and deploy to Vercel.


**What I learned:** The importance of "defensible" logic—savings recommendations need to be based on actual usage patterns, not just low prices. Also learned how to use the Node.js ESM test runner with --experimental-strip-types for faster logic verification without a heavy test framework.

**Blockers / what I'm stuck on:** Ensuring the logic doesn't suggest "downgrading" to a plan that lacks a feature a user explicitly needs (e.g., SSO or Enterprise security). I'll need to refine the "reasoning" strings to mention these trade-offs.

**Plan for tomorrow:** Integrate the Anthropic API for the personalized AI summary and set up Supabase for lead capture and report storage.