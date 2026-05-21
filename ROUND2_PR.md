## What this PR does
Adds a "re-audit on pricing change" feature. When AI tool pricing changes,
stored audits become stale. This PR detects that staleness, emails affected
users with what changed, and shows a side-by-side diff of old vs new
recommendations when they re-run their audit.

## Why
A one-time audit that never updates is worse than no audit — users make
decisions based on stale data. This makes audits live. Users who ran an
audit when Cursor was $20/seat will now be notified if it changes to $25,
and can see exactly how that affects their recommendation.

## How it works
1. Every audit now saves `user_email` and `pricing_snapshot` (the exact
   catalog state at audit time) to the `audits` table in Supabase.
2. `POST /api/detect-changes` loops through all unnotified audits, compares
   their stored snapshot against the current `pricingCatalog.ts`, and flags
   any whose pricing has changed.
3. Flagged audits are grouped by email — one consolidated email per user
   via Resend, containing what changed and a re-run link.
4. `/audit/[id]/diff` re-runs the audit engine with current pricing and
   renders old vs new recommendations side-by-side, with savings delta as
   the headline.

## What I cut
- **Unsubscribe endpoint** — the link exists in the email but the route
  doesn't exist yet. Not enough time; it's the first thing I'd add next.
- **Cron scheduling** — detection is manual via POST /api/detect-changes.
  Would wire to GitHub Actions schedule next.
- **Admin dashboard** — skipped entirely in favour of getting the core
  flow working end-to-end.
- **Custom Resend domain** — currently sending from onboarding@resend.dev
  which only delivers reliably to the verified account email. Would verify
  a domain before production.

## How to test it manually
1. Submit an audit at https://spend-lens-six.vercel.app/ with a real email
2. Open the lead capture popup and enter the same email — this backfills
   the email onto the audit row
3. Temporarily change Cursor Pro price in `pricingCatalog.ts` from 20 to 25
4. POST /api/detect-changes — check inbox for notification email
5. Click "Re-run your audit" in the email → diff page loads with old vs new

## What's tested
No automated tests added in this PR due to time constraint. Would test
next: unit test for `detectPricingChanges` with a mock snapshot, and an
integration test for the detect-changes endpoint.

## Open questions / risks
- Resend domain not verified — emails may land in spam for non-test addresses
- If a user submits without completing the lead modal, `user_email` stays
  NULL and they won't be notified
- No rate limiting on `/api/detect-changes` — should add auth or a secret
  header before exposing publicly