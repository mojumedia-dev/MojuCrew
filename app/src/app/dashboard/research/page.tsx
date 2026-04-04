"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const FREQUENCIES = ["Daily", "Weekly", "Bi-weekly", "Monthly"];
const INDUSTRIES = ["Restaurant / Food & Beverage", "Health & Wellness", "Beauty & Salon", "Home Services", "Retail", "Fitness / Gym", "Legal Services", "Real Estate", "Auto Services", "Other"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Services" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
          <select value={(data.industry as string) ?? ""} onChange={(e) => update({ industry: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            <option value="">Select industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your location (city or region)</label>
          <input type="text" value={(data.location as string) ?? ""} onChange={(e) => update({ location: e.target.value })} placeholder="Miami, FL" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
    ),
  },
  {
    title: "Competitors to track",
    render: (data, update) => {
      const competitors = (data.competitors as string[]) ?? [""];
      const setCompetitors = (next: string[]) => update({ competitors: next });
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">Add your top competitors. MojuResearch will monitor their pricing, offers, and changes.</p>
          {competitors.map((c, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={c} onChange={(e) => { const next = [...competitors]; next[i] = e.target.value; setCompetitors(next); }} placeholder={`Competitor ${i + 1} (name or website)`} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              {competitors.length > 1 && (
                <button type="button" onClick={() => setCompetitors(competitors.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-sm px-1">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setCompetitors([...competitors, ""])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors">+ Add competitor</button>
        </div>
      );
    },
  },
  {
    title: "Topics & keywords",
    render: (data, update) => {
      const keywords = (data.keywords as string[]) ?? [""];
      const setKeywords = (next: string[]) => update({ keywords: next });
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">What topics should MojuResearch track? Add keywords relevant to your business and market.</p>
          {keywords.map((kw, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="text" value={kw} onChange={(e) => { const next = [...keywords]; next[i] = e.target.value; setKeywords(next); }} placeholder={`e.g. "hair salon trends Miami"`} className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              {keywords.length > 1 && (
                <button type="button" onClick={() => setKeywords(keywords.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-sm px-1">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setKeywords([...keywords, ""])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors">+ Add keyword</button>
        </div>
      );
    },
  },
  {
    title: "Report delivery",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Send reports to</label>
          <input type="email" value={(data.reportEmail as string) ?? ""} onChange={(e) => update({ reportEmail: e.target.value })} placeholder="you@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Report frequency</label>
          <div className="grid grid-cols-2 gap-3">
            {FREQUENCIES.map((f) => (
              <button key={f} type="button" onClick={() => update({ frequency: f })} className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${data.frequency === f ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{f}</button>
            ))}
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          Your first report will arrive within 24 hours of activation. Each report includes competitor changes, industry headlines, and actionable insights.
        </div>
      </div>
    ),
  },
];

export default function MojuResearchPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("research");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🔍 MojuResearch</h1>
          <p className="text-gray-500 mt-1">Market researcher — tracks competitors and delivers actionable insights.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Location</span><span className="text-gray-900 font-medium">{config.location as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Competitors tracked</span><span className="text-gray-900 font-medium">{((config.competitors as string[]) ?? []).filter(Boolean).length}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Keywords tracked</span><span className="text-gray-900 font-medium">{((config.keywords as string[]) ?? []).filter(Boolean).length}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Report frequency</span><span className="text-gray-900 font-medium">{config.frequency as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Report email</span><span className="text-gray-900 font-medium">{config.reportEmail as string ?? "—"}</span></div>
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
