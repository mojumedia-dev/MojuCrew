import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

// GET /api/reviews/list?limit=20&before=<isoDate>
// Returns recent reviews for the signed-in user, newest first.
// Pair with the location join for display title.
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = Math.min(50, Number(req.nextUrl.searchParams.get("limit") ?? 20));
  const before = req.nextUrl.searchParams.get("before");

  const supabase = createServerSupabase();
  let q = supabase
    .from("reviews")
    .select(
      "id, platform, rating, reviewer_name, review_text, posted_at, reply_text, reply_posted_at, reply_status, alerted_at, location_id, review_locations(display_name)",
    )
    .eq("user_id", user.id)
    .order("posted_at", { ascending: false, nullsFirst: false })
    .limit(limit);

  if (before) q = q.lt("posted_at", before);

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Stats for the dashboard strip — last 30 days.
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: statsRows } = await supabase
    .from("reviews")
    .select("rating, reply_status, alerted_at, posted_at")
    .eq("user_id", user.id)
    .gte("posted_at", thirtyDaysAgo);

  const stats = {
    count30d: statsRows?.length ?? 0,
    avgRating30d:
      statsRows && statsRows.length > 0
        ? Number(
            (
              statsRows.reduce((s, r) => s + (r.rating ?? 0), 0) / statsRows.length
            ).toFixed(2),
          )
        : null,
    replied30d: statsRows?.filter((r) => r.reply_status === "posted").length ?? 0,
    alerts30d: statsRows?.filter((r) => r.alerted_at).length ?? 0,
  };

  // Most recent cron run badge.
  const { data: lastRun } = await supabase
    .from("cron_runs")
    .select("ran_at, ok")
    .eq("job", "sync-reviews")
    .order("ran_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ reviews: data ?? [], stats, lastSync: lastRun ?? null });
}
