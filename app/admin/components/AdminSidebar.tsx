"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  ExternalLink,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const sections = [
  {
    label: "OVERVIEW",
    links: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    links: [
      {
        name: "Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        name: "Courses",
        href: "/admin/courses",
        icon: BookOpen,
      },
    ],
  },
  {
    label: "INSIGHTS",
    links: [
      {
        name: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        name: "Activity",
        href: "/admin/activity",
        icon: Activity,
      },
    ],
  },
  {
    label: "SYSTEM",
    links: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Brand */}
      <div className="flex h-16 items-center border-b border-slate-200 px-5">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white">
            W
          </div>

          <div className="leading-tight">
            <div className="text-[14px] font-semibold tracking-tight text-slate-950">
              WebAIgen
            </div>

            <div className="text-[11px] font-medium text-slate-500">
              Academy Admin
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.12em] text-slate-400">
                {section.label}
              </p>

              <div className="space-y-1">
                {section.links.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={[
                        "flex h-10 items-center gap-3 rounded-lg px-3 text-[14px] font-medium transition-colors",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                      ].join(" ")}
                    >
                      <Icon
                        className="h-[18px] w-[18px]"
                        strokeWidth={1.8}
                      />

                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-200 p-3">
        <Link
          href="/learn"
          className="mb-2 flex h-10 items-center justify-between rounded-lg px-3 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
        >
          <span>View Academy</span>
          <ExternalLink className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-3 rounded-lg px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            BT
          </div>

          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-slate-900">
              Administrator
            </p>
            <p className="truncate text-[11px] text-slate-500">
              WebAIgen Academy
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}