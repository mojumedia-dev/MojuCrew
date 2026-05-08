import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";
import {
  fetchReviews,
  replyToReview,
  generateReviewResponse,
  resolveGoogleLocation,
} from "@/lib/googleReviews";
import { sendNegativeReviewAlert } from "@/lib/email";

// Vercel Cron hits this hourly. Pulls reviews for every active MojuReviews
// user, dedups against the reviews table, and auto-replies when configured.
//
// Auth: Vercel Cron sends Authorization: Bearer <CRON_SECRET>. Manual triggers
// during dev hit the same header.
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const supabase = createServerSupabase();
  const summary = { users: 0, locations: 0, newReviews: 0, replied: 0, alerted: 0, errors: 0 };

  const { data: configs, error: cfgErr } = await supabase
    .from("bot_configs")
    .select("user_id, config")
    .eq("bot_id", "reviews");
  if (cfgErr) {
    return NextResponse.json({ error: cfgErr.message }, { status: 500 });
  }
  if (!configs?.length) {
    await logRun(supabase, "sync-reviews", Date.now() - start, summary, true);
    return NextResponse.json(summary);
  }

  for (const row of configs) {
    const userId = row.user_id as string;
    const config = row.config as Record<string, unknown>;
    summary.users++;

    // Retry pass for any prior negatives whose alert email failed last time
    // (alerted_at still null). Bounded by the dedup table — negatives we've
    // already insert(ed) only get retried if alerted_at is still null.
    const retryAlertEmail = (config.alertEmail as string | undefined)?.trim();
    if (retryAlertEmail) {
      const { data: pendingAlerts } = await supabase
        .from("reviews")
        .select(
          "id, rating, reviewer_name, review_text, posted_at, location_id, review_locations(display_name)",
        )
        .eq("user_id", userId)
        .lte("rating", 2)
        .is("alerted_at", null)
        .limit(20);
      const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://mojucrew.com"}/dashboard/reviews`;
      for (const pending of pendingAlerts ?? []) {
        const locName =
          (pending as { review_locations?: { display_name?: string } | null }).review_locations
            ?.display_name ?? "Your location";
        const res = await sendNegativeReviewAlert({
          to: retryAlertEmail,
          businessName: (config.businessName as string) ?? "Our Business",
          locationName: locName,
          rating: pending.rating,
          reviewerName: pending.reviewer_name,
          reviewText: pending.review_text,
          postedAt: pending.posted_at,
          dashboardUrl,
        });
        if (res.ok) {
          await supabase
            .from("reviews")
            .update({ alerted_at: new Date().toISOString() })
            .eq("id", pending.id);
          summary.alerted++;
        }
      }
    }

    const configLocations =
      (config.locations as Array<{ name: string; url: string }>) ?? [];
    const autoRespond = !!config.autoRespond;
    const tone = (config.tone as string) ?? "Polite & professional";
    const businessName = (config.businessName as string) ?? "Our Business";

    // Skip users who haven't connected Google.
    const { data: tokenRow } = await supabase
      .from("google_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (!tokenRow) continue;

    for (let i = 0; i < configLocations.length; i++) {
      const cfgLoc = configLocations[i];
      if (!cfgLoc?.name) continue;
      summary.locations++;

      try {
        // 1) Resolve (cache hit or fresh) → review_locations row.
        const resolved = await ensureResolvedLocation(supabase, userId, i, cfgLoc);
        if (!resolved) continue;

        // 2) Pull reviews from Google.
        const reviewData = await fetchReviews(
          userId,
          resolved.account_id!,
          resolved.location_id!,
        );
        const reviews = (reviewData?.reviews ?? []) as GoogleReview[];

        for (const r of reviews) {
          const rating = starToInt(r.starRating);
          const externalId = r.reviewId;
          if (!externalId || rating === 0) continue;

          // 3) Dedup: insert only if external_id is new.
          const { data: existing } = await supabase
            .from("reviews")
            .select("id")
            .eq("platform", "google")
            .eq("external_id", externalId)
            .maybeSingle();
          if (existing) continue;

          summary.newReviews++;

          // 4) Decide response action.
          const shouldAutoReply = autoRespond && rating >= 3 && !!r.comment;
          let replyText: string | null = null;
          let replyStatus: ReplyStatus = "pending";
          let replyPostedAt: string | null = null;

          if (shouldAutoReply && r.comment) {
            try {
              replyText = await generateReviewResponse(r.comment, rating, businessName, tone);
              if (replyText) {
                const ok = await replyToReview(
                  userId,
                  resolved.account_id!,
                  resolved.location_id!,
                  externalId,
                  replyText,
                );
                if (ok) {
                  replyStatus = "posted";
                  replyPostedAt = new Date().toISOString();
                  summary.replied++;
                } else {
                  replyStatus = "failed";
                  summary.errors++;
                }
              } else {
                replyStatus = "failed";
                summary.errors++;
              }
            } catch (err) {
              console.error("[sync-reviews] reply failed", err);
              replyStatus = "failed";
              summary.errors++;
            }
          } else if (rating <= 2) {
            // Negative review path: don't auto-reply, flag for alerting (M2 ships emails).
            replyStatus = "manual";
            summary.alerted++;
          }

          const { data: insertedRow } = await supabase
            .from("reviews")
            .insert({
              user_id: userId,
              location_id: resolved.id,
              external_id: externalId,
              platform: "google",
              rating,
              reviewer_name: r.reviewer?.displayName ?? null,
              review_text: r.comment ?? null,
              posted_at: r.createTime ?? null,
              reply_text: replyText,
              reply_posted_at: replyPostedAt,
              reply_status: replyStatus,
              alerted_at: null,
            })
            .select("id")
            .single();

          // Negative-review alert: email the configured alertEmail. We send
          // after the row is inserted so a failed send doesn't drop the review,
          // and so a retry on the next cron pass is bounded by the alerted_at
          // flag we set after a successful send.
          const alertEmail = (config.alertEmail as string | undefined)?.trim();
          if (rating <= 2 && alertEmail && insertedRow?.id) {
            const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://mojucrew.com"}/dashboard/reviews`;
            const emailRes = await sendNegativeReviewAlert({
              to: alertEmail,
              businessName,
              locationName: resolved.location_id ?? cfgLoc.name,
              rating,
              reviewerName: r.reviewer?.displayName ?? null,
              reviewText: r.comment ?? null,
              postedAt: r.createTime ?? null,
              dashboardUrl,
            });
            if (emailRes.ok) {
              await supabase
                .from("reviews")
                .update({ alerted_at: new Date().toISOString() })
                .eq("id", insertedRow.id);
            } else {
              console.error("[sync-reviews] alert email failed:", emailRes.error);
              summary.errors++;
            }
          }
        }
      } catch (err) {
        console.error(`[sync-reviews] error for ${cfgLoc.name} (${userId}):`, err);
        summary.errors++;
      }
    }
  }

  await logRun(supabase, "sync-reviews", Date.now() - start, summary, summary.errors === 0);
  return NextResponse.json(summary);
}

type ReplyStatus = "pending" | "drafted" | "posted" | "manual" | "skipped" | "failed";

interface GoogleReview {
  reviewId?: string;
  reviewer?: { displayName?: string };
  starRating?: string;
  comment?: string;
  createTime?: string;
  updateTime?: string;
  reviewReply?: { comment?: string; updateTime?: string };
}

function starToInt(s: string | undefined): number {
  switch (s) {
    case "ONE": return 1;
    case "TWO": return 2;
    case "THREE": return 3;
    case "FOUR": return 4;
    case "FIVE": return 5;
    default: return 0;
  }
}

interface ResolvedLocation {
  id: string;
  account_id: string | null;
  location_id: string | null;
}

async function ensureResolvedLocation(
  supabase: ReturnType<typeof createServerSupabase>,
  userId: string,
  configIndex: number,
  cfgLoc: { name: string; url: string },
): Promise<ResolvedLocation | null> {
  const { data: cached } = await supabase
    .from("review_locations")
    .select("id, account_id, location_id")
    .eq("user_id", userId)
    .eq("platform", "google")
    .eq("config_location_index", configIndex)
    .maybeSingle();

  if (cached?.account_id && cached?.location_id) return cached as ResolvedLocation;

  const resolved = await resolveGoogleLocation(userId, cfgLoc.name);
  if (!resolved) return null;

  const { data: inserted, error } = await supabase
    .from("review_locations")
    .upsert(
      {
        user_id: userId,
        config_location_index: configIndex,
        platform: "google",
        account_id: resolved.accountName,
        location_id: resolved.locationName,
        display_name: resolved.matchedTitle,
        source_url: cfgLoc.url || null,
        resolved_at: new Date().toISOString(),
      },
      { onConflict: "user_id,platform,location_id" },
    )
    .select("id, account_id, location_id")
    .single();

  if (error || !inserted) return null;
  return inserted as ResolvedLocation;
}

async function logRun(
  supabase: ReturnType<typeof createServerSupabase>,
  job: string,
  durationMs: number,
  payload: Record<string, unknown>,
  ok: boolean,
): Promise<void> {
  await supabase.from("cron_runs").insert({ job, duration_ms: durationMs, payload, ok });
}
