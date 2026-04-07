import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabaseServer";

// Temporary debug route — remove after fixing widget
export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("bot_configs")
    .select("bot_id, config")
    .eq("user_id", user.id);

  const chatConfig = data?.find((r) => r.bot_id === "chat");
  const chatKey = chatConfig ? (chatConfig.config as Record<string, unknown>).chatKey : null;

  return NextResponse.json({
    totalConfigs: data?.length ?? 0,
    hasChatConfig: !!chatConfig,
    chatKey: chatKey ?? "NOT FOUND",
    error: error?.message ?? null,
  });
}
