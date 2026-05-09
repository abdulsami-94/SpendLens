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

**Hours worked:** 5

**What I did:**
- Supabase setup: created `audits` and `leads` tables, migrated audit store
  from local file storage to database.
- Gemini 1.5 Flash integration: summary generated at audit creation time inside
  `POST /api/audits`, saved directly to DB — no separate `/api/summary` route.
- Lead capture modal: appears 2 seconds after audit results load (never before),
  captures email, company, role, team size, and lead type for segmentation.
- Resend email integration: sends transactional confirmation email on lead capture.
- Abuse protection: honeypot field (`website`) — rejects submission silently if
  filled. Chosen over rate limiting for zero false positives and simpler maintenance.

**Architecture decision — pre-generated summaries:**
Generating the AI summary at audit creation and storing it means the results page
fetches one row and renders instantly. The alternative (generating on page load)
adds ~1–2s latency every time and burns API quota on repeat visits. Easy call.

**Bugs fixed:**
- `GOOGLE_GEMINI_API_KEY` vs `GEMINI_API_KEY` mismatch in `src/lib/aiService.ts`.
  Lesson: read `.env.local` before writing a new service file, not after.
- Redundant summary generation: client was requesting a summary the initial audit
  fetch already provided. Deleted the separate `/api/summary` route entirely.

**What I learned:**
Honeypot is a solid first-line defence for lead forms — no friction, no false
positives, trivially simple. Rate limiting can layer on top later if bots get
smarter. Pre-computing AI content server-side is almost always the right call for
anything that hits a paid/rate-limited API.

**Plan for tomorrow:**
Shareable audit URLs with OG tags, UI polish, deploy to Vercel.