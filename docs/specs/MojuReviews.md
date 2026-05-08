# MojuReviews — Build Spec

**Goal**: a working AI review manager that pulls Google (and optionally Yelp) reviews on a schedule, drafts and posts AI replies, alerts on negative reviews, and runs review-request outreach. Dashboard shows real activity, not just config.

## Current state

Already built:
- Onboarding wizard at `/dashboard/reviews` collecting: business name, locations (name + Google Maps URL), platforms toggle (Google / Yelp), tone, alert email, autoRespond toggle, request message + triggers
- Google OAuth flow (`/api/auth/google` + callback) writing to `google_tokens` table
- Library at `lib/googleReviews.ts`: `getValidAccessToken`, `getGoogleAccounts`, `fetchReviews`, `replyToReview`, `generateReviewResponse` (Claude Haiku 4.5)
- Scaffold cron at `/api/cron/sync-reviews` that authenticates and iterates configs but is filled with TODOs

What's missing (the build):
1. Location resolution: convert the user-pasted Google Maps URL into `accountId` + `locationId` the Google Business API requires
2. Review persistence + new-review detection (Supabase `reviews` table)
3. End-to-end auto-reply flow wiring the existing helpers
4. Negative-review email alerts
5. Yelp adapter (parallel to Google)
6. Review-request outbound flow (SMS or email, triggered by external events or manual button)
7. Dashboard updates: real review feed, stats, manual reply UI

## Architecture

```
[Vercel Cron] hourly → POST /api/cron/sync-reviews
                          ↓
                  for each user config:
                    1. resolve locations → google accountId/locationId (cache in DB)
                    2. fetchReviews(google) and fetchReviews(yelp)
                    3. diff vs reviews table → identify new reviews
                    4. write new reviews to DB
                    5. for each new review:
                         if autoRespond and rating ≥ 3:
                            generateReviewResponse → replyToReview → mark replied
                         if rating ≤ 2:
                            send alert email (Resend) and flag for manual reply
                    6. log run in cron_runs table

[Manual triggers] (from app or external webhook)
  → POST /api/reviews/request  body: { customerName, contact, locationId }
  → sends review-request message via SMS (Twilio) or email (Resend)
  → logs in review_requests table

[Dashboard] /dashboard/reviews
  - if config exists: shows live feed of reviews with: rating, text, customer, replied?, AI-drafted reply
  - manual "edit reply / approve / post" controls when autoRespond is off
  - stats: avg rating last 30/90 days, # reviews, # replied, # alerted, # requests sent
```

## Supabase schema

```sql
-- One row per Google location, populated on first sync from the Google Maps URL
create table review_locations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  config_location_index int not null,         -- index into bot_configs.config.locations[]
  platform text not null check (platform in ('google','yelp')),
  account_id text,                            -- Google account name e.g. accounts/123
  location_id text,                           -- Google location name e.g. locations/456 OR Yelp business id
  display_name text,
  resolved_at timestamptz default now(),
  unique (user_id, platform, location_id)
);

-- Every review we've ever seen, deduped by external id
create table reviews (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  location_id uuid not null references review_locations(id) on delete cascade,
  external_id text not null,                  -- Google or Yelp review id
  platform text not null,
  rating int not null check (rating between 1 and 5),
  reviewer_name text,
  review_text text,
  posted_at timestamptz,
  fetched_at timestamptz default now(),
  reply_text text,
  reply_posted_at timestamptz,
  reply_status text check (reply_status in ('pending','drafted','posted','manual','skipped')),
  alerted_at timestamptz,
  unique (platform, external_id)
);

-- Outbound review-request log
create table review_requests (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  customer_name text,
  channel text not null check (channel in ('sms','email')),
  contact text not null,                      -- phone or email
  trigger text,                               -- "After a completed booking" etc, free text
  message_body text,
  sent_at timestamptz default now(),
  delivery_status text check (delivery_status in ('queued','sent','delivered','failed','bounced'))
);

-- Audit trail of cron runs (debug + the dashboard "last sync" badge)
create table cron_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  ran_at timestamptz default now(),
  duration_ms int,
  payload jsonb,
  ok boolean
);

create index reviews_user_posted_idx on reviews(user_id, posted_at desc);
create index reviews_user_pending_idx on reviews(user_id, reply_status) where reply_status in ('pending','drafted');
create index review_requests_user_idx on review_requests(user_id, sent_at desc);
```

## Background jobs

Vercel Cron schedule entries (`vercel.json`):
- `/api/cron/sync-reviews` — hourly. Pulls reviews, drafts/posts replies.
- `/api/cron/digest-reviews` — weekly Mon 9am ET. Sends each active user a "X new reviews this week, avg rating Y" email.

## API routes to build

| Route | Purpose |
|---|---|
| `POST /api/cron/sync-reviews` | already scaffolded — fill in TODOs |
| `POST /api/cron/digest-reviews` | weekly summary email |
| `POST /api/reviews/resolve-location` | one-time per location: parses Google Maps URL → accountId/locationId, persists to `review_locations` |
| `GET /api/reviews/list` | dashboard feed; paginated reviews for current user |
| `POST /api/reviews/reply` | manual reply path — owner edits draft + clicks Post |
| `POST /api/reviews/request` | trigger an outbound review request (SMS via Twilio or email via Resend) |
| `POST /api/reviews/yelp/connect` | save Yelp business ID + API token (Yelp doesn't have OAuth like Google; uses API key per business) |

## Location resolution (Google)

The user pastes a Google Maps share URL. We need to convert that to the API's `accounts/{accountId}/locations/{locationId}` resource path.

Approach:
1. From the saved URL, call `getGoogleAccounts(userId)` to get the list of accounts the user has access to
2. For each account, list locations via `mybusinessbusinessinformation.googleapis.com/v1/{accountName}/locations`
3. Match by display name (best-effort) or by extracting CID from the URL and matching against location metadata
4. Store the resolved IDs in `review_locations`
5. Later sync runs read from this cache; no re-resolution unless URL changes

If matching fails, surface an error in the dashboard prompting the user to pick from a dropdown.

## Yelp adapter

Yelp Fusion API uses a single API key per business owner (no OAuth flow per-user). We support this in two ways:
- **Owner-supplied API key**: user pastes their Yelp Fusion key on the Yelp tab of onboarding
- **Public read-only fallback**: use the public Yelp Business search to find their business by name+address, then poll the public reviews endpoint (limited to 3 most recent reviews — Yelp restricts older review access)

Replies on Yelp are not supported via the public API. So Yelp = read-only monitor + alert; replies are routed through the Yelp Business app (we link to it from the dashboard).

## LLM usage

- `generateReviewResponse` already exists. Single call to Claude Haiku 4.5, ~300 tokens out, ~150 tokens in. Cost per reply is sub-cent.
- Add a draft-reply preview step on the dashboard so the owner can tweak before posting (when autoRespond is off).

## Dashboard updates

Replace the static config-display card (when configured) with three sections:

1. **Stats strip**: `avg rating · # reviews this month · # replied · # alerts · # requests sent`
2. **Recent reviews feed**: paginated list. Each row shows rating, snippet, reply status, and either "View reply" or an inline editable AI draft + Post button.
3. **Pending review requests**: table of recent outbound requests with delivery status.

Settings remain accessible via "Reconfigure" button.

## Notification channels

- Email alerts (negative reviews, weekly digest, request delivery): Resend (`RESEND_API_KEY`)
- Review requests outbound: Twilio for SMS, Resend for email. User picks per-trigger in onboarding.

Both add minor env-var setup; no new infra.

## MVP cuts

Ship in this order so each step is shippable on its own:

**M1 (1-2 days)**: Google end-to-end auto-reply
- Location resolution (Google only)
- Review fetch + dedup
- Auto-reply when `autoRespond=true` and rating ≥ 3
- Dashboard "recent reviews" feed (read-only)
- Persist all of it in Supabase

**M2 (1 day)**: Negative-review alerts
- Email via Resend on rating ≤ 2
- Dashboard alert badge

**M3 (1 day)**: Manual-reply UI
- Draft + edit + post controls when autoRespond is off
- Per-review "regenerate draft" button

**M4 (1 day)**: Review requests
- SMS via Twilio + email via Resend
- Manual trigger button on dashboard
- Future: webhook endpoint so external systems (Calendly, Stripe, etc.) can POST a "completed booking" event that auto-fires a request

**M5 (1 day)**: Yelp adapter
- API key paste, read-only monitor, link to Yelp app for replies

**M6 (half day)**: Weekly digest
- `/api/cron/digest-reviews` runs Monday 9am, emails active users a recap

Total estimate: 5-7 working days for the full set, M1 alone is the "second working bot" milestone.

## Build order I'd ship

1. Apply Supabase schema migrations
2. Wire `vercel.json` cron entries
3. M1 (Google end-to-end). At this point MojuReviews is genuinely working — auto-replies are posting on a real account.
4. M2 alerts
5. M3 manual reply (most-requested feature based on the autoRespond toggle being optional)
6. M4 outbound requests
7. M5 Yelp
8. M6 digest

Ready to start at the top of this list. The first commit will be the migrations + filling in `/api/cron/sync-reviews` so we have proof of a real review fetched and auto-replied end-to-end.
