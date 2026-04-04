"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const ESCALATION_CHANNELS = ["Email", "SMS", "Both"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Services" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Support email (customer-facing)</label>
          <input type="email" value={(data.supportEmail as string) ?? ""} onChange={(e) => update({ supportEmail: e.target.value })} placeholder="support@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">What types of questions do customers ask after a sale?</label>
          <textarea value={(data.supportContext as string) ?? ""} onChange={(e) => update({ supportContext: e.target.value })} rows={3} placeholder="Return policy, warranty claims, how to use product, delivery status, scheduling follow-up services..." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
      </div>
    ),
  },
  {
    title: "Knowledge base",
    render: (data, update) => {
      const faqs = (data.faqs as Array<{ q: string; a: string }>) ?? [];
      const setFaqs = (next: Array<{ q: string; a: string }>) => update({ faqs: next });
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-700">Add your most common post-sale questions. MojuSupport will answer these automatically.</p>
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-gray-400 mt-1">Q{i + 1}</span>
                <button type="button" onClick={() => setFaqs(faqs.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
              </div>
              <input type="text" value={faq.q} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], q: e.target.value }; setFaqs(next); }} placeholder="How do I request a refund?" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
              <textarea value={faq.a} onChange={(e) => { const next = [...faqs]; next[i] = { ...next[i], a: e.target.value }; setFaqs(next); }} rows={2} placeholder="Refunds are processed within 3-5 business days. Email us at billing@..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
            </div>
          ))}
          <button type="button" onClick={() => setFaqs([...faqs, { q: "", a: "" }])} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 transition-colors">+ Add FAQ</button>
        </div>
      );
    },
  },
  {
    title: "Escalation rules",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Escalate to this person / team</label>
          <input type="email" value={(data.escalationEmail as string) ?? ""} onChange={(e) => update({ escalationEmail: e.target.value })} placeholder="manager@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Notify via</label>
          <div className="grid grid-cols-3 gap-3">
            {ESCALATION_CHANNELS.map((c) => (
              <button key={c} type="button" onClick={() => update({ escalationChannel: c })} className={`py-2.5 rounded-lg border text-sm font-medium transition-colors ${data.escalationChannel === c ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"}`}>{c}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Keywords that trigger immediate escalation</label>
          <input type="text" value={(data.escalationKeywords as string) ?? ""} onChange={(e) => update({ escalationKeywords: e.target.value })} placeholder="refund, lawyer, broken, urgent, complaint" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
          <p className="text-xs text-gray-600 mt-1">Comma-separated. MojuSupport will hand off immediately when these words appear.</p>
        </div>
      </div>
    ),
  },
  {
    title: "Widget setup",
    render: (data, update) => {
      const script = `<script src="https://cdn.mojucrew.com/support.js" data-key="YOUR_KEY" data-business="${data.businessName ?? "Your Business"}"></script>`;
      return (
        <div className="space-y-5">
          <p className="text-sm text-gray-700">Add the MojuSupport widget to your site so customers can get help directly from your order confirmation page, invoices, or anywhere you choose.</p>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <pre className="text-xs text-green-400 whitespace-pre-wrap break-all">{script}</pre>
            <button type="button" onClick={() => navigator.clipboard.writeText(script)} className="absolute top-3 right-3 text-xs text-gray-600 hover:text-white bg-gray-700 px-2 py-1 rounded">Copy</button>
          </div>
          <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
            <div>
              <p className="text-sm font-medium text-gray-800">Show ticket status to customers</p>
              <p className="text-xs text-gray-600">Let customers track their support request</p>
            </div>
            <button type="button" onClick={() => update({ showTicketStatus: !data.showTicketStatus })} className={`w-11 h-6 rounded-full transition-colors ${data.showTicketStatus ? "bg-black" : "bg-gray-200"}`}>
              <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.showTicketStatus ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>
      );
    },
  },
];

export default function MojuSupportPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("support");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🎧 MojuSupport</h1>
          <p className="text-gray-500 mt-1">Support bot — handles common after-sale questions and escalates when needed.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">Support email</span><span className="text-gray-900 font-medium">{config.supportEmail as string ?? "—"}</span></div>
              <div><span className="text-gray-500 block mb-0.5">FAQs</span><span className="text-gray-900 font-medium">{((config.faqs as unknown[]) ?? []).length} entries</span></div>
              <div><span className="text-gray-500 block mb-0.5">Escalation channel</span><span className="text-gray-900 font-medium">{config.escalationChannel as string ?? "—"}</span></div>
              <div className="col-span-2"><span className="text-gray-500 block mb-0.5">Escalation keywords</span><span className="text-gray-900 font-medium">{config.escalationKeywords as string ?? "—"}</span></div>
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
