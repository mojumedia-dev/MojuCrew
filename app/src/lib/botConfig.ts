// Bot configuration persistence — backed by Supabase via /api/bot-config.
// All operations go through the server route which verifies the Clerk session
// and uses the Supabase secret key, so credentials never hit the browser.

export interface BotConfig {
  activatedAt: string;
  [key: string]: unknown;
}

export async function getBotConfig(botId: string): Promise<BotConfig | null> {
  const res = await fetch(`/api/bot-config?botId=${botId}`);
  if (!res.ok) return null;
  return res.json() as Promise<BotConfig | null>;
}

export async function saveBotConfig(botId: string, config: Record<string, unknown>): Promise<void> {
  await fetch("/api/bot-config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ botId, config }),
  });
}

export async function clearBotConfig(botId: string): Promise<void> {
  await fetch(`/api/bot-config?botId=${botId}`, { method: "DELETE" });
}
