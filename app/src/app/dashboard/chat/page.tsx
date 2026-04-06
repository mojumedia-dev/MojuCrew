"use client";

import { useState } from "react";
import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";
import KnowledgeBaseStep from "@/components/KnowledgeBaseStep";

const INDUSTRIES = [
  "Health & Wellness", "Beauty & Salon", "Fitness / Gym",
  "Restaurant / Food & Beverage", "Home Services", "Retail",
  "Legal Services", "Real Estate", "Auto Services", "Other",
];
const TONES = ["Professional", "Friendly", "Casual", "Concise"];

const PLATFORMS = [
  { id: "shopify",        label: "Shopify" },
  { id: "hubspot",        label: "HubSpot" },
  { id: "ghl",            label: "GoHighLevel" },
  { id: "mailchimp",      label: "Mailchimp" },
  { id: "woocommerce",    label: "WooCommerce" },
  { id: "activecampaign", label: "ActiveCampaign" },
  { id: "wix",            label: "Wix" },
  { id: "none",           label: "Skip — no lead sync" },
];

function PlatformFields({ platform, data, update }: {
  platform: string;
  data: Record<string, unknown>;
  update: (patch: Record<string, unknown>) => void;
}) {
  const inp = (field: string, label: string, placeholder: string, hint?: string, type = "text") => (
    <div>
      <label className="block text-sm font-medium text-gray-800 mb-1">{label}</label>
      <input type={type} value={(data[field] as string) ?? ""} onChange={(e) => update({ [field]: e.target.value })}
        placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900 placeholder:text-gray-400" />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );

  if (platform === "shopify") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("shopifyStoreUrl", "Store URL", "your-store.myshopify.com")}
      {inp("shopifyApiToken", "Admin API access token", "shpat_...", "Admin → Apps → Develop apps → create app with write_customers scope → Install → copy token.", "password")}
    </div>
  );

  if (platform === "hubspot") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("hubspotToken", "Private app token", "pat-na1-...", "HubSpot → Settings → Integrations → Private Apps → Create → copy token. Needs crm.objects.contacts.write scope.", "password")}
    </div>
  );

  if (platform === "ghl") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("ghlApiKey", "API key", "eyJhbGci...", "GoHighLevel → Settings → Business Profile → API Keys.", "password")}
      {inp("ghlLocationId", "Location ID", "abc123...", "Found in GHL → Settings → Business Info.")}
    </div>
  );

  if (platform === "mailchimp") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("mailchimpApiKey", "API key", "abc123...def-us1", "Mailchimp → Account → Extras → API Keys. The last part (e.g. us1) is your datacenter.", "password")}
      {inp("mailchimpListId", "Audience / List ID", "a1b2c3d4", "Mailchimp → Audience → Settings → Audience name and defaults → Audience ID.")}
    </div>
  );

  if (platform === "woocommerce") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("wooStoreUrl", "Store URL", "https://yourstore.com", "Your WordPress site URL (not wp-admin).")}
      {inp("wooConsumerKey", "Consumer key", "ck_...", "WooCommerce → Settings → Advanced → REST API → Add key with Read/Write access.", "password")}
      {inp("wooConsumerSecret", "Consumer secret", "cs_...", undefined, "password")}
    </div>
  );

  if (platform === "activecampaign") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("acAccountName", "Account name", "mycompany", "The subdomain of your ActiveCampaign URL (e.g. mycompany from mycompany.activehosted.com).")}
      {inp("acApiToken", "API token", "abc123...", "ActiveCampaign → Settings → Developer → API Access.", "password")}
    </div>
  );

  if (platform === "wix") return (
    <div className="space-y-4 border border-gray-100 rounded-xl p-4">
      {inp("wixApiKey", "API key", "IST...", "Wix → Settings → API Keys → Generate API Key. Needs Contacts (read + write) permission.", "password")}
      {inp("wixSiteId", "Site ID", "abc-123-def...", "Found in Wix → Settings → Business info, or in your site's URL.")}
    </div>
  );

  return null;
}

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
          <select value={(data.industry as string) ?? ""} onChange={(e) => update({ industry: e.target.value })} className={`w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white ${(data.industry as string) ? "text-gray-900" : "text-gray-400"}`}>
            <option value="" disabled>Select an industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Booking / appointment URL</label>
          <input type="url" value={(data.bookingUrl as string) ?? ""} onChange={(e) => update({ bookingUrl: e.target.value })} placeholder="https://yoursite.com/book" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
          <p className="text-xs text-gray-500 mt-1">The bot guides visitors here when they want to book or schedule.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Knowledge base",
    render: (data, update) => <KnowledgeBaseStep data={data} update={update} />,
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
          <textarea value={(data.greeting as string) ?? ""} onChange={(e) => update({ greeting: e.target.value })} rows={3} placeholder={`Hi! I'm the assistant for ${(data.businessName as string) ?? "us"}. How can I help you today?`} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-900 placeholder:text-gray-400" />
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
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Connect your platform so captured leads are auto-created as contacts or customers.</p>
          <div className="grid grid-cols-2 gap-2">
            {PLATFORMS.map((p) => (
              <button key={p.id} type="button" onClick={() => update({ platform: p.id })}
                className={`py-2.5 px-3 rounded-lg border text-sm font-medium text-center transition-colors ${platform === p.id ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>
                {p.label}
              </button>
            ))}
          </div>
          {platform && platform !== "none" && (
            <PlatformFields platform={platform} data={data} update={update} />
          )}
        </div>
      );
    },
  },
  {
    title: "You're ready",
    render: (data) => {
      const platformLabel = PLATFORMS.find(p => p.id === (data.platform as string))?.label ?? "Off";
      return (
        <div className="space-y-5">
          <div className="bg-gray-50 rounded-xl p-5 space-y-3 text-sm">
            {[
              ["Business", (data.businessName as string) || "—"],
              ["Tone", (data.tone as string) || "Friendly"],
              ["Booking URL", (data.bookingUrl as string) || "Not set"],
              ["Lead capture", data.captureLeads ? "On" : "Off"],
              ["Lead sync", platformLabel === "Skip — no lead sync" ? "Off" : platformLabel],
              ["Knowledge base", (data.knowledgeBase as string)?.length ? `${(data.knowledgeBase as string).length} chars` : "Empty"],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-gray-900 truncate ml-4 max-w-[55%] text-right">{value}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">Click <strong>Activate</strong> and you'll get a one-line script to paste into your website.</p>
        </div>
      );
    },
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const embedSnippet = config?.chatKey
    ? `<script src="${appUrl}/api/widget?key=${config.chatKey as string}" defer></script>`
    : "";

  const platformLabel = PLATFORMS.find(p => p.id === (config?.platform as string))?.label;
  const displayPlatform = platformLabel && platformLabel !== "Skip — no lead sync" ? platformLabel : "—";

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
              <div><span className="text-gray-500 block mb-0.5">Industry</span><span className="text-gray-900 font-medium">{config.industry as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Tone</span><span className="text-gray-900 font-medium">{config.tone as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Lead capture</span><span className="text-gray-900 font-medium">{config.captureLeads ? "On" : "Off"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Lead sync</span><span className="text-gray-900 font-medium">{displayPlatform}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Knowledge base</span><span className="text-gray-900 font-medium">{(config.knowledgeBase as string)?.length ? `${(config.knowledgeBase as string).length} chars` : "—"}</span></div>
            </div>
          </div>

          {embedSnippet && (
            <div className="bg-gray-900 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-white">Embed snippet</h2>
                <button onClick={() => navigator.clipboard.writeText(embedSnippet)} className="text-xs text-gray-400 hover:text-white bg-gray-700 px-3 py-1 rounded transition-colors">Copy</button>
              </div>
              <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">{embedSnippet}</pre>
              <p className="text-xs text-gray-500 mt-3">Paste before <code className="text-gray-400">&lt;/body&gt;</code>. Shopify: Online Store → Themes → Edit Code → <code className="text-gray-400">theme.liquid</code></p>
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={() => setReconfiguring(true)} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Reconfigure</button>
            <button onClick={() => void clear()} className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Deactivate</button>
          </div>
        </div>
      ) : (
        <OnboardingWizard steps={STEPS} onComplete={handleComplete} initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}} storageKey={reconfiguring ? undefined : "wizard_chat"} />
      )}

      {saving && <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg shadow-lg">Saving...</div>}
    </div>
  );
}
