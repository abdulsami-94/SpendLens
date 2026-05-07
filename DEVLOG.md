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