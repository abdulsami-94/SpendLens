# SpendLens

**SpendLens is a free AI spend auditor for engineering teams.** You enter your AI tools, plans, and seat counts — it tells you exactly how much you're wasting and what to switch to, with specific recommendations backed by official pricing data. Built for engineering managers and CTOs who are paying for multiple AI tools and have no clear picture of whether the spend is optimised.

 **Live:** https://spend-lens-six.vercel.app/

---

## Screenshots


| Spend Form | Audit Results | Lead Capture |
|------------|---------------|--------------|
| ![Form](/assets/Tool.png) | ![Results](/assets/Result.png) | ![Lead](/assets/LC.png) |

---

## Quick Start

### Prerequisites
- Node.js 22+
- A Supabase project (free tier works)
- Gemini API key (`GEMINI_API_KEY`)
- Resend API key

### Install & Run Locally

```bash
git clone https://github.com/abdulsami-94/SpendLens.git
cd SpendLens
npm install
```

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_key
GEMINI_API_KEY=your_gemini_api_key
RESEND_API_KEY=your_resend_api_key
```

Then run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Run Tests

```bash
npm test
```

15 tests, zero extra dependencies. Uses Node's built-in test runner.

### Deploy to Vercel

```bash
npx vercel
```

Add the same environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

---

## Decisions

### 1. Node's built-in test runner over Jest or Vitest
Node 22 ships with `node:test` and supports TypeScript via `--experimental-strip-types`. Adding Jest or Vitest would mean extra dependencies, extra config, and a `jest.config.ts` to maintain. For a project this size, the built-in runner does everything needed with zero setup cost. The trade-off is a less mature ecosystem — no snapshot testing, no coverage UI — but neither was needed here.

### 2. Hardcoded pricing catalog over live scraping
Every price in `pricingCatalog.ts` is hardcoded, sourced from official pricing pages, and timestamped. The alternative — scraping vendor pages at runtime — would make the audit engine dependent on external uptime and HTML structure that changes without warning. Hardcoded data is reliable and auditable. The trade-off is manual maintenance when vendors update pricing, which is mitigated by the source URLs and verification dates on every entry.

### 3. Pre-generated AI summary over on-demand generation
The Gemini API summary is generated once when the audit is created and stored in Supabase alongside the result. The alternative — generating it on every page load — adds 1–2 seconds of latency on each visit and burns API quota on repeat views of the same audit. Pre-generation means the results page renders instantly from a single database fetch. The trade-off is that the summary can't be regenerated if the prompt improves without re-running the audit.

### 4. Honeypot field over rate limiting for abuse protection
The lead capture form uses a hidden `website` field — if it's filled, the submission is silently rejected. Rate limiting was the alternative, but it adds infrastructure complexity (Redis or an in-memory store) and risks false positives on legitimate users behind shared IPs. Honeypots catch unsophisticated bots with zero friction and zero false positives. The trade-off is that a targeted bot that reads the HTML will bypass it — rate limiting can layer on top if that becomes a real problem.

### 5. Automatic spend calculation over free-text input
Originally, users could type their monthly spend directly. This was changed so that spend is calculated automatically from the selected plan and seat count using official pricing data. Free-text input produced audit results that were meaningless — if a user typed an arbitrary number, there was no valid baseline to compare recommendations against. Gemini calculation ensures every audit starts from accurate, comparable data. The trade-off is that users with negotiated enterprise rates can't enter their actual invoice amount.

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **AI:** Gemini API
- **Email:** Resend
- **Deployment:** Vercel
- **CI:** GitHub Actions
- **Tests:** Node `node:test`

---

## Logs & Docs

All required documentation lives in Root Folder:

| File | Contents |
|------|----------|
| `ARCHITECTURE.md` | System diagram, data flow, stack justification |
| `PRICING_DATA.md` | All pricing sources with URLs and verification dates |
| `GTM.md` | Target user, channels, first 100 users |
| `ECONOMICS.md` | Unit economics, CAC, path to $1M ARR |
| `METRICS.md` | North Star metric, input metrics, pivot triggers |
| `LANDING_COPY.md` | Hero copy, FAQs, CTA |
| `USER_INTERVIEWS.md` | 3 user interviews |
| `REFLECTION.md` | Week 1 retrospective |
| `TESTS.md` | Full test index |
| `DEVLOG.md` | Daily build log |
