## Q1: Most uncomfortable trade-off

The unsubscribe link in the notification email points to a route that
doesn't exist. I made the call to skip building it because getting the
email sending and diff view working end-to-end was more important in
36 hours. A broken unsubscribe is bad, but a missing core feature is
worse. If this shipped to production I'd be uncomfortable — users who
want to opt out have no way to do so.

## Q2: First thing with 24 more hours

Verify a custom domain in Resend. Right now emails only reliably
deliver to my own account email because I'm sending from
onboarding@resend.dev. Before anything else — login, history, admin
dashboard — the notification email needs to actually reach real users.
Everything else depends on that working first.

## Q3: What Round 1 made harder

The audit submission and email capture were two completely separate
flows. The audit saves when the form is submitted. The email is
collected later in a lead modal. This meant user_email was NULL on
most audit rows in Round 2, and I had to patch api/leads/route.ts to
backfill the email onto the audit after the fact. If I'd anticipated
needing the email at audit time, I'd have collected it upfront in the
audit form itself.