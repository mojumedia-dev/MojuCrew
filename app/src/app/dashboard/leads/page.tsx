"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const LEAD_SOURCES = ["Website contact form", "Social media DMs", "Walk-ins / in-person", "Referrals", "Paid ads", "Google search", "Other"];
const CHANNELS = ["Email", "SMS", "Both"];
const SEQUENCE_LENGTHS = ["3 messages", "5 messages", "7 messages", "10 messages"];
const DELAYS = ["1 day", "2 days", "3 days", "5 days", "1 week"];

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
          <label className="block text-sm font-medium text-gray-800 mb-2">Where do your leads come from?</label>
          <div className="space-y-2">
            {LEAD_SOURCES.map((s) => {
              const active = ((data.leadSources as string[]) ?? []).includes(s);
              return (
                <button key={s} type="button" onClick={() => {
                  const current = (data.leadSources as string[]) ?? [];
                  update({ leadSources: active ? current.filter((x) => x !== s) : [...current, s] });
                }} className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${active ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>
                  <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${active ? "bg-white border-white" : "border-gray-400"}`}>
                    {active && <span className="text-black text-xs">✓</span>}
                  </span>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Sequence setup",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Follow-up channel</label>
          <div className="grid grid-cols-3 gap-3">
            {CHANNELS.map((c) => (
              <button key={c} type="button" onClick={() => update({ channel: c })} className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${data.channel === c ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Sequence length</label>
          <div className="grid grid-cols-2 gap-3">
            {SEQUENCE_LENGTHS.map((s) => (
              <button key={s} type="button" onClick={() => update({ sequenceLength: s })} className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${data.sequenceLength === s ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{s}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Delay between messages</label>
          <div className="flex flex-wrap gap-2">
            {DELAYS.map((d) => (
              <button key={d} type="button" onClick={() => update({ delay: d })} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${data.delay === d ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{d}</button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Message templates",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-700">Write your first follow-up message. MojuLeads will generate the rest of the sequence based on your tone and goal.</p>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">First follow-up message</label>
          <textarea value={(data.firstMessage as string) ?? ""} onChange={(e) => update({ firstMessage: e.target.value })} rows={4} placeholder="Hey [Name], thanks for your interest in [Business]! I wanted to reach out personally — do you have 10 minutes this week to chat?" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
          <p className="text-xs text-gray-600 mt-1">Use [Name] and [Business] as placeholders.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">What&apos;s your goal for these leads?</label>
          <select value={(data.goal as string) ?? ""} onChange={(e) => update({ goal: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            <option value="">Select a goal...</option>
            <option value="Book a call">Book a call</option>
            <option value="Schedule a visit">Schedule a visit</option>
            <option value="Get a quote signed">Get a quote signed</option>
            <option value="Drive a purchase">Drive a purchase</option>
            <option value="Build a relationship">Build a relationship</option>
          </select>
        </div>
      </div>
    ),
  },
  {
    title: "Notifications",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Alert me when a lead replies</label>
          <input type="email" value={(data.alertEmail as string) ?? ""} onChange={(e) => update({ alertEmail: e.target.value })} placeholder="you@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Pause sequence when lead replies</p>
            <p className="text-xs text-gray-600">Stop automated messages once the lead responds</p>
          </div>
          <button type="button" onClick={() => update({ pauseOnReply: !data.pauseOnReply })} className={`w-11 h-6 rounded-full transition-colors ${data.pauseOnReply !== false ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.pauseOnReply !== false ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
          MojuLeads will start running sequences on any new leads added after activation. You can also import existing leads from a CSV.
        </div>
      </div>
    ),
  },
];

export default function MojuLeadsPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("leads");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎯 MojuLeads</h1>
          <p className="text-gray-500 mt-1">Lead nurture bot — drips follow-up sequences on cold leads automatically.</p>
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
              <div><span className="text-gray-500 block mb-0.5">Sequence</span><span className="text-gray-900 font-medium">{config.sequenceLength as string ?? "—"} · every {config.delay as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Goal</span><span className="text-gray-900 font-medium">{config.goal as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Pause on reply</span><span className="text-gray-900 font-medium">{config.pauseOnReply !== false ? "Yes" : "No"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Alert email</span><span className="text-gray-900 font-medium">{config.alertEmail as string ?? "—"}</span></div>
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
