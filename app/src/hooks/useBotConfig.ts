"use client";

import { useState, useEffect, useCallback } from "react";
import { getBotConfig, saveBotConfig, clearBotConfig, BotConfig } from "@/lib/botConfig";

export function useBotConfig(botId: string) {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reconfiguring, setReconfiguring] = useState(false);

  useEffect(() => {
    getBotConfig(botId).then((cfg) => {
      setConfig(cfg);
      setLoaded(true);
    });
  }, [botId]);

  const save = useCallback(
    async (data: Record<string, unknown>) => {
      await saveBotConfig(botId, data);
      const fresh = await getBotConfig(botId);
      setConfig(fresh);
      setReconfiguring(false);
    },
    [botId]
  );

  const clear = useCallback(async () => {
    await clearBotConfig(botId);
    setConfig(null);
  }, [botId]);

  return { config, loaded, reconfiguring, setReconfiguring, save, clear };
}
