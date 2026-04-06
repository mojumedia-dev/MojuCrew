"use client";

import { useState } from "react";
import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const INDUSTRIES = [
  "Health & Wellness", "Beauty & Salon", "Fitness / Gym",
  "Restaurant / Food & Beverage", "Home Services", "Retail",
  "Legal Services", "Real Estate", "Auto Services", "Other",
];
const TONES = ["Professional", "Friendly", "Casual", "Concise"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Water & Light for Health" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Website URL</label>
          <input type="url" value={(data.websiteUrl as string) ?? ""} onChange={(e) => update({ websiteUrl: e.target.value })} placeholder="https://yoursite.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Industry</label>
          <select value={(data.industry as string) ?? ""} onChange={(e) => update({ industry: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white text-gray-900">
            <option value="">Select an industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Booking / appointment URL</label>
          <input type="url" value={(data.bookingUrl as string) ?? ""} onChange={(e) => update({ bookingUrl: e.target.value })} placeholder="https://yoursite.com/book" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
          <p className="text-xs text-gray-500 mt-1">The bot will guide visitors here when they want to book or schedule.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Knowledge base",
    render: (data, update) => (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">Paste in content from your website — services, about page, pricing, FAQs, hours. The more context you give, the better the bot answers.</p>
        <textarea
          value={(data.knowledgeBase as string) ?? ""}
          onChange={(e) => update({ knowledgeBase: e.target.value })}
          rows={10}
          placeholder={`Example:\n\nWe offer red light therapy, infrared sauna, and hydration IV treatments.\n\nRed light therapy sessions are 20 minutes and cost $45.\n\nWe're open Mon–Sat 9am–7pm, Sunday 10am–4pm.\n\nLocated at 123 Main St, Suite 200.`}
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-900"
        />
        <p className="text-xs text-gray-500">You can also add instructions like "Never quote prices without checking the website" or "Always recommend booking a consultation first."</p>
      </div>
    ),
  },
  {
    title: "Chat personality",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Response tone</label>
          <div className="grid grid-cols-2 gap-3">
            {TONES.map((t) => (
              <button key={t} type="button" onClick={() => update({ tone: t })} className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${data.tone === t ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Opening greeting</label>
          <textarea value={(data.greeting as string) ?? ""} onChange={(e) => update({ greeting: e.target.value })} rows={3} placeholder={`Hi! I'm the assistant for ${(data.businessName as string) ?? "us"}. How can I help you today?`} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-900" />
        </div>
        <div className="flex items-center justify-between py-3 px-4 border border-gray-100 rounded-lg">
          <div>
            <p className="text-sm font-medium text-gray-800">Capture leads</p>
            <p className="text-xs text-gray-500 mt-0.5">Ask for name + email before chatting</p>
          </div>
          <button type="button" onClick={() => update({ captureLeads: !data.captureLeads })} className={`w-11 h-6 rounded-full transition-colors ${data.captureLeads ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.captureLeads ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    ),
  },
  {
    title: "Platform integration",
    render: (data, update) => {
      const platform = (data.platform as string) ?? "";
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-600">Connect your platform so captured leads are automatically added as customers. Skip this step if you don't need lead sync.</p>
          <div className="space-y-2">
            {[
              { id: "shopify", label: "Shopify" },
              { id: "none", label: "Skip — no lead sync" },
            ].map((p) => (
              <button key={p.id} type="button" onClick={() => update({ platform: p.id })} className={`w-full flex items-center gap-3 py-3 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${platform === p.id ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>
                {p.label}
              </button>
            ))}
          </div>

          {platform === "shopify" && (
            <div className="space-y-4 border border-gray-100 rounded-xl p-4">
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Shopify store URL</label>
                <input type="text" value={(data.shopifyStoreUrl as string) ?? ""} onChange={(e) => update({ shopifyStoreUrl: e.target.value })} placeholder="your-store.myshopify.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-800 mb-1">Admin API access token</label>
                <input type="password" value={(data.shopifyApiToken as string) ?? ""} onChange={(e) => update({ shopifyApiToken: e.target.value })} placeholder="shpat_..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
                <p className="text-xs text-gray-500 mt-1">Shopify Admin → Apps → Develop apps → create app with <strong>write_customers</strong> scope → Install → copy Admin API access token.</p>
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    title: "You're ready",
    render: (data) => (
      <div className="space-y-5">
        <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Business</span>
            <span className="font-medium text-gray-900">{(data.businessName as string) || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Tone</span>
            <span className="font-medium text-gray-900">{(data.tone as string) || "Friendly"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Booking URL</span>
            <span className="font-medium text-gray-900 truncate ml-4">{(data.bookingUrl as string) || "Not set"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Lead capture</span>
            <span className="font-medium text-gray-900">{data.captureLeads ? "On" : "Off"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Lead sync</span>
            <span className="font-medium text-gray-900 capitalize">{(data.platform as string) === "shopify" ? "Shopify" : "Off"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Knowledge base</span>
            <span className="font-medium text-gray-900">{(data.knowledgeBase as string)?.length ? `${(data.knowledgeBase as string).length} chars` : "Empty"}</span>
          </div>
        </div>
        <p className="text-sm text-gray-600">Click <strong>Activate</strong> and you'll get a one-line script to paste into your website.</p>
      </div>
    ),
  },
];

export default function MojuChatPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("chat");
  const [saving, setSaving] = useState(false);

  const handleComplete = async (data: Record<string, unknown>) => {
    setSaving(true);
    const chatKey = (config?.chatKey as string) || crypto.randomUUID();
    await save({ ...data, chatKey });
    setSaving(false);
  };

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://your-app-url.vercel.app";
  const embedSnippet = config?.chatKey
    ? `<script src="${appUrl}/api/widget?key=${config.chatKey as string}" defer></script>`
    : "";

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💬 MojuChat</h1>
          <p className="text-gray-500 mt-1">AI chat widget — live support, lead capture, and booking guidance 24/7.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Website</span><span className="text-gray-900 font-medium">{config.websiteUrl as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Industry</span><span className="text-gray-900 font-medium">{config.industry as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Tone</span><span className="text-gray-900 font-medium">{config.tone as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Lead capture</span><span className="text-gray-900 font-medium">{config.captureLeads ? "On" : "Off"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Lead sync</span><span className="text-gray-900 font-medium capitalize">{(config.platform as string) === "shopify" ? "Shopify" : "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Knowledge base</span><span className="text-gray-900 font-medium">{(config.knowledgeBase as string)?.length ? `${(config.knowledgeBase as string).length} chars` : "—"}</span></div>
            </div>
          </div>

          {embedSnippet && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Embed snippet</h2>
                <button
                  onClick={() => navigator.clipboard.writeText(embedSnippet)}
                  className="text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1 rounded transition-colors"
                >
                  Copy
                </button>
              </div>
              <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">{embedSnippet}</pre>
              <p className="text-xs text-gray-500 mt-3">Paste before the <code className="text-gray-400">&lt;/body&gt;</code> tag. On Shopify: Online Store → Themes → Edit Code → <code className="text-gray-400">theme.liquid</code></p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setReconfiguring(true)} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Reconfigure</button>
            <button onClick={() => void clear()} className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Deactivate</button>
          </div>
        </div>
      ) : (
        <OnboardingWizard
          steps={STEPS}
          onComplete={handleComplete}
          initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}}
        />
      )}

      {saving && <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg">Saving...</div>}
    </div>
  );
}
