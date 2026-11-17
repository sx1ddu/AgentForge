# Billing and credits

**Source of truth:** backend `PLANS`: Free $0 / 100 credits / 30 days; Starter $9.99 / 500 credits / 30 days; Pro $19.99 / 1,500 credits / 30 days. Currency USD. Confirm whether amount is monthly/one-time in Stripe config/controller before using “per month”.

**Page:** current plan and balance at top; plan comparison table; short “What uses credits?” reference: chat 1, search 5, coding 10, PDF 10, PPT 10, vision/image 10, PDF RAG 10, image analyzer 5, orchestrator 15 (from auth controller). Do not imply all routes are exposed as manual mode options.

**Checkout:** preserve POST `/api/billing/create-order` `{plan}` and GET `/api/billing/verify-payment?session_id=...`. Use returned checkout URL. Success only on `paid === true`. Failure/pending states. No payment history screen because no list endpoint is exposed.
