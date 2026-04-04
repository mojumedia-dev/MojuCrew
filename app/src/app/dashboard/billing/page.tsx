"use client";

import { useState, useEffect } from "react";
import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { getBotConfig, saveBotConfig, clearBotConfig, BotConfig } from "@/lib/botConfig";

const PAYMENT_TERMS = ["Due on receipt", "Net 7", "Net 14", "Net 30", "Net 60"];
const CURRENCIES = ["USD ($)", "CAD ($)", "GBP (£)", "EUR (€)", "AUD ($)"];
const REMINDER_TIMING = ["3 days before due", "1 day before due", "On due date", "3 days overdue", "7 days overdue", "14 days overdue"];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Services LLC" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice from email</label>
          <input type="email" value={(data.invoiceEmail as string) ?? ""} onChange={(e) => update({ invoiceEmail: e.target.value })} placeholder="billing@yourbusiness.com" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <select value={(data.currency as string) ?? ""} onChange={(e) => update({ currency: e.target.value })} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white">
            <option value="">Select currency...</option>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
    ),
  },
  {
    title: "Invoice settings",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Default payment terms</label>
          <div className="grid grid-cols-3 gap-2">
            {PAYMENT_TERMS.map((t) => (
              <button key={t} type="button" onClick={() => update({ paymentTerms: t })} className={`py-2 rounded-lg border text-sm font-medium transition-colors ${data.paymentTerms === t ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{t}</button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Invoice footer / notes</label>
          <textarea value={(data.invoiceFooter as string) ?? ""} onChange={(e) => update({ invoiceFooter: e.target.value })} rows={2} placeholder="Thank you for your business! Payment via bank transfer or card." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Include late fee warning</p>
            <p className="text-xs text-gray-400">Mention a 1.5%/month late fee on overdue invoices</p>
          </div>
          <button type="button" onClick={() => update({ lateFee: !data.lateFee })} className={`w-11 h-6 rounded-full transition-colors ${data.lateFee ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.lateFee ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    ),
  },
  {
    title: "Follow-up reminders",
    render: (data, update) => {
      const reminders = (data.reminders as string[]) ?? ["On due date", "7 days overdue"];
      return (
        <div className="space-y-4">
          <p className="text-sm text-gray-500">MojuBilling sends automatic payment reminders at these intervals. Select all that apply.</p>
          <div className="space-y-2">
            {REMINDER_TIMING.map((t) => {
              const active = reminders.includes(t);
              return (
                <button key={t} type="button" onClick={() => update({ reminders: active ? reminders.filter((x) => x !== t) : [...reminders, t] })} className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${active ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                  <span className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${active ? "bg-white border-white" : "border-gray-400"}`}>
                    {active && <span className="text-black text-xs">✓</span>}
                  </span>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      );
    },
  },
  {
    title: "Connect payment processor",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-500">Connect a payment processor so customers can pay invoices instantly via a link.</p>
        <div className="space-y-3">
          {["Stripe", "Square", "PayPal"].map((processor) => (
            <button key={processor} type="button" onClick={() => update({ paymentProcessor: processor })} className={`w-full flex items-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${data.paymentProcessor === processor ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
              {data.paymentProcessor === processor ? "✓" : "○"} Connect {processor}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-500">Payment processor OAuth launches with your subscription. MojuBilling never stores card data directly.</div>
      </div>
    ),
  },
];

export default function MojuBillingPage() {
  const [config, setConfig] = useState<BotConfig | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [reconfiguring, setReconfiguring] = useState(false);

  useEffect(() => { setConfig(getBotConfig("billing")); setLoaded(true); }, []);

  const handleComplete = (data: Record<string, unknown>) => {
    saveBotConfig("billing", data);
    setConfig(getBotConfig("billing")!);
    setReconfiguring(false);
  };

  if (!loaded) return null;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">💰 MojuBilling</h1>
          <p className="text-gray-500 mt-1">Billing bot — sends invoices, chases payments, tracks what&apos;s overdue.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Currency</span><span className="text-gray-900 font-medium">{config.currency as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Payment terms</span><span className="text-gray-900 font-medium">{config.paymentTerms as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Payment processor</span><span className="text-gray-900 font-medium">{config.paymentProcessor as string ?? "Not connected"}</span></div>
              <div className="col-span-2"><span className="text-gray-400 block mb-0.5">Reminders</span><span className="text-gray-900 font-medium">{((config.reminders as string[]) ?? []).join(", ") || "—"}</span></div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setReconfiguring(true)} className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Reconfigure</button>
            <button onClick={() => { clearBotConfig("billing"); setConfig(null); }} className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors">Deactivate</button>
          </div>
        </div>
      ) : (
        <OnboardingWizard steps={STEPS} onComplete={handleComplete} initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}} />
      )}
    </div>
  );
}
