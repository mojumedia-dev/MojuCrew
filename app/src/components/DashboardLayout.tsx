"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "🏠" },
  { href: "/dashboard/chat", label: "MojuChat", icon: "💬" },
  { href: "/dashboard/crm", label: "MojuCRM", icon: "📋" },
  { href: "/dashboard/reviews", label: "MojuReviews", icon: "⭐" },
  { href: "/dashboard/research", label: "MojuResearch", icon: "🔍" },
  { href: "/dashboard/content", label: "MojuContent", icon: "📣" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r flex flex-col">
        <div className="px-4 py-5 border-b">
          <span className="text-lg font-bold text-gray-900">MojuCrew</span>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-4 border-t flex items-center gap-3">
          <UserButton />
          <span className="text-sm text-gray-500">Account</span>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
