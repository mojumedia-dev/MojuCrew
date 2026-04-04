import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";
import { fetchReviews, replyToReview, generateReviewResponse } from "@/lib/googleReviews";

// POST /api/cron/sync-reviews
// Called by Vercel Cron every hour — fetches new reviews and auto-responds
export async function POST(req: NextRequest) {
  // Verify this is a legitimate cron call
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerSupabase();

  // Get all active MojuReviews configs
  const { data: configs } = await supabase
    .from("bot_configs")
    .select("user_id, config")
    .eq("bot_id", "reviews");

  if (!configs?.length) return NextResponse.json({ processed: 0 });

  let processed = 0;
  let responded = 0;

  for (const row of configs) {
    const userId = row.user_id as string;
    const config = row.config as Record<string, unknown>;

    const locations = (config.locations as Array<{ name: string; url: string }>) ?? [];
    const autoRespond = config.autoRespond as boolean;
    const tone = (config.tone as string) ?? "Polite & professional";
    const businessName = (config.businessName as string) ?? "Our Business";
    const alertEmail = config.alertEmail as string | undefined;

    // Check if Google is connected
    const { data: tokenRow } = await supabase
      .from("google_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (!tokenRow) continue; // Not connected yet

    // For each location, fetch reviews
    for (const location of locations) {
      if (!location.url) continue;

      // Extract account/location IDs from the Google Maps URL
      // This is a simplification — real implementation parses the CID and looks up the account
      // For now we log the attempt and skip actual API call until account IDs are available
      try {
        // TODO: resolve location.url → accountId + locationId via Places API
        // Placeholder: log the review sync attempt
        console.log(`[sync-reviews] Checking reviews for ${location.name} (${userId})`);
        processed++;

        // When accountId/locationId are available:
        // const reviewData = await fetchReviews(userId, accountId, locationId);
        // for each new review → save to DB, auto-reply if enabled

      } catch (err) {
        console.error(`[sync-reviews] Error for ${location.name}:`, err);
      }
    }

    // Alert on negative reviews (rating <= 2) if alertEmail is set
    // TODO: implement email alerting via Resend or similar
  }

  return NextResponse.json({ processed, responded });
}
