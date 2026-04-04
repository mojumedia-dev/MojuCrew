import Link from "next/link";

const PLANS = [
  {
    name: "Starter",
    price: 79,
    bots: 1,
    desc: "Perfect for getting started with one AI worker.",
    features: ["1 bot of your choice", "Unlimited conversations", "Email support", "Basic analytics"],
  },
  {
    name: "Growth",
    price: 199,
    bots: 3,
    desc: "Most popular. Pick your 3 most-needed crew members.",
    features: ["3 bots of your choice", "Unlimited conversations", "Priority support", "Full analytics", "CRM integrations"],
    highlight: true,
  },
  {
    name: "Full Crew",
    price: 349,
    bots: 5,
    desc: "The complete AI workforce. All 5 bots, fully active.",
    features: ["All 5 bots", "Unlimited conversations", "Priority support", "Full analytics", "All integrations", "White-label option"],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-white">
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-gray-900">MojuCrew</Link>
        <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
      </nav>

      <section className="px-6 py-20 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h1>
        <p className="text-gray-500 text-lg mb-16">Hire one crew member or your full team. Cancel anytime.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl border p-8 text-left ${plan.highlight ? "border-black shadow-lg" : "border-gray-100"}`}
            >
              {plan.highlight && (
                <div className="text-xs font-semibold text-black bg-gray-100 px-2 py-1 rounded-full inline-block mb-4">
                  Most popular
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
              <p className="text-gray-500 text-sm mb-4">{plan.desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-1">
                ${plan.price}<span className="text-lg font-normal text-gray-400">/mo</span>
              </div>
              <p className="text-sm text-gray-400 mb-6">{plan.bots} AI bot{plan.bots > 1 ? "s" : ""}</p>

              <Link
                href="/sign-up"
                className={`block text-center py-3 rounded-lg text-sm font-medium mb-6 ${
                  plan.highlight ? "bg-black text-white hover:bg-gray-800" : "border border-gray-200 text-gray-900 hover:border-gray-400"
                }`}
              >
                Get started
              </Link>

              <ul className="space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-green-500">✓</span> {f}
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
