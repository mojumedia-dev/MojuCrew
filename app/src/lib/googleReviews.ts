import { createServerSupabase } from "./supabaseServer";

interface GoogleToken {
  access_token: string;
  refresh_token: string;
  expires_at: string;
}

// Refresh a token if it's about to expire, return a valid access token
async function getValidAccessToken(userId: string): Promise<string | null> {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from("google_tokens")
    .select("access_token, refresh_token, expires_at")
    .eq("user_id", userId)
    .single();

  if (!data) return null;
  const token = data as GoogleToken;

  // Refresh if expires within 5 minutes
  if (new Date(token.expires_at) <= new Date(Date.now() + 5 * 60 * 1000)) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        refresh_token: token.refresh_token,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
      }),
    });

    if (!refreshRes.ok) return null;

    const refreshed = await refreshRes.json() as { access_token: string; expires_in: number };
    const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

    await supabase
      .from("google_tokens")
      .update({ access_token: refreshed.access_token, expires_at: newExpiry })
      .eq("user_id", userId);

    return refreshed.access_token;
  }

  return token.access_token;
}

// Fetch Google Business accounts for the user
export async function getGoogleAccounts(userId: string) {
  const token = await getValidAccessToken(userId);
  if (!token) return null;

  const res = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  return res.json();
}

// Fetch reviews for a specific location
export async function fetchReviews(userId: string, accountId: string, locationId: string) {
  const token = await getValidAccessToken(userId);
  if (!token) return null;

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) return null;
  return res.json();
}

// Post a reply to a review
export async function replyToReview(
  userId: string,
  accountId: string,
  locationId: string,
  reviewId: string,
  replyText: string
) {
  const token = await getValidAccessToken(userId);
  if (!token) return false;

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${accountId}/${locationId}/reviews/${reviewId}/reply`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment: replyText }),
    }
  );
  return res.ok;
}

// Generate a review response using Claude
export async function generateReviewResponse(
  reviewText: string,
  rating: number,
  businessName: string,
  tone: string
): Promise<string> {
  const toneInstructions: Record<string, string> = {
    "Polite & professional": "Be formal, polished, and professional.",
    "Warm & personal": "Be warm, genuine, and personal. Use the customer's first name if available.",
    "Brief & direct": "Keep the response short and to the point — 2-3 sentences max.",
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `You are the owner/manager of ${businessName} responding to a Google review.

Review rating: ${rating}/5 stars
Review text: "${reviewText}"

Write a response to this review. ${toneInstructions[tone] ?? "Be professional and friendly."}
${rating <= 2 ? "This is a negative review — acknowledge their concern empathetically, apologize, and offer to make it right." : ""}
${rating >= 4 ? "This is a positive review — thank them genuinely and invite them back." : ""}

Only output the response text, nothing else.`,
        },
      ],
    }),
  });

  if (!res.ok) return "";
  const data = await res.json() as { content: Array<{ text: string }> };
  return data.content[0]?.text ?? "";
}
