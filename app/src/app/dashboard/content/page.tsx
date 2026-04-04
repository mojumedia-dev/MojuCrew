"use client";

import OnboardingWizard, { WizardStep } from "@/components/OnboardingWizard";
import { useBotConfig } from "@/hooks/useBotConfig";

const TONES = ["Educational", "Entertaining", "Inspirational", "Promotional", "Behind-the-scenes"];
const PLATFORMS = ["Instagram", "Facebook", "LinkedIn", "X (Twitter)", "TikTok"];
const FREQUENCIES = ["1x per week", "2x per week", "3x per week", "Daily", "Weekdays only"];

const STEPS: WizardStep[] = [
  {
    title: "Brand info",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business name</label>
          <input type="text" value={(data.businessName as string) ?? ""} onChange={(e) => update({ businessName: e.target.value })} placeholder="Acme Coffee Co." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">What do you sell / offer?</label>
          <textarea value={(data.offering as string) ?? ""} onChange={(e) => update({ offering: e.target.value })} rows={2} placeholder="Specialty coffee, pastries, and a cozy workspace in downtown Miami." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target audience</label>
          <input type="text" value={(data.audience as string) ?? ""} onChange={(e) => update({ audience: e.target.value })} placeholder="Local professionals, remote workers, coffee enthusiasts" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
    ),
  },
  {
    title: "Content style",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content tone (pick all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => {
              const selected = ((data.tones as string[]) ?? []).includes(t);
              return (
                <button key={t} type="button" onClick={() => {
                  const current = (data.tones as string[]) ?? [];
                  update({ tones: selected ? current.filter((x) => x !== t) : [...current, t] });
                }} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${selected ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{t}</button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand hashtags (optional)</label>
          <input type="text" value={(data.hashtags as string) ?? ""} onChange={(e) => update({ hashtags: e.target.value })} placeholder="#acmecoffee #miamimornings" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Anything to avoid in posts?</label>
          <input type="text" value={(data.avoidTopics as string) ?? ""} onChange={(e) => update({ avoidTopics: e.target.value })} placeholder="Politics, competitor mentions, etc." className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black" />
        </div>
      </div>
    ),
  },
  {
    title: "Platforms & schedule",
    render: (data, update) => (
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Post to these platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const active = ((data.platforms as string[]) ?? []).includes(p);
              return (
                <button key={p} type="button" onClick={() => {
                  const current = (data.platforms as string[]) ?? [];
                  update({ platforms: active ? current.filter((x) => x !== p) : [...current, p] });
                }} className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${active ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{p}</button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Posting frequency</label>
          <div className="space-y-2">
            {FREQUENCIES.map((f) => (
              <button key={f} type="button" onClick={() => update({ frequency: f })} className={`w-full py-2.5 px-4 rounded-lg border text-sm font-medium text-left transition-colors ${data.frequency === f ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>{f}</button>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Connect accounts",
    render: (data, update) => (
      <div className="space-y-5">
        <p className="text-sm text-gray-500">Connect your social accounts so MojuContent can post on your behalf. You can approve posts before they go live.</p>
        <div className="space-y-3">
          {(data.platforms as string[] ?? ["Instagram", "Facebook"]).map((platform) => (
            <button key={platform} type="button" onClick={() => {
              const connected = (data.connectedPlatforms as string[]) ?? [];
              const isOn = connected.includes(platform);
              update({ connectedPlatforms: isOn ? connected.filter((x) => x !== platform) : [...connected, platform] });
            }} className={`w-full flex items-center gap-3 py-3 px-5 rounded-lg border text-sm font-medium transition-colors ${((data.connectedPlatforms as string[]) ?? []).includes(platform) ? "bg-green-50 border-green-200 text-green-700" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
              {((data.connectedPlatforms as string[]) ?? []).includes(platform) ? "✓" : "○"} Connect {platform}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between py-3 border border-gray-100 rounded-lg px-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Require approval before posting</p>
            <p className="text-xs text-gray-400">Review each post before MojuContent publishes it</p>
          </div>
          <button type="button" onClick={() => update({ requireApproval: !data.requireApproval })} className={`w-11 h-6 rounded-full transition-colors ${data.requireApproval ? "bg-black" : "bg-gray-200"}`}>
            <span className={`block w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${data.requireApproval ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </div>
    ),
  },
];

export default function MojuContentPage() {
  const { config, loaded, reconfiguring, setReconfiguring, save, clear } = useBotConfig("content");

  if (!loaded) return <div className="text-sm text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📣 MojuContent</h1>
          <p className="text-gray-500 mt-1">Social & content bot — drafts posts and keeps your brand active online.</p>
        </div>
        {config && !reconfiguring && <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">Active</span>}
      </div>

      {config && !reconfiguring ? (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Configuration</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400 block mb-0.5">Business</span><span className="text-gray-900 font-medium">{config.businessName as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Frequency</span><span className="text-gray-900 font-medium">{config.frequency as string ?? "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Platforms</span><span className="text-gray-900 font-medium">{((config.platforms as string[]) ?? []).join(", ") || "—"}</span></div>
              <div><span className="text-gray-400 block mb-0.5">Approval required</span><span className="text-gray-900 font-medium">{config.requireApproval ? "Yes" : "No"}</span></div>
              <div className="col-span-2"><span className="text-gray-400 block mb-0.5">Tones</span><span className="text-gray-900 font-medium">{((config.tones as string[]) ?? []).join(", ") || "—"}</span></div>
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
