import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

// GET /api/bot-config?botId=chat
export async function GET(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const botId = req.nextUrl.searchParams.get("botId");
  if (!botId) return NextResponse.json({ error: "botId required" }, { status: 400 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("bot_configs")
    .select("config, activated_at")
    .eq("user_id", userId)
    .eq("bot_id", botId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json(null);

  return NextResponse.json({ ...data.config, activatedAt: data.activated_at });
}

// POST /api/bot-config  body: { botId, config }
export async function POST(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const { botId, config } = await req.json() as { botId: string; config: Record<string, unknown> };
  if (!botId) return NextResponse.json({ error: "botId required" }, { status: 400 });

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("bot_configs")
    .upsert(
      { user_id: userId, bot_id: botId, config, updated_at: new Date().toISOString() },
      { onConflict: "user_id,bot_id" }
    );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/bot-config?botId=chat
export async function DELETE(req: NextRequest) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = user.id;

  const botId = req.nextUrl.searchParams.get("botId");
  if (!botId) return NextResponse.json({ error: "botId required" }, { status: 400 });

  const supabase = createServerSupabase();
  const { error } = await supabase
    .from("bot_configs")
    .delete()
    .eq("user_id", userId)
    .eq("bot_id", botId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Revoking reviews also removes stored Google OAuth tokens
  if (botId === "reviews") {
    await supabase.from("google_tokens").delete().eq("user_id", userId);
  }

  return NextResponse.json({ ok: true });
}
