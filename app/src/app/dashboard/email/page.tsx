"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const CAMPAIGN_TYPES = ["Newsletter", "Promotional offers", "Welcome series (new subscribers)", "Re-engagement (lapsed customers)", "Product announcements", "Seasonal campaigns"];
const FREQUENCIES = ["Once a week", "Twice a month", "Once a month", "Quarterly", "Event-driven only"];
const SEND_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TONES = ["Professional", "Friendly", "Conversational", "Promotional", "Educational"];

const STEPS: WizardStep[] = [
  {
    title: "Sender details",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Coffee Co." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Send emails from</label>
          <input type="email" value={(data.fromEmail as string) ?? ""} onChange={(e) => update({ fromEmail: e.target.value })} placeholder="hello@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Reply-to email</label>
          <input type="email" value={(data.replyTo as string) ?? ""} onChange={(e) => update({ replyTo: e.target.value })} placeholder="Same as above (or a different address)" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">What do you want to tell your subscribers?</label>
          <textarea value={(data.purpose as string) ?? ""} onChange={(e) => update({ purpose: e.target.value })} rows={2} placeholder="Keep locals updated on new menu items, weekly specials, and upcoming events at our café." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
      </div>
    ),
  },
  {
    title: "Campaign types",
    render: (data, update) => (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">What types of campaigns will you run? MojuEmail will tailor its writing to these goals.</p>
        <div className="space-y-2">
          {CAMPAIGN_TYPES.map((t) => {
            const active = ((data.campaignTypes as string[]) ?? []).includes(t);
            return (
              <button key={t} type="button" onClick={() => {
                const current = (data.campaignTypes as string[]) ?? [];
                update({ campaignTypes: active ? current.filter((x) => x !== t) : [...current, t] });
              }} className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${active ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>
                <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${active ? "bg-white border-white" : "border-gray-400"}`}>
                  {active && <span className="text-black text-xs">✓</span>}
                </span>
                {t}
              </button>
            );
          })}
        </div>
      </div>
    ),
  },
  {
    title: "Voice & schedule",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Email tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button key={t} type="button" onClick={() => update({ tone: t })} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${data.tone === t ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Send frequency</label>
          <div className="space-y-2">
            {FREQUENCIES.map((f) => (
              <button key={f} type="button" onClick={() => update({ frequency: f })} className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${data.frequency === f ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Preferred send day</label>
          <div className="flex gap-2">
            {SEND_DAYS.map((d) => (
              <button key={d} type="button" onClick={() => update({ sendDay: d })} className={`w-12 py-2 rounded-lg border text-sm font-medium transition-colors ${data.sendDay === d ? "bg-black text-white border-black" : "border-gray-200 text-gray-500 hover:border-gray-400"}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Email list",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-700">Connect your existing email list or start fresh. MojuEmail will manage your subscribers and unsubscribes automatically.</p>
        <div className="space-y-3">
          {["Mailchimp", "Klaviyo", "ActiveCampaign", "ConvertKit"].map((provider) => (
            <button key={provider} type="button" onClick={() => update({ listProvider: provider })} className={`w-full flex items-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${data.listProvider === provider ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
              {data.listProvider === provider ? "✓" : "○"} Connect {provider}
            </button>
          ))}
          <button type="button" onClick={() => update({ listProvider: "CSV Upload" })} className={`w-full flex items-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${data.listProvider === "CSV Upload" ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
            {data.listProvider === "CSV Upload" ? "✓" : "○"} Upload CSV (I&apos;ll do this after setup)
          </button>
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Review emails before sending</p>
            <p className="text-xs text-gray-600">Approve each campaign draft before MojuEmail sends it</p>
          </div>
          <button type="button" onClick={() => update({ requireApproval: !data.requireApproval })} className={`w-11 h-6 rounded-full transition-colors ${data.requireApproval ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.requireApproval ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    ),
  },
];

export default function MojuEmailPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("email");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">✉️ MojuEmail</h1>
          <p className="text-gray-500 mt-1">Email bot — writes and schedules newsletters and campaign sequences.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">From email</span><span className="text-gray-900 font-medium">{config.fromEmail as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Frequency</span><span className="text-gray-900 font-medium">{config.frequency as string ?? "—"} · {config.sendDay as string ?? "—"}s</span></div>
              <div><span className="text-gray-500 block mb-0.5">Tone</span><span className="text-gray-900 font-medium">{config.tone as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">List provider</span><span className="text-gray-900 font-medium">{config.listProvider as string ?? "Not connected"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Approval required</span><span className="text-gray-900 font-medium">{config.requireApproval ? "Yes" : "No"}</span></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setReconfiguring(true)} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Reconfigure</button>
            <button onClick={() => void clear()} className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Deactivate</button>
          </div>
        </div>
      ) : (
        <OnboardingWizard steps={STEPS} onComplete={save} initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}} />
      )}
    </div>
  );
}
