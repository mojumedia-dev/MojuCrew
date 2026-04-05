"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

const BOTS = [
  { name: "MojuChat", icon: "💬", desc: "AI receptionist — answers questions, books appointments, qualifies leads 24/7" },
  { name: "MojuCRM", icon: "📋", desc: "CRM manager — logs interactions, follows up leads, manages your pipeline" },
  { name: "MojuReviews", icon: "⭐", desc: "Review manager — monitors & responds to Google/Yelp reviews automatically" },
  { name: "MojuResearch", icon: "🔍", desc: "Market researcher — tracks competitors and delivers weekly insights" },
  { name: "MojuContent", icon: "📣", desc: "Social & content bot — drafts posts and keeps your brand active online" },
  { name: "MojuBooking", icon: "📅", desc: "Booking bot — handles appointment scheduling end-to-end, 24/7" },
  { name: "MojuBilling", icon: "💰", desc: "Billing bot — sends invoices, chases payments, tracks what's overdue" },
  { name: "MojuLeads", icon: "🎯", desc: "Lead nurture bot — drips follow-up sequences on cold leads automatically" },
  { name: "MojuUpsell", icon: "📈", desc: "Upsell bot — identifies past customers and pitches relevant offers" },
  { name: "MojuSupport", icon: "🎧", desc: "Support bot — handles common after-sale questions and escalates when needed" },
  { name: "MojuEmail", icon: "✉️", desc: "Email bot — writes and schedules newsletters and campaign sequences" },
];

export default function HomePage() {
  const { isSignedIn } = useAuth();

  return (
    <main className="min-h-screen" style={{ background: "linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)" }}>
      {/* Nav */}
      <nav className="px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold text-white shrink-0">
          <span style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Moju</span>
          <span className="text-white">Crew</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-6">
          <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors hidden sm:block">Pricing</Link>
          {isSignedIn ? (
            <Link href="/dashboard" className="text-sm text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-300 hover:text-white transition-colors">Sign in</Link>
              <Link href="/sign-up" className="text-sm text-white px-4 py-2 rounded-full font-medium transition-all hover:opacity-90 whitespace-nowrap" style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-32 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
          Your{" "}
          <span style={{ background: "linear-gradient(90deg, #a855f7, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Crew,</span>
          <br />Ready to Work.
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Give your small business a full team of AI workers. Chat, CRM, reviews, research — all under one dashboard. Feels like hiring. Priced like a subscription.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-up"}
            className="text-white px-8 py-3 rounded-full text-base font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}
          >
            {isSignedIn ? "Go to dashboard" : "Hire your crew"}
          </Link>
          <Link
            href="/pricing"
            className="text-white px-8 py-3 rounded-full text-base font-medium border border-white/20 hover:bg-white/10 transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>

      {/* Bots */}
      <section className="px-6 py-20" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Meet your crew</h2>
          <p className="text-center text-gray-400 mb-12">11 AI workers. One dashboard. Zero overhead.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {BOTS.map((bot) => (
              <div key={bot.name} className="rounded-xl p-6 border border-white/10 hover:border-purple-500/40 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                <div className="text-3xl mb-3">{bot.icon}</div>
                <h3 className="text-base font-semibold text-white mb-2">{bot.name}</h3>
                <p className="text-sm text-gray-400">{bot.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Simple pricing</h2>
          <p className="text-center text-gray-400 mb-12">Hire one crew member or your full team. Cancel anytime.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Solo", price: 79, bots: 1, desc: "Start with one AI worker of your choice." },
              { name: "Pro", price: 299, bots: 5, desc: "Build a capable crew with 5 AI workers.", highlight: true },
              { name: "Enterprise", price: 599, bots: 11, desc: "All 11 bots, fully deployed." },
              { name: "Agency", price: 999, bots: 11, desc: "White-label for your clients.", agency: true },
            ].map((plan) => (
              <div
                key={plan.name}
                className="rounded-xl p-6 border text-left"
                style={{
                  background: plan.highlight ? "rgba(168,85,247,0.12)" : "rgba(255,255,255,0.04)",
                  borderColor: plan.highlight ? "rgba(168,85,247,0.5)" : "rgba(255,255,255,0.08)",
                }}
              >
                {plan.highlight && (
                  <div className="text-xs font-bold text-white px-3 py-1 rounded-full inline-block mb-3" style={{ background: "linear-gradient(90deg,#a855f7,#ec4899)" }}>Most popular</div>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 text-xs mb-3">{plan.desc}</p>
                <div className="text-3xl font-bold text-white mb-1">${plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                <p className="text-xs text-gray-500 mb-5">{plan.bots} AI bot{plan.bots > 1 ? "s" : ""}</p>
                <Link
                  href={isSignedIn ? "/dashboard" : "/sign-up"}
                  className="block text-center py-2 rounded-full text-sm font-semibold transition-all hover:opacity-90"
                  style={plan.highlight
                    ? { background: "linear-gradient(90deg,#a855f7,#ec4899)", color: "#fff" }
                    : { border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }
                  }
                >
                  {isSignedIn ? "Go to dashboard" : "Get started"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
