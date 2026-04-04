// Bot configuration persistence.
// TODO: Replace localStorage with Supabase once the DB is set up.
// Each function will map 1:1 to a Supabase row operation on a `bot_configs` table.

export interface BotConfig {
  activatedAt: string;
  [key: string]: unknown;
}

export function getBotConfig(botId: string): BotConfig | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(`moju_bot_${botId}`);
  return raw ? (JSON.parse(raw) as BotConfig) : null;
}

export function saveBotConfig(botId: string, config: Record<string, unknown>): void {
  const payload: BotConfig = {
    ...config,
    activatedAt: new Date().toISOString(),
  };
  localStorage.setItem(`moju_bot_${botId}`, JSON.stringify(payload));
}

export function clearBotConfig(botId: string): void {
  localStorage.removeItem(`moju_bot_${botId}`);
}
