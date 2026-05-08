# MojuCrew — Per-Customer Cost Spec

The deploy-on-customer-stack model means each customer pays their own infrastructure and per-bot service bills, in addition to a flat MojuCrew subscription to MojuMedia. This document itemizes those costs so a "max plan" subscription price can be set with full visibility into the customer's total cost of ownership.

Volume assumption throughout: a builder customer at the **Wright Homes profile** — ~108 homes/year, ~30 leads/month today moving toward 100/month, 5–50 reviews/month per location, 1–3 sales reps using MojuChat, 2–5 social posts/week.

---

## Platform infrastructure (every customer)

| Service | Plan | Monthly | Notes |
|---|---|---|---|
| Vercel | Pro | $20 | Free Hobby works for very low traffic; Pro is the production baseline. Per-deployment pricing. |
| Supabase | Pro | $25 | Free tier (500 MB database, 1 GB storage) is enough for MVP; Pro ($25) gives daily backups, 8 GB DB, point-in-time recovery, 100K MAU auth. |
| Clerk | Free tier (Pro $25 if needed) | $0–25 | Free up to 10K monthly active users. A builder's internal team (5–25 users) sits well under the cap. |
| **Subtotal: platform** | | **$45–70** | |

---

## MojuChat (AI sales counselor)

| Service | Pricing | Estimated monthly |
|---|---|---|
| Anthropic Claude (Sonnet 4.6 or Haiku 4.5) | Sonnet $3/M in + $15/M out; Haiku $0.80/M in + $4/M out | ~$3–35 |
| OpenAI embeddings (RAG over knowledge base) | $0.02/M tokens for text-embedding-3-small | $1–3 |
| **Subtotal: MojuChat** | | **~$5–40** |

Math: average chat is ~500 input tokens + 200 output. At 500 chats/month on Haiku that's $0.30 in + $0.40 out = under a dollar. At 5,000 chats/month it's still under $10 on Haiku. Sonnet on the same volume is roughly 4× the cost.

---

## MojuReviews

| Service | Pricing | Estimated monthly |
|---|---|---|
| Anthropic Claude Haiku 4.5 (reply generation) | $0.80/M in + $4/M out | ~$0.05–2 |
| Google Business Profile API | Free | $0 |
| Resend (alerts + digests) | Free up to 3K/mo, $20/mo for 50K | $0 in most cases |
| **Subtotal: MojuReviews** | | **~$0–5** |

Math: a single review reply is ~150 input + 300 output = ~$0.001. Even 200 reviews/month is $0.25.

---

## MojuCRM (with Lasso integration)

| Service | Pricing | Estimated monthly |
|---|---|---|
| Anthropic Claude (lead scoring, follow-up drafts) | Mix of Haiku + Sonnet | ~$5–25 |
| Twilio | $0.0075/SMS US, $1.15/mo per phone number | ~$5–20 |
| Resend (CRM follow-up emails) | Free up to 3K/mo | $0 in most cases |
| **Lasso Pro API** | Quoted by Lasso (paid add-on, "monthly fee") | **$50–200 (estimate, needs quote)** |
| **Subtotal: MojuCRM** | | **~$60–245** |

The Lasso Pro API number is the biggest unknown. Lasso's docs describe it as a paid add-on without listing public pricing — needs a direct quote from Lasso for each customer.

---

## MojuContent

| Service | Pricing | Estimated monthly |
|---|---|---|
| Anthropic Claude (copy generation) | ~$5–25 |
| Meta Graph API | Free | $0 |
| LinkedIn API | Free for basic posting via Page admin | $0 |
| Cross-platform scheduling (Buffer or self-built) | $5–15 if Buffer; $0 if we build it | $0–15 |
| **Subtotal: MojuContent** | | **~$5–40** |

---

## MojuResearch

| Service | Pricing | Estimated monthly |
|---|---|---|
| Anthropic Claude (summarization) | ~$1–10 |
| Web scraping (Apify or self-hosted Playwright) | Apify $49/mo team; self-hosted Playwright on Vercel ~$0 | $0–50 |
| News APIs (optional) | $0–50 depending on source | $0–50 |
| **Subtotal: MojuResearch** | | **~$1–110** |

Self-hosted Playwright on Vercel cron functions covers most of the scraping at near-zero cost. Paid scraping services only matter if customer wants tracking of sites that actively block bots.

---

## Walkthrough infrastructure (optional, not in current Wright pitch)

| Service | Pricing | Monthly |
|---|---|---|
| Polycam (capture app) | ~$15–30/mo per device | $15–30 |
| GitHub Pages (static hosting) | Free | $0 |
| Cloudflare CDN (if traffic outgrows GH Pages) | Free tier generous | $0 |

---

## Per-customer all-in estimate

| Bundle | Monthly low | Monthly high |
|---|---|---|
| Platform + MojuReviews only | ~$45 | ~$75 |
| Platform + Reviews + Chat | ~$50 | ~$115 |
| Full crew (5 bots) without Lasso | ~$60 | ~$300 |
| Full crew with Lasso Pro API | ~$110 | ~$500 |

**Wright Homes realistic estimate (full crew + Lasso): ~$200–400/month** in pass-through infrastructure costs, plus their separate ad spend.

---

## What this means for MojuMedia subscription pricing

For Adam to set the MojuCrew subscription price:

- Customer pays infrastructure separately — they see those bills directly, no margin to manage
- MojuCrew subscription is purely for the platform license + ongoing development + support
- A $499/month "max plan" subscription is roughly 2× the customer's estimated infra bill, which feels right for SaaS on a builder-revenue scale (tiny percentage of their revenue, big leverage on outcomes)
- A higher "Enterprise" tier ($999/month or more) becomes natural when add-ons stack: dedicated strategist hours, custom AI agent builds, premium reporting

**Recommended subscription tiers:**

| Tier | Monthly | Includes |
|---|---|---|
| Starter | $199 | MojuChat + MojuReviews only |
| Growth | $499 | All 5 bots + Lasso integration |
| Enterprise | $999+ | Growth + dedicated strategist hours + custom AI agent builds + premium reporting |

These match the Wright proposal numbers ($1,950 / $3,950 / $5,950) reasonably well — the proposal numbers are larger because they bundle managed-service hours that come with the partnership, not pure SaaS license. For self-serve customers, the lower tier set above is cleaner.

---

## What we still need to confirm

1. **Lasso Pro API pricing** — get a real quote. This is the largest single unknown.
2. **Anthropic enterprise volume pricing** — at >$500/mo of API spend per customer, custom contract pricing kicks in. Worth asking for once we have 5+ customers.
3. **Twilio sender verification** — A2P 10DLC registration in the US is a one-time fee plus monthly carrier surcharges (~$5/mo). Adds to the SMS line for compliant outbound texting at scale.
4. **Resend domain verification** — free, but customer needs to add DNS records for sending from their own domain.
5. **Whether MojuMedia centralizes any of this** — e.g. one shared Resend account billed to MojuMedia, vs. each customer setting up their own. Centralized is faster to onboard but introduces shared-deliverability risk and merges costs across customers.
