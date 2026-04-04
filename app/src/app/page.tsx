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
      <nav className="px-8 py-5 flex items-center justify-between">
        <span className="text-xl font-bold text-white">
          <span style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Moju</span>
          <span className="text-white">Crew</span>
        </span>
        <div className="flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-gray-300 hover:text-white transition-colors">Pricing</Link>
          {isSignedIn ? (
            <Link href="/dashboard" className="text-sm text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Dashboard</Link>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm text-gray-300 hover:text-white transition-colors">Sign in</Link>
              <Link href="/sign-up" className="text-sm text-white px-5 py-2 rounded-full font-medium transition-all hover:opacity-90" style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}>Get started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-24 pb-32 text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
          Your{" "}
          <span style={{ background: "linear-gradient(90deg, #a855f7, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI Crew,</span>
          <br />Ready to Work.
        </h1>
        <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          Give your small business a full team of AI workers. Chat, CRM, reviews, research — all under one dashboard. Feels like hiring. Priced like a subscription.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/sign-up"
            className="text-white px-8 py-3 rounded-full text-base font-medium transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(90deg, #a855f7, #ec4899)" }}
          >
            Hire your crew
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
          <p className="text-center text-gray-400 mb-12">Five AI workers. One dashboard. Zero overhead.</p>
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

      {/* Pricing teaser */}
      <section className="px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Simple pricing</h2>
        <p className="text-gray-400 mb-8">Start with one bot at $79/mo. Scale to all 11 for $599/mo. Agency white-label at $999/mo.</p>
        <Link
          href="/pricing"
          className="inline-block text-white px-8 py-3 rounded-full text-base font-medium border border-white/20 hover:bg-white/10 transition-colors"
        >
          View all plans
        </Link>
      </section>
    </main>
  );
}
