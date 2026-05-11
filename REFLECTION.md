# REFLECTION.md

## 1. The Hardest Bug You Hit This Week

Two bugs stood out, and they were frustrating in different ways.

The first was a Tailwind CSS conflict that crashed my Mac. I was using Tailwind v4 but my `postcss.config.mjs` was configured for v3. The two versions handle the CSS pipeline differently, and the conflict caused PostCSS to enter an infinite loop during the build process — which eventually consumed enough memory to bring my machine down. The hypothesis I formed was that the issue was in my component code, because that's where I'd been making changes. I wasted time there before realising the crash was happening before any component code ran. Once I looked at the build tooling itself, the `postcss.config.mjs` mismatch was obvious. Fixing it was a one-line change, which is always the most annoying kind of bug — an hour of debugging for thirty seconds of fixing.

The second was a pricing data problem. When I was building the pricing catalog, I kept getting different numbers depending on where I looked. Vendor websites showed one price, AI tools suggested another, and archived pages showed a third. The issue is that AI pricing changes frequently and AI assistants confidently cite outdated numbers. My solution was to go directly to each vendor's official pricing page, record the exact price and the URL, and timestamp every entry in `PRICING_DATA.md`. This made the catalog slower to build but meant every number in the audit engine is traceable to a source. Treating AI-generated pricing as a starting point to verify rather than a source of truth was the key shift.

---

## 2. A Decision You Reversed Mid-Week

Early in the build I had a manual monthly spend input as a free-text field — the user could type any number they wanted for each tool. The idea was flexibility: maybe they had a negotiated rate, maybe they were sharing a seat, maybe they just knew their actual invoice number.

I reversed this and replaced it with automatic spend calculation based on the selected plan and seat count.

The reason was that free-text spend inputs were producing garbage audit results. Users would enter numbers that didn't correspond to any real pricing tier, which made the "current spend vs recommended spend" comparison meaningless. If someone types £47 for a tool that costs either £20 or £100 depending on the plan, the audit engine has no meaningful baseline to work from. By calculating spend from the plan selection and seat count using official pricing data, every audit starts from a clean, comparable baseline. The trade-off is less flexibility for edge cases like negotiated enterprise rates — but for the target user, the automatic calculation is more accurate than what they'd type from memory anyway.

---

## 3. What You Would Build in Week 2

The most obvious missing piece is a pricing change alert system. AI tool pricing moves constantly — plans get renamed, prices shift, new tiers appear. Right now SpendLens gives you a snapshot, but a snapshot goes stale within weeks. In week 2 I'd build a lightweight monitoring job that checks each vendor's pricing page on a schedule, diffs it against the stored values in `pricingCatalog.ts`, and emails users who have a saved audit when something changes that affects their recommendation.

Beyond that, I'd add team comparison — the ability to run multiple audit profiles and compare them. Right now the tool is built around a single team configuration. But a CTO evaluating whether to standardise on one AI tool across departments needs to model several scenarios side by side.

I'd also clean up the Supabase schema to support returning users properly. Currently every audit is anonymous by default. Adding optional accounts would let users track their spend over time and see whether they actually acted on the recommendations — which is the product's real value loop.

---

## 4. How You Used AI Tools

I used Claude for almost everything on this project — planning, debugging, writing, and learning tools I hadn't used before.

The most useful applications were: breaking the 7-day build into a day-by-day plan with specific deliverables and commit messages, learning GitHub Actions from scratch (I had never written a CI workflow before this week), understanding Supabase's schema and client setup, and writing professional git commit messages consistently.

What I didn't trust Claude with: the actual pricing numbers. Every time I asked about specific plan costs, I got plausible-sounding figures that turned out to be wrong or outdated when I checked the vendor's website. Claude would confidently give me a price for a plan that had since been renamed or repriced. This was the most important thing I learned about using AI for research — it's good for understanding structure and concepts, but numerical data needs to be verified at the source. I built the entire pricing catalog by going to each vendor's website directly, not by asking Claude.

One specific catch: Claude cited a ChatGPT plan price that matched an older pricing structure. When I checked OpenAI's actual pricing page, the plan had been restructured and the number was wrong. If I hadn't verified it, the audit engine would have been producing incorrect savings calculations for ChatGPT users from day one.

---

## 5. Self-Rating

**Discipline: 7/10**
I put in 6–7 hour focused sessions every day without breaks, which kept the build on track across all 6 days — but I could have managed my time better within those sessions and avoided some rabbit holes.

**Code quality: 6/10**
The audit engine is well-structured and the pricing catalog is properly sourced, but there are `any` types in several files, an unused import in the results client, and some components that grew larger than they should have. It works, but it wouldn't pass a serious code review without cleanup.

**Design sense: 8/10**
I'm happy with the visual design. The results page looks like a real product, the hierarchy is clear, and the savings numbers are prominent where they need to be. Design was the part of this project I felt most confident in from the start.

**Problem solving: 7/10**
When I hit the Tailwind crash and the Supabase setup issues, I eventually found the root cause rather than patching symptoms. But I spent too long looking in the wrong places before checking the build tooling. Getting faster at forming the right hypothesis first is where I need to improve.

**Entrepreneurial thinking: 4/10**
I'm new to thinking in terms of GTM, unit economics, and user interviews. I built the product but didn't do the customer discovery work in parallel the way the brief intended. The economics and GTM documents are reasoned through, but they're not grounded in real conversations with potential users the way they should be. This is the area I learned the most about this week, and the area I'm furthest from being good at.