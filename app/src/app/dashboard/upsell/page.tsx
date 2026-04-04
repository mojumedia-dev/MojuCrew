"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const TRIGGERS = ["30 days after last purchase", "60 days after last purchase", "90 days after last purchase", "After a specific service is completed", "Seasonally (quarterly)"];
const CHANNELS = ["Email", "SMS", "Both"];
const DISCOUNT_TYPES = ["No discount — just a relevant offer", "Fixed amount off (e.g. $10 off)", "Percentage off (e.g. 15% off)", "Free add-on or upgrade"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Services" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">What products or services do you offer?</label>
          <textarea value={(data.services as string) ?? ""} onChange={(e) => update({ services: e.target.value })} rows={3} placeholder="Oil changes, tire rotations, brake service, full detailing..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Notification email</label>
          <input type="email" value={(data.notifyEmail as string) ?? ""} onChange={(e) => update({ notifyEmail: e.target.value })} placeholder="you@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
    ),
  },
  {
    title: "Upsell triggers",
    render: (data, update) => (
      <div className="space-y-4">
        <p className="text-sm text-gray-700">When should MojuUpsell reach out to past customers?</p>
        <div className="space-y-2">
          {TRIGGERS.map((t) => {
            const active = ((data.triggers as string[]) ?? []).includes(t);
            return (
              <button key={t} type="button" onClick={() => {
                const current = (data.triggers as string[]) ?? [];
                update({ triggers: active ? current.filter((x) => x !== t) : [...current, t] });
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
    title: "Offer type",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">What kind of offer will you send?</label>
          <div className="space-y-2">
            {DISCOUNT_TYPES.map((d) => (
              <button key={d} type="button" onClick={() => update({ discountType: d })} className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${data.discountType === d ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{d}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Offer message template</label>
          <textarea value={(data.offerMessage as string) ?? ""} onChange={(e) => update({ offerMessage: e.target.value })} rows={3} placeholder="Hey [Name], it's been a while! We'd love to have you back — here's 15% off your next visit: [Link]" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
          <p className="text-xs text-gray-600 mt-1">Use [Name] and [Link] as placeholders.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Delivery channel",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Send upsell offers via</label>
          <div className="grid grid-cols-3 gap-3">
            {CHANNELS.map((c) => (
              <button key={c} type="button" onClick={() => update({ channel: c })} className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${data.channel === c ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Only contact customers once per period</p>
            <p className="text-xs text-gray-600">Prevent sending multiple offers too close together</p>
          </div>
          <button type="button" onClick={() => update({ throttle: !data.throttle })} className={`w-11 h-6 rounded-full transition-colors ${data.throttle !== false ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.throttle !== false ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          MojuUpsell works best when connected to your customer history. Import past customers via CSV after activation.
        </div>
      </div>
    ),
  },
];

export default function MojuUpsellPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("upsell");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📈 MojuUpsell</h1>
          <p className="text-gray-500 mt-1">Upsell bot — identifies past customers and pitches relevant offers.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Channel</span><span className="text-gray-900 font-medium">{config.channel as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Offer type</span><span className="text-gray-900 font-medium">{config.discountType as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Throttle</span><span className="text-gray-900 font-medium">{config.throttle !== false ? "On" : "Off"}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block mb-0.5">Triggers</span><span className="text-gray-900 font-medium">{((config.triggers as string[]) ?? []).join(", ") || "—"}</span></div>
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
