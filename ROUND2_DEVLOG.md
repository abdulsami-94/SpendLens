## 2026-05-21 13:00 — Read assignment
Read Round 2 brief. Need to add: audit storage with pricing snapshot,
change detection, email notification, diff view. 30 min planning.

## 2026-05-21 13:30 — Decided on approach
Already have Supabase and Resend from Round 1 — no new services needed.
Plan: alter audits table, wire email into save, build detect-changes
endpoint, add diff page. Manual trigger for detection, not cron — faster
to ship.

## 2026-05-21 13:50 — DB migration
Added user_email, pricing_snapshot, notified_at to audits table via
Supabase SQL editor. Straightforward.

## 2026-05-21 15:59 — Audit storage working
Updated saveAuditResult to persist pricing snapshot and email.
Updated api/audits/route.ts to pass email through.

## 2026-05-21 16:01 — detect-changes endpoint
Built POST /api/detect-changes. Groups flagged audits by email to avoid
spam — one email per user regardless of how many audits are stale.

## 2026-05-21 16:06 — Email template
Built sendReauditEmail via Resend. Mirrors pattern from existing
leads/route.ts.

## 2026-05-21 16:11 — Diff page
Built /audit/[id]/diff — re-runs audit with current pricing, renders
old vs new side by side with savings delta headline.

## 2026-05-21 16:27 — Hit first blocker
detect-changes returning "No audits to check". Traced it to user_email
being NULL on audit rows — email comes from lead modal after audit
submission, not during. Fixed by backfilling email onto audits table
when lead is captured in api/leads/route.ts.

## 2026-05-21 16:47 — Email delivery issue
Resend rejecting emails — onboarding@resend.dev only delivers to the
verified Resend account email. Hardcoded recipient temporarily to confirm
delivery, then reverted. Documented as a known limitation.

## 2026-05-21 17:08 — TypeScript build error on Vercel
Property 'email' does not exist on SpendFormData. Fixed by casting
request body to SpendFormData & { email?: string }.

## 2026-05-21 17:20 — Vercel env vars missing
Preview deployment failing — NEXT_PUBLIC_SUPABASE_ANON_KEY not set for
Preview environment. Added it in Vercel dashboard, redeployed.

## 2026-05-21 17:46 — CI lint error fixed
ESLint error: setState called synchronously inside useEffect. Wrapped
in startTransition. All checks green. PR open, deployment live.