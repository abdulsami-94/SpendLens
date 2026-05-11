# METRICS.md — Metrics & North Star

## North Star Metric

**Audits completed per week**

An audit completed means a user filled the form, submitted it, and saw a results page with at least one recommendation. This is the core value delivery moment. Everything else — leads captured, emails sent, Credex referrals — is downstream of this number. If weekly audits are growing, the product is working.

---

## 3 Input Metrics

### 1. Audit Completion Rate
**Definition:** Audits completed ÷ audit forms started  
**Why it matters:** If users start the form but don't submit, the form UX is broken or the value proposition isn't landing. A healthy rate is >70%.  
**What we do if it drops:** Run session recordings, check where users are dropping off in the form, simplify the tool entry flow.

### 2. Shareable URL Click-Through Rate
**Definition:** Unique visits to `/audit/[id]` URLs that originated from a share (not the original user)  
**Why it matters:** The shareable audit page is our zero-cost distribution channel. If nobody is sharing their results, we don't have a viral loop — we have a calculator with a pretty URL.  
**What we do if it's low:** Make the results page more screenshot-worthy. Add a "Share my audit" CTA with pre-written tweet copy. Make the savings number bigger.

### 3. Email Capture Rate
**Definition:** Leads captured ÷ audits completed  
**Why it matters:** An email means a user found enough value to give us contact info. This is the top of the revenue funnel — no emails, no pipeline, no path to monetisation.  
**What we do if it drops:** Test modal timing (currently shows after results). Try showing a "save your audit" prompt instead of a generic email capture. Offer a monthly spend digest as the opt-in hook.

---

## What Triggers a Pivot

| Signal | Threshold | Response |
|--------|-----------|----------|
| Audit completion rate | <40% for 2 consecutive weeks | Rebuild the form — current UX is too complex |
| Average savings identified | <$50/audit after 200 audits | Pricing data is wrong or users are already optimised — pivot to a different segment (larger teams, enterprise) |
| Email capture rate | <10% after 500 audits | The results page isn't convincing — either savings are too low or recommendations aren't trusted. Add source citations more prominently. |
| Credex referral click rate | <2% of eligible audits | The $500 threshold is too high or the CTA copy is weak — test lower threshold or different offer |
| Zero return visits after 30 days | >90% of users never return | No retention hook — add a "pricing changed, re-run your audit" email trigger |

---

## What We're Not Tracking (Yet)

- Revenue (pre-monetisation)
- CAC (no paid acquisition yet)
- NPS (too early, too few users)

These get added when we have enough volume to make them meaningful.