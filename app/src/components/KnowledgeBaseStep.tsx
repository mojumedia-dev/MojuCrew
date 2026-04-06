"use client";

import { useState } from "react";

interface Props {
  data: Record<string, unknown>;
  update: (patch: Record<string, unknown>) => void;
}

export default function KnowledgeBaseStep({ data, update }: Props) {
  const [urlInput, setUrlInput] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [fetchedUrls, setFetchedUrls] = useState<string[]>(
    (data.fetchedUrls as string[]) ?? []
  );

  const knowledgeBase = (data.knowledgeBase as string) ?? "";

  const handleFetch = async () => {
    const url = urlInput.trim();
    if (!url) return;
    setFetching(true);
    setFetchError("");

    try {
      const res = await fetch("/api/fetch-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json() as { text?: string; error?: string; charCount?: number };

      if (!res.ok || !json.text) {
        setFetchError(json.error ?? "Failed to fetch page");
      } else {
        const newKb = knowledgeBase
          ? `${knowledgeBase}\n\n--- From ${url} ---\n${json.text}`
          : `--- From ${url} ---\n${json.text}`;
        const newUrls = [...fetchedUrls, url];
        setFetchedUrls(newUrls);
        update({ knowledgeBase: newKb, fetchedUrls: newUrls });
        setUrlInput("");
      }
    } catch {
      setFetchError("Network error — check the URL and try again");
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Add content from your website — paste URLs to auto-import, or type/paste text directly.
      </p>

      {/* URL fetcher */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Import from URL</label>
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void handleFetch(); } }}
            placeholder="https://yoursite.com/about"
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={() => void handleFetch()}
            disabled={fetching || !urlInput.trim()}
            className="px-4 py-2.5 text-sm font-medium bg-black text-white rounded-lg disabled:opacity-40 hover:bg-gray-800 transition-colors min-w-[80px] flex items-center justify-center"
          >
            {fetching
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : "Fetch"}
          </button>
        </div>
        {fetchError && <p className="text-xs text-red-500 mt-1">{fetchError}</p>}
        {fetchedUrls.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {fetchedUrls.map((u) => (
              <span key={u} className="text-xs bg-green-50 text-green-700 border border-green-100 rounded px-2 py-0.5 truncate max-w-[200px]">✓ {u}</span>
            ))}
          </div>
        )}
      </div>

      {/* Manual text */}
      <div>
        <label className="block text-sm font-medium text-gray-800 mb-1">Knowledge base</label>
        <textarea
          value={knowledgeBase}
          onChange={(e) => update({ knowledgeBase: e.target.value })}
          rows={10}
          placeholder={"Paste additional content here — services, pricing, FAQs, hours, anything the bot should know.\n\nExample:\nWe offer red light therapy, infrared sauna, and hydration IV treatments.\nRed light therapy sessions are 20 minutes and cost $45.\nWe're open Mon–Sat 9am–7pm, Sunday 10am–4pm."}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-900 placeholder:text-gray-400"
        />
        {knowledgeBase && (
          <p className="text-xs text-gray-400 mt-1 text-right">{knowledgeBase.length} chars</p>
        )}
      </div>

      <p className="text-xs text-gray-500">
        You can also add instructions like "Always recommend booking a consultation first."
      </p>
    </div>
  );
}
