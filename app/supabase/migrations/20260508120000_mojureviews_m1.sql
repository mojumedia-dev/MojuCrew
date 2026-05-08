-- MojuReviews M1: Google end-to-end review sync, dedup, and auto-reply.
-- Apply via Supabase SQL editor.

-- One row per resolved Google Business location (cached resolution).
-- Yelp gets added in M5 with platform='yelp'.
create table if not exists review_locations (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  config_location_index int not null,
  platform text not null check (platform in ('google','yelp')),
  account_id text,
  location_id text,
  display_name text,
  source_url text,
  resolved_at timestamptz default now(),
  unique (user_id, platform, location_id)
);

create index if not exists review_locations_user_idx on review_locations(user_id);

-- Every review we've ever seen, deduped by external id from the source.
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  location_id uuid not null references review_locations(id) on delete cascade,
  external_id text not null,
  platform text not null,
  rating int not null check (rating between 1 and 5),
  reviewer_name text,
  review_text text,
  posted_at timestamptz,
  fetched_at timestamptz default now(),
  reply_text text,
  reply_posted_at timestamptz,
  reply_status text check (reply_status in ('pending','drafted','posted','manual','skipped','failed')),
  alerted_at timestamptz,
  unique (platform, external_id)
);

create index if not exists reviews_user_posted_idx on reviews(user_id, posted_at desc);
create index if not exists reviews_user_pending_idx
  on reviews(user_id, reply_status)
  where reply_status in ('pending','drafted');

-- Audit trail of cron runs (debug + the dashboard "last sync" badge).
create table if not exists cron_runs (
  id uuid primary key default gen_random_uuid(),
  job text not null,
  ran_at timestamptz default now(),
  duration_ms int,
  payload jsonb,
  ok boolean
);

create index if not exists cron_runs_job_ran_idx on cron_runs(job, ran_at desc);
