import Link from "next/link";

const PLANS = [
  {
    name: "Solo",
    price: 79,
    bots: 1,
    desc: "Start with one AI worker. Pick whichever role your business needs most.",
    features: ["1 bot of your choice", "Unlimited conversations", "Email support", "Basic analytics"],
  },
  {
    name: "Pro",
    price: 299,
    bots: 5,
    desc: "Most popular. Build a capable crew with 5 AI workers.",
    features: ["5 bots of your choice", "Unlimited conversations", "Priority support", "Full analytics", "CRM integrations", "SMS & email follow-ups"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: 599,
    bots: 11,
    desc: "The complete AI workforce. All 11 bots, fully deployed.",
    features: ["All 11 bots", "Unlimited conversations", "Priority support", "Full analytics", "All integrations", "Dedicated onboarding"],
  },
  {
    name: "Agency",
    price: 999,
    bots: 11,
    desc: "Resell MojuCrew under your own brand to your clients.",
    features: ["All 11 bots", "White-label dashboard", "Custom branding", "Client management portal", "Reseller support", "Revenue share program"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)" }}>
      <nav className="px-8 py-5 flex items-center justify-between border-b border-white/10">
        <Link href="/" className="text-xl font-bold text-white">
          <span style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Moju</span>
          <span>Crew</span>
        </Link>
        <Link href="/sign-in" className="text-sm text-gray-400 hover:text-white">Sign in</Link>
      </nav>

      <section className="px-6 py-20 text-center max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-400 text-lg mb-16">Hire one crew member or your full team. Cancel anytime.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="rounded-xl p-7 text-left border transition-colors"
              style={{
                background: plan.highlight ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.04)",
                borderColor: plan.highlight ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)",
              }}
            >
              {plan.highlight && (
                <div className="text-xs font-bold text-white px-3 py-1 rounded-full inline-block mb-4" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>
                  Most popular
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-1">{plan.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{plan.desc}</p>
              <div className="text-4xl font-bold text-white mb-1">
                ${plan.price}<span className="text-base font-normal text-gray-400">/mo</span>
              </div>
              <p className="text-sm text-gray-500 mb-6">{plan.bots} AI bot{plan.bots > 1 ? "s" : ""}</p>

              <Link
                href="/sign-up"
                className="block text-center py-2.5 rounded-full text-sm font-semibold mb-6 transition-all hover:opacity-90"
                style={plan.highlight
                  ? { background: "linear-gradient(90deg,#a855f7,#ec4899)", color: "#fff" }
                  : { border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }
                }
              >
                Get started
              </Link>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
