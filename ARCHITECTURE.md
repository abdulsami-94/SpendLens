# ARCHITECTURE.md

## System Diagram

```mermaid
flowchart TD
    A[User — Browser] -->|Fills spend form| B[SpendForm.tsx\nLocalStorage persistence]
    B -->|POST tools + teamSize + useCase| C[/api/audits\nNext.js Route Handler]
    C -->|runAudit| D[auditEngine.ts\nPure TypeScript]
    D -->|reads| E[pricingCatalog.ts\nHardcoded pricing rules]
    D -->|AuditResult| C
    C -->|Store audit| F[(Supabase\naudits table\nid · tools_data · results · created_at)]
    C -->|Generate summary| G[/api/summary\nNext.js Route Handler]
    G -->|Gemini API| H[Gemini Flash\nAI summary ~100 words]
    H -->|aiSummary string| G
    G -->|Return summary| C
    C -->|Redirect| I[/audit/id\nResults Page]
    I -->|User submits email| J[LeadCaptureModal.tsx]
    J -->|POST email + audit_id| K[/api/leads\nNext.js Route Handler]
    K -->|Store lead| L[(Supabase\nleads table)]
    K -->|Send confirmation| M[Resend\nTransactional Email]
```

---

## Data Flow

1. **Input** — User selects plan, seats, and monthly spend for up to 8 AI tools. Form state persists to `localStorage` on every change so no data is lost on reload.

2. **Audit** — On submit, `POST /api/audits` runs `runAudit()` server-side. The engine is a pure function with no I/O — it reads from `pricingCatalog.ts` and returns a deterministic `AuditResult`. No external calls, no database reads in the hot path.

3. **Storage** — The audit result is written to Supabase (`audits` table) as JSONB. The UUID from `crypto.randomUUID()` becomes the URL identifier.

4. **AI Summary** — After the audit is stored, `POST /api/summary` sends the result to the Gemini API and returns a ~100-word personalised summary. Falls back to a templated string if the API call fails.

5. **Results** — User is redirected to `/audit/[id]`. This page is publicly shareable. Email and company name are stripped from the public view.

6. **Lead Capture** — After results are shown, a modal prompts for email. `POST /api/leads` stores the lead in Supabase and triggers a confirmation email via Resend.

---

## Stack

| Layer | Choice | Justification |
|---|---|---|
| Framework | Next.js 16 (App Router) | API routes and pages in one repo, no separate backend needed. Server components keep audit logic off the client. |
| Language | TypeScript | Pricing rules and audit logic have enough complexity that type errors at compile time are worth the setup cost. |
| Styling | Tailwind CSS v4 | Utility-first is fast for one-person projects. No context switching between CSS files and components. |
| Database | Supabase (PostgreSQL) | Generous free tier, instant REST and realtime, no ORM needed for a two-table schema. |
| AI | Google gemini API | The product audits AI spend — using the Gemini API directly is on-brand and lets us demo the tool eating its own cooking. |
| Email | Resend | Simple API, reliable deliverability, free tier covers early traction. |
| Deployment | Vercel | Zero-config Next.js deploys, edge network, preview URLs on every PR. |
| Tests | Node `node:test` | No extra dependencies. Built into Node 22, handles TypeScript via `--experimental-strip-types`. |
| CI | GitHub Actions | Runs lint and tests on every push to main. Catches regressions before they hit production. |

---

## Scaling Notes

**Current bottlenecks at scale:**

- `pricingCatalog.ts` is hardcoded. At volume, pricing drift becomes a maintenance burden. A CMS or scheduled scraper would be the fix.
- Gemini API call is synchronous in the audit flow. Under load this adds latency. Moving to a background job (e.g. Supabase Edge Functions) with optimistic UI would fix this.
- Supabase free tier has row limits and connection pooling constraints. A paid plan or moving to direct PostgreSQL with PgBouncer handles this at ~10k audits/month.

**What scales fine without changes:**

- `runAudit()` is a pure function — it's stateless and CPU-cheap. It can run in an edge runtime or be parallelised trivially.
- Vercel's edge network handles static assets and the results page at any traffic level.
- Lead storage and email are low-volume by nature.