"use client";

import { useState } from "react";
import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const INDUSTRIES = [
  "Restaurant / Food & Beverage", "Health & Wellness", "Beauty & Salon",
  "Home Services", "Retail", "Fitness / Gym", "Legal Services",
  "Real Estate", "Auto Services", "Other",
];
const TONES = ["Professional", "Friendly", "Casual", "Concise"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Coffee Co." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Website URL</label>
          <input type="url" value={(data.websiteUrl as string) ?? ""} onChange={(e) => update({ websiteUrl: e.target.value })} placeholder="https://yoursite.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Industry</label>
          <select value={(data.industry as string) ?? ""} onChange={(e) => update({ industry: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            <option value="">Select an industry...</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      </div>
    ),
  },
  {
    title: "Personality",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Chat tone</label>
          <div className="grid grid-cols-2 gap-3">
            {TONES.map((t) => (
              <button key={t} type="button" onClick={() => update({ tone: t })} className={`py-2.5 px-4 rounded-lg border text-sm font-medium transition-colors ${data.tone === t ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Opening greeting</label>
          <textarea value={(data.greeting as string) ?? ""} onChange={(e) => update({ greeting: e.target.value })} rows={3} placeholder="Hi! I'm the assistant for [Business]. How can I help you today?" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
      </div>
    ),
  },
  {
    title: "Common FAQs",
    render: (data, update) => {
      const faqs = (data.faqs as Array<{ q: string; a: string }>) ?? [];
      const setFaqs = (next: Array<{ q: string; a: string }>) => update({ faqs: next });
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Add questions your customers commonly ask. MojuChat will answer these automatically.</p>
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-gray-400 mt-1">Q{i + 1}</span>
                <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
              </div>
              <input type="text" value={faq.q} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], q: e.target.value }; setFaqs(next); }} placeholder="What are your hours?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
              <textarea value={faq.a} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], a: e.target.value }; setFaqs(next); }} rows={2} placeholder="We're open Mon–Sat, 9am–6pm." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 transition-colors">+ Add FAQ</button>
        </div>
      );
    },
  },
  {
    title: "Install your widget",
    render: (data) => {
      const script = `<script src="https://cdn.mojucrew.com/chat.js" data-key="YOUR_KEY" data-name="${data.businessName ?? "Your Business"}" data-tone="${(data.tone as string ?? "Friendly").toLowerCase()}"></script>`;
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-700">Paste this snippet before the <code className="bg-gray-100 px-1 rounded text-xs">&lt;/body&gt;</code> tag on your website.</p>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">{script}</pre>
            <button type="button" onClick={() => navigator.clipboard.writeText(script)} className="absolute top-3 right-3 text-xs text-gray-600 hover:text-white bg-gray-700 px-2 py-1 rounded">Copy</button>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">Your full embed key will be generated after account activation.</div>
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
    await save(data);
    setSaving(false);
  };

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💬 MojuChat</h1>
          <p className="text-gray-500 mt-1">AI receptionist — live chat, lead capture, FAQ answering 24/7.</p>
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
              <div className="col-span-2"><span className="text-gray-500 block mb-0.5">FAQs</span><span className="text-gray-900 font-medium">{((config.faqs as unknown[]) ?? []).length} entries</span></div>
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-white mb-2">Embed snippet</h2>
            <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">{`<script src="https://cdn.mojucrew.com/chat.js" data-key="YOUR_KEY" data-name="${config.businessName ?? "Your Business"}" data-tone="${((config.tone as string) ?? "friendly").toLowerCase()}"></script>`}</pre>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setReconfiguring(true)} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Reconfigure</button>
            <button onClick={() => void clear()} className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Deactivate</button>
          </div>
        </div>
      ) : (
        <OnboardingWizard steps={STEPS} onComplete={handleComplete} initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}} />
      )}
      {saving && <div className="fixed bottom-4 right-4 bg-black text-white text-sm px-4 py-2 rounded-lg">Saving...</div>}
    </div>
  );
}
