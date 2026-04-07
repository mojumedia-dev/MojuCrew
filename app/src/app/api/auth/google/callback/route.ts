import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

// GET /api/auth/google/callback
// Handles the OAuth redirect from Google, exchanges code for tokens
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const stateUserId = searchParams.get("state");
  const error = searchParams.get("error");

  // Rename for clarity — keep original variable name for downstream use
  const userId = stateUserId;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

  if (error || !code || !userId) {
    return NextResponse.redirect(`${appUrl}/dashboard/reviews?error=google_auth_failed`);
  }

  // Verify the state matches the currently authenticated user (CSRF protection)
  const user = await currentUser();
  if (!user || user.id !== userId) {
    return NextResponse.redirect(`${appUrl}/dashboard/reviews?error=google_auth_failed`);
  }

  // Exchange auth code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${appUrl}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/dashboard/reviews?error=token_exchange_failed`);
  }

  const tokens = await tokenRes.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000).toISOString();

  // Store tokens in Supabase
  const supabase = createServerSupabase();
  const { error: dbError } = await supabase
    .from("google_tokens")
    .upsert(
      {
        user_id: userId,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (dbError) {
    return NextResponse.redirect(`${appUrl}/dashboard/reviews?error=token_save_failed`);
  }

  return NextResponse.redirect(`${appUrl}/dashboard/reviews?connected=true`);
}
