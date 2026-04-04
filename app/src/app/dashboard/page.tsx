import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

const BOTS = [
  { href: "/dashboard/chat", name: "MojuChat", icon: "💬", desc: "Live chat receptionist" },
  { href: "/dashboard/crm", name: "MojuCRM", icon: "📋", desc: "CRM & lead follow-up" },
  { href: "/dashboard/reviews", name: "MojuReviews", icon: "⭐", desc: "Review monitoring & responses" },
  { href: "/dashboard/research", name: "MojuResearch", icon: "🔍", desc: "Competitor & market insights" },
  { href: "/dashboard/content", name: "MojuContent", icon: "📣", desc: "Social & content automation" },
  { href: "/dashboard/booking", name: "MojuBooking", icon: "📅", desc: "Appointment scheduling" },
  { href: "/dashboard/billing", name: "MojuBilling", icon: "💰", desc: "Invoices & payment follow-up" },
  { href: "/dashboard/leads", name: "MojuLeads", icon: "🎯", desc: "Lead nurture sequences" },
  { href: "/dashboard/upsell", name: "MojuUpsell", icon: "📈", desc: "Repeat customer offers" },
  { href: "/dashboard/support", name: "MojuSupport", icon: "🎧", desc: "After-sale support & FAQ" },
  { href: "/dashboard/email", name: "MojuEmail", icon: "✉️", desc: "Email campaigns & newsletters" },
];

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
        </h1>
        <p className="text-gray-500 mt-1">Manage your AI crew from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {BOTS.map((bot) => (
          <Link key={bot.href} href={bot.href}>
            <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <span className="text-2xl">{bot.icon}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                  Inactive
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{bot.name}</h3>
              <p className="text-sm text-gray-500">{bot.desc}</p>
              <div className="mt-4 text-sm font-medium text-black">Configure →</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-black text-white rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-2">Ready to activate your crew?</h2>
        <p className="text-gray-300 text-sm mb-4">Choose a plan to unlock your AI workers.</p>
        <Link href="/pricing" className="inline-block bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-100">
          View plans
        </Link>
      </div>
    </div>
  );
}
