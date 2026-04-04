# MojuCrew — Tech Stack

## Overview

Lean, modern stack optimized for fast iteration and easy scaling. Built for a small team to ship quickly without over-engineering.

---

## Frontend

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js** (App Router) | Full-stack, SSR, fast, great ecosystem |
| UI | **Tailwind CSS** + **shadcn/ui** | Rapid UI development, clean components |
| State | **Zustand** | Lightweight, simple |
| Auth UI | **Clerk** | Drop-in auth with billing hooks |

---

## Backend

| Layer | Choice | Why |
|-------|--------|-----|
| API | **Next.js API routes** or **FastAPI** (Python) | FastAPI preferred for AI-heavy workloads |
| Auth | **Clerk** or **Supabase Auth** | Fast setup, handles JWT/sessions |
| Database | **Supabase** (Postgres) | Open-source, real-time, row-level security |
| Queue / Jobs | **BullMQ** (Redis) or **Trigger.dev** | Background jobs for bots, scheduled tasks |
| File Storage | **Supabase Storage** or **Cloudflare R2** | Cheap, fast |

---

## AI / LLM Layer

| Component | Choice | Why |
|-----------|--------|-----|
| Primary LLM | **Claude (Anthropic)** | Best for long-context, nuanced responses |
| Fallback/Cost | **GPT-4o mini** | Cheaper for high-volume simple tasks |
| Orchestration | **LangChain** or **LlamaIndex** | RAG pipelines, tool use, memory |
| Embeddings | **OpenAI text-embedding-3-small** | Fast, cheap, accurate |
| Vector DB | **Pinecone** or **Supabase pgvector** | Knowledge base storage per business |

---

## Bot-Specific Infrastructure

### MojuChat (Live Chat)
- Widget: lightweight JS embed (< 10kb)
- WebSockets via **Supabase Realtime** or **Pusher**
- Calendar integrations: **Calendly API**, **Google Calendar API**

### MojuCRM
- Email sending: **Resend** or **SendGrid**
- SMS: **Twilio**
- CRM sync: **HubSpot API**, **Zoho API**

### MojuReviews
- Google reviews: **Google My Business API**
- Yelp: **Yelp Fusion API**
- Scraping fallback: **Apify** or **Playwright**

### MojuResearch
- Web scraping: **Firecrawl** or **Apify**
- News/feeds: **NewsAPI**, RSS parsing
- Scheduling: **Trigger.dev** cron jobs

### MojuContent
- Social posting: **Buffer API** or **Ayrshare**
- Image generation: **DALL-E 3** or **Stable Diffusion**

---

## Infrastructure / DevOps

| Component | Choice |
|-----------|--------|
| Hosting | **Vercel** (frontend) + **Railway** or **Fly.io** (backend) |
| CI/CD | **GitHub Actions** |
| Monitoring | **Sentry** (errors) + **PostHog** (analytics) |
| Secrets | **Doppler** or **Vercel env vars** |

---

## Billing

- **Stripe** — subscriptions, usage-based billing, customer portal
- Metered billing for high-volume bot usage (messages, API calls)

---

## Recommended Build Order

1. Supabase setup (auth + DB schema)
2. Next.js frontend shell + Clerk auth
3. Stripe billing integration
4. MojuChat bot (widget + LLM backend)
5. MojuReviews bot (Google API + auto-responder)
6. Dashboard (unified view of all active bots)
7. Remaining bots (CRM, Research, Content)
