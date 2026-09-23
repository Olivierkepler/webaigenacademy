"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BarChart3,
  BookOpen,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";

const navigation = [
  {
    label: "OVERVIEW",
    items: [
      {
        name: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
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
    items: [
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
    items: [
      {
        name: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
    ],
  },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <nav className="flex gap-2 lg:block lg:space-y-6">
      {navigation.map((section) => (
        <div
          key={section.label}
          className="shrink-0"
        >
          <p className="mb-2 hidden px-3 text-[9px] font-semibold tracking-[0.12em] text-zinc-400 lg:block">
            {section.label}
          </p>

          <div className="flex gap-1 lg:block lg:space-y-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "flex h-9 shrink-0 items-center gap-2.5 rounded-lg px-3 text-[12px] font-medium transition-colors",
                    active
                      ? "bg-[#0E5C58]/10 text-[#0E5C58] dark:bg-[#85D7CE]/10 dark:text-[#85D7CE]"
                      : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
                  ].join(" ")}
                >
                  <Icon
                    className="h-[16px] w-[16px]"
                    strokeWidth={active ? 2 : 1.7}
                  />

                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}