import Link from "next/link";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const BOTS = [
  { name: "MojuChat", icon: "💬", desc: "AI receptionist — answers questions, books appointments, qualifies leads 24/7" },
  { name: "MojuCRM", icon: "📋", desc: "CRM manager — logs interactions, follows up leads, manages your pipeline" },
  { name: "MojuReviews", icon: "⭐", desc: "Review manager — monitors & responds to Google/Yelp reviews automatically" },
  { name: "MojuResearch", icon: "🔍", desc: "Market researcher — tracks competitors and delivers weekly insights" },
  { name: "MojuContent", icon: "📣", desc: "Social & content bot — drafts posts and keeps your brand active online" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">MojuCrew</span>
        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link href="/sign-up" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Get started</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">Dashboard</Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Your AI crew,<br />ready to work.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Give your small business a full team of AI workers. Chat, CRM, reviews, research — all under one dashboard. Feels like hiring. Priced like a subscription.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/sign-up" className="bg-black text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-gray-800">
            Hire your crew
          </Link>
          <Link href="/pricing" className="text-gray-600 px-8 py-3 rounded-lg text-lg border hover:border-gray-400">
            See pricing
          </Link>
        </div>
      </section>

      {/* Bots */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet your crew</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BOTS.map((bot) => (
              <div key={bot.name} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-3xl mb-3">{bot.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{bot.name}</h3>
                <p className="text-sm text-gray-500">{bot.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple pricing</h2>
        <p className="text-gray-500 mb-8">Start with one bot at $79/mo. Scale up to your full crew for $349/mo.</p>
        <Link href="/pricing" className="text-black font-medium underline underline-offset-4">View all plans</Link>
      </section>
    </main>
  );
}
