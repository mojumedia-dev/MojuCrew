// Google OAuth initiation route
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET /api/auth/google
// Redirects the user to Google OAuth consent screen
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: ["openid", "email"].join(" "),
    access_type: "offline",
    prompt: "consent",
    state: user.id, // pass userId through OAuth flow
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  // Debug: return the URL instead of redirecting so we can inspect it
  return NextResponse.json({ url, clientId: process.env.GOOGLE_CLIENT_ID?.slice(0, 20) + "...", redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback` });
}
