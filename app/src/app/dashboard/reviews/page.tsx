"use client";

import { useEffect, useState } from "react";
import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const TONES = ["Polite & professional", "Warm & personal", "Brief & direct"];
const TRIGGERS = [
  "After a completed booking",
  "After a purchase",
  "After a support ticket closes",
  "Manually (I'll trigger it myself)",
];

const STEPS: WizardStep[] = [
  {
    title: "Business info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Business name</label>
          <input
            type="text"
            value={(data.businessName as string) ?? ""}
            onChange={(e) => update({ businessName: e.target.value })}
            placeholder="Acme Coffee Co."
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Google Business locations</label>
          {((data.locations as Array<{name: string; url: string}>) ?? []).map((loc, i) => {
            const locations = (data.locations as Array<{name: string; url: string}>) ?? [];
            return (
              <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2 mb-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">Location {i + 1}</span>
                  {locations.length > 1 && (
                    <button type="button" onClick={() => update({ locations: locations.filter((_, j) => j !== i) })} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
                  )}
                </div>
                <input type="text" value={loc.name} onChange={(e) => { const next = [...locations]; next[i] = { ...next[i], name: e.target.value }; update({ locations: next }); }} placeholder="Regal Homes - Midvale" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
                <input type="url" value={loc.url} onChange={(e) => { const next = [...locations]; next[i] = { ...next[i], url: e.target.value }; update({ locations: next }); }} placeholder="https://maps.google.com/maps?cid=..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900" />
              </div>
            );
          })}
          <button type="button" onClick={() => { const locations = (data.locations as Array<{name: string; url: string}>) ?? []; update({ locations: [...locations, { name: "", url: "" }] }); }} className="w-full py-2.5 border border-dashed border-gray-300 rounded-lg text-sm text-gray-600 hover:border-gray-500 transition-colors">+ Add location</button>
          <p className="text-xs text-gray-600 mt-1">Find the URL in Google Maps → Share → Copy link</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Monitor these platforms</label>
          <div className="flex gap-3">
            {["Google", "Yelp"].map((p) => {
              const platforms = (data.platforms as string[]) ?? [];
              const active = platforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() =>
                    update({ platforms: active ? platforms.filter((x) => x !== p) : [...platforms, p] })
                  }
                  className={`px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    active ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Response style",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Response tone</label>
          <div className="space-y-2">
            {TONES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update({ tone: t })}
                className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${
                  data.tone === t
                    ? "bg-black text-white border-black"
                    : "border-gray-300 text-gray-800 hover:border-gray-500"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Alert email for negative reviews
          </label>
          <input
            type="email"
            value={(data.alertEmail as string) ?? ""}
            onChange={(e) => update({ alertEmail: e.target.value })}
            placeholder="you@yourbusiness.com"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black text-gray-900"
          />
          <p className="text-xs text-gray-600 mt-1">You'll get notified instantly for any 1–2 star reviews.</p>
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-800">Auto-respond to all reviews</p>
            <p className="text-xs text-gray-600">MojuReviews drafts and posts replies automatically</p>
          </div>
          <button
            type="button"
            onClick={() => update({ autoRespond: !data.autoRespond })}
            className={`w-11 h-6 rounded-full transition-colors ${data.autoRespond ? "bg-black" : "bg-gray-200"}`}
          >
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.autoRespond ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    ),
  },
  {
    title: "Review requests",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">Request message</label>
          <textarea
            value={(data.requestMessage as string) ?? ""}
            onChange={(e) => update({ requestMessage: e.target.value })}
            rows={4}
            placeholder="Hi [Name], thanks for visiting us! If you enjoyed your experience, we'd love a quick review — it really helps our small business. [Google Link]"
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none text-gray-900"
          />
          <p className="text-xs text-gray-600 mt-1">Use [Name] and [Google Link] as placeholders.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">Send request after... (select all that apply)</label>
          <div className="space-y-2">
            {TRIGGERS.map((t) => {
              const selected = ((data.requestTriggers as string[]) ?? []).includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    const current = (data.requestTriggers as string[]) ?? [];
                    update({ requestTriggers: selected ? current.filter((x) => x !== t) : [...current, t] });
                  }}
                  className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${
                    selected ? "bg-black text-white border-black" : "border-gray-300 text-gray-800 hover:border-gray-500"
                  }`}
                >
                  <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${selected ? "bg-white border-white" : "border-gray-400"}`}>
                    {selected && <span className="text-black text-xs">✓</span>}
                  </span>
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Connect Google",
    render: (data) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-700">
          Connect your Google Business Profile so MojuReviews can read and respond to reviews on your behalf.
        </p>
        {data.googleConnected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-700 flex items-center gap-2">
            <span>✓</span> Google Business connected — MojuReviews will monitor all your locations.
          </div>
        ) : (
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-lg border border-gray-300 text-sm font-medium text-gray-800 hover:border-gray-500 transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google Business
          </a>
        )}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-4 text-xs text-gray-600">
          We only request permission to read and reply to your Google Business reviews. We never access Gmail or other Google services.
        </div>
      </div>
    ),
  },
];

export default function MojuReviewsPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("reviews");
  const [googleConnected, setGoogleConnected] = useState(false);

  // Handle OAuth callback — ?connected=true means Google auth succeeded
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected") === "true" && config && !config.googleConnected) {
      save({ ...config, googleConnected: true });
      setGoogleConnected(true);
    }
    if (config?.googleConnected) setGoogleConnected(true);
  }, [config]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">⭐ MojuReviews</h1>
          <p className="text-gray-500 mt-1">Monitor and respond to Google & Yelp reviews automatically.</p>
        </div>
        {config && !reconfiguring && (
          <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>
        )}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500 block mb-0.5">Business</span>
                <span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Platforms</span>
                <span className="text-gray-900 font-medium">
                  {((config.platforms as string[]) ?? []).join(", ") || "—"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Tone</span>
                <span className="text-gray-900 font-medium">{config.tone as string ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Auto-respond</span>
                <span className="text-gray-900 font-medium">{config.autoRespond ? "On" : "Off"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Alert email</span>
                <span className="text-gray-900 font-medium">{config.alertEmail as string ?? "—"}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">Review request triggers</span>
                <span className="text-gray-900 font-medium">{((config.requestTriggers as string[]) ?? []).join(", ") || "—"}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setReconfiguring(true)}
              className="px-5 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reconfigure
            </button>
            <button
              onClick={() => void clear()}
              className="px-5 py-2 text-sm text-red-500 border border-red-100 rounded-lg hover:bg-red-50 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </div>
      ) : (
        <OnboardingWizard
          steps={STEPS}
          onComplete={save}
          initialData={reconfiguring && config ? (config as Record<string, unknown>) : {}}
        />
      )}
    </div>
  );
}
