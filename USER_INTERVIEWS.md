# USER_INTERVIEWS.md — User Interviews

---

## Interview 1

**Interviewee:** Prince Raj, CS Student  
**Date:** May 2026  
**Duration:** ~10 minutes  
**Medium:** In person

### Key Questions Asked

1. Do you use any AI tools? Which ones, and are you paying for any?
> Yes, I use Google Gemini. No, I don't pay because I have the student 
> free 1-year plan.

2. If you tried a paid plan and stopped — why?
> Never paid.

3. If you're on free tier — what would make you pay?
> Higher model access.

4. If you manage or share tools with others — how do you decide who 
> gets access?
> Getting their account ID and password.

### What I Learned
Prince highlighted something easy to overlook — students aren't 
avoiding paid AI tools because they don't see value, they're avoiding 
them because institutional plans and student offers already give them 
access. This means the real overspend problem shows up post-graduation, 
when those perks expire and habits carry over into paid subscriptions 
without a second thought.

---

## Interview 2

**Interviewee:** Satyam Singh, CS Student  
**Date:** May 2026  
**Duration:** ~10 minutes  
**Medium:** In person

### Key Questions Asked

1. Do you use any AI tools? Which ones, and are you paying for any?
> I use Claude Code and I have the Pro subscription.

2. If you tried a paid plan and stopped — why?
> I've been using Claude Code Pro for 3 months and it's good. 
> I don't plan to stop — it helps a lot with coding.

3. If you're on free tier — what would make you pay?
> More context, access to codebase like CLI, and the fact that 
> AI does hallucinate.

4. Have you ever felt like you were paying for something you 
> weren't using?
> No.

### What I Learned
Satyam is the ideal paying user — he knows exactly what he's getting, 
uses it daily, and has no intention of churning. But his reasoning for 
staying paid was specific: CLI access and large context, not general 
"AI is useful." This confirmed that the audit engine needs to evaluate 
plan fit against actual usage patterns, not just price — someone using 
Claude Code CLI daily is on the right plan, and the tool should say so 
clearly instead of manufacturing fake savings.

---

## Interview 3

**Interviewee:** Gaurav, CS Student  
**Date:** May 2026  
**Duration:** ~10 minutes  
**Medium:** In person

### Key Questions Asked

1. Do you use any AI tools? Which ones, and are you paying for any?
> I use ChatGPT and I pay for its Go plan.

2. If someone showed you a tool that told you exactly how much you 
> were wasting on AI subscriptions — would you use it?
> No, I would switch for a better price.

3. What would make you trust or not trust the recommendations?
> I will test it according to my use case.

### What I Learned
Gaurav's response to the core SpendLens pitch — "would you use a tool 
that shows your waste?" — was the most surprising of the three. His 
instinct wasn't to audit, it was to switch. This suggested the tool's 
framing matters as much as the data: "here's what to switch to and why" 
converts better than "here's what you're wasting." His trust condition 
— testing against his own use case — also reinforced that audit 
recommendations need to feel personal and specific, not generic.

---

## Patterns Across All Three

Three CS students, three different relationships with AI spend — and 
a few things stood out across all of them.

Nobody was flying blind on price. All three knew what they were 
paying (or not paying) and roughly why. The overspend problem isn't 
ignorance — it's inertia. People stay on plans that made sense when 
they signed up and don't revisit them.

Trust is earned through specificity. Gaurav said he'd test 
recommendations against his own use case. Satyam justified his plan 
by naming exact features he uses. Prince's free plan worked because 
it matched his actual usage. Generic "you could save money" messaging 
won't move anyone — the audit needs to name the tool, the plan, and 
the specific reason.

The most surprising moment was Gaurav's answer — given a clear 
savings opportunity, his first instinct was to act, not to audit. 
That reframed the product: SpendLens isn't just a diagnostic, it's 
a decision accelerator. The audit result page should lead with the 
recommended action, not just the savings number.

---

## How Interviews Shaped the Product

The three conversations pushed the product in one clear direction: 
lead with the recommendation, not the diagnosis. Early designs 
emphasised the savings number as the hero — how much you're wasting, 
big and bold. But Gaurav's instinct to switch rather than audit, 
and Satyam's ability to immediately justify his plan by naming 
specific features, suggested users don't want a report card — they 
want a clear next step. This influenced how the audit results page 
is structured: the recommended action and one-line reason appear 
before the savings figure, so the page reads as a decision tool 
rather than a bill analysis. It also reinforced the honesty 
principle — Satyam is not overspending, and the tool says so. 
Manufactured savings would have immediately broken his trust.