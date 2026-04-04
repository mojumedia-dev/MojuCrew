"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const DEFAULT_STAGES = ["New Lead", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost"];
const CADENCES = ["Same day", "Next day", "2 days", "3 days", "1 week"];
const INDUSTRIES = ["Restaurant / Food & Beverage", "Health & Wellness", "Beauty & Salon", "Home Services", "Retail", "Fitness / Gym", "Legal Services", "Real Estate", "Auto Services", "Other"];

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
          <label className="block text-sm font-medium text-gray-800 mb-1">Industry</label>
          <select value={(data.industry as string) ?? ""} onChange={(e) => update({ industry: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            <option value="">Select industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Notification email</label>
          <input type="email" value={(data.notifyEmail as string) ?? ""} onChange={(e) => update({ notifyEmail: e.target.value })} placeholder="you@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
    ),
  },
  {
    title: "Pipeline stages",
    render: (data, update) => {
      const stages = (data.stages as string[]) ?? DEFAULT_STAGES;
      const setStages = (next: string[]) => update({ stages: next });
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Customize your sales pipeline. MojuCRM moves leads through these stages automatically.</p>
          {stages.map((stage, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-gray-600 w-4">{i + 1}</span>
              <input type="text" value={stage} onChange={(e) => { const next = [...stages]; next[i] = e.target.value; setStages(next); }} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              {stages.length > 2 && (
                <button type="button" onClick={() => setStages(stages.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-sm px-1">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setStages([...stages, ""])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors">+ Add stage</button>
        </div>
      );
    },
  },
  {
    title: "Follow-up settings",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Number of follow-up attempts</label>
          <select value={(data.followUpCount as string) ?? "3"} onChange={(e) => update({ followUpCount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            {[1,2,3,4,5,6,7].map((n) => <option key={n} value={n}>{n} follow-up{n > 1 ? "s" : ""}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Cadence between follow-ups</label>
          <div className="grid grid-cols-3 gap-2">
            {CADENCES.map((c) => (
              <button key={c} type="button" onClick={() => update({ cadence: c })} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${data.cadence === c ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Follow-up message template</label>
          <textarea value={(data.followUpTemplate as string) ?? ""} onChange={(e) => update({ followUpTemplate: e.target.value })} rows={3} placeholder="Hi [Name], just following up — are you available this week?" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
          <p className="text-xs text-gray-600 mt-1">Use [Name] as a placeholder for the contact's name.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Connect email",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-700">Connect your email so MojuCRM can log conversations and send follow-ups automatically.</p>
        <div className="space-y-3">
          {["Gmail", "Outlook"].map((provider) => (
            <button key={provider} type="button" onClick={() => update({ emailProvider: provider })} className={`w-full flex items-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${data.emailProvider === provider ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
              {data.emailProvider === provider ? "✓" : "○"} Connect {provider}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-500">Full OAuth integration launches with your subscription. We never store your email password.</div>
      </div>
    ),
  },
];

export default function MojuCRMPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("crm");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📋 MojuCRM</h1>
          <p className="text-gray-500 mt-1">CRM manager — logs interactions, follows up leads, manages your pipeline.</p>
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
              <div><span className="text-gray-500 block mb-0.5">Follow-ups</span><span className="text-gray-900 font-medium">{config.followUpCount as string ?? "—"} · {config.cadence as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Email</span><span className="text-gray-900 font-medium">{config.emailProvider as string ?? "Not connected"}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block mb-0.5">Pipeline</span><span className="text-gray-900 font-medium">{((config.stages as string[]) ?? []).join(" → ")}</span></div>
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
