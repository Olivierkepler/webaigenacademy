import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowUpRight,
  Bell,
  Search,
  ShieldCheck,
} from "lucide-react";

import { auth } from "@/auth";
import { isAdminRole } from "@/lib/admin";
import AdminNav from "./components/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;

  try {
    session = await auth();
  } catch {
    session = null;
  }

  // ---------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------

  if (!session?.user) {
    redirect("/signin");
  }

  // ---------------------------------------------------------------------------
  // Authorization
  // ---------------------------------------------------------------------------

  if (!isAdminRole(session.user.role)) {
    return (
      <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
            <ShieldCheck
              className="h-5 w-5 text-zinc-500 dark:text-zinc-400"
              strokeWidth={1.8}
            />
          </div>

          <h1 className="mt-5 text-[20px] font-semibold tracking-[-0.02em] text-zinc-950 dark:text-white">
            Admin access required
          </h1>

          <p className="mt-2 text-[13px] leading-5 text-zinc-500 dark:text-zinc-400">
            Your account does not have permission to access the WebAIgen
            Academy administration area.
          </p>

          <Link
            href="/dashboard"
            className="mt-6 inline-flex h-9 items-center justify-center rounded-lg bg-[#0E5C58] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#0A4946]"
          >
            Back to Academy
          </Link>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Admin identity
  // ---------------------------------------------------------------------------

  const userName = session.user.name || "Administrator";
  const userEmail = session.user.email || "";

  const initials =
    userName
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";

  return (
    <div className="min-h-[calc(100vh-var(--navbar-height))] bg-[#F7F8FA] font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="flex min-h-[calc(100vh-var(--navbar-height))]">
        {/* ================================================================= */}
        {/* ADMIN SIDEBAR                                                     */}
        {/* ================================================================= */}

        <aside className="sticky top-[var(--navbar-height)] hidden h-[calc(100vh-var(--navbar-height))] w-[232px] shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:flex lg:flex-col">
          {/* Brand */}
          <div className="flex h-[68px] shrink-0 items-center border-b border-zinc-100 px-5 dark:border-zinc-800">
            <Link
              href="/admin"
              className="flex min-w-0 items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#0E5C58] text-[11px] font-semibold tracking-tight text-white">
                WA
              </div>

              <div className="min-w-0 leading-tight">
                <p className="truncate text-[13px] font-semibold tracking-[-0.01em] text-zinc-950 dark:text-white">
                  WebAIgen Academy
                </p>

                <p className="mt-1 text-[10px] font-medium tracking-[0.02em] text-zinc-400">
                  ADMINISTRATION
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-5">
            <AdminNav />
          </div>

          {/* Academy link */}
          <div className="px-3 pb-2">
            <Link
              href="/learn"
              className="group flex h-10 items-center justify-between rounded-lg px-3 text-[12px] font-medium text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-[#0E5C58] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-[#85D7CE]"
            >
              <span>View Academy</span>

              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>
          </div>

          {/* Administrator */}
          <div className="border-t border-zinc-100 p-3 dark:border-zinc-800">
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0E5C58] text-[10px] font-semibold text-white">
                {initials}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-zinc-800 dark:text-zinc-200">
                  {userName}
                </p>

                <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                  {userEmail || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* ================================================================= */}
        {/* MAIN ADMIN APPLICATION                                            */}
        {/* ================================================================= */}

        <div className="min-w-0 flex-1">
          {/* --------------------------------------------------------------- */}
          {/* Desktop admin toolbar                                           */}
          {/* --------------------------------------------------------------- */}

          <header className="sticky top-[var(--navbar-height)] z-30 hidden h-[68px] items-center border-b border-zinc-200 bg-white/95 px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 lg:flex lg:px-8">
            <div className="flex w-full items-center justify-between gap-6">
              {/* Search */}
              <div className="relative w-full max-w-[420px]">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                  strokeWidth={1.8}
                />

                <input
                  type="search"
                  placeholder="Search users, courses..."
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-zinc-50/70 pl-9 pr-3 text-[12px] text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[#0E5C58] focus:bg-white focus:ring-2 focus:ring-[#0E5C58]/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:border-[#85D7CE] dark:focus:bg-zinc-900"
                />
              </div>

              {/* Right actions */}
              <div className="flex shrink-0 items-center gap-2">
                <div className="hidden items-center gap-2 xl:flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                  <span className="text-[11px] font-medium text-zinc-400">
                    Academy operational
                  </span>
                </div>

                <div className="mx-2 hidden h-5 w-px bg-zinc-200 xl:block dark:bg-zinc-700" />

                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-9 w-9 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  <Bell
                    className="h-[17px] w-[17px]"
                    strokeWidth={1.8}
                  />

                  <span className="absolute right-[9px] top-[8px] h-1.5 w-1.5 rounded-full bg-[#0E5C58] ring-2 ring-white dark:ring-zinc-900" />
                </button>

                <div className="ml-1 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

                <div className="ml-1 flex items-center gap-2.5 rounded-lg px-2 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0E5C58] text-[10px] font-semibold text-white">
                    {initials}
                  </div>

                  <div className="hidden max-w-[150px] xl:block">
                    <p className="truncate text-[11px] font-semibold leading-4 text-zinc-800 dark:text-zinc-200">
                      {userName}
                    </p>

                    <p className="truncate text-[9px] leading-3 text-zinc-400">
                      Administrator
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* --------------------------------------------------------------- */}
          {/* Mobile admin header                                             */}
          {/* --------------------------------------------------------------- */}

          <div className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 lg:hidden">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0E5C58] text-[10px] font-semibold text-white">
                  WA
                </div>

                <div>
                  <p className="text-[12px] font-semibold text-zinc-950 dark:text-white">
                    WebAIgen Academy
                  </p>

                  <p className="mt-0.5 text-[9px] font-medium tracking-[0.04em] text-zinc-400">
                    ADMINISTRATION
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                >
                  <Bell className="h-4 w-4" strokeWidth={1.8} />

                  <span className="absolute right-[7px] top-[6px] h-1.5 w-1.5 rounded-full bg-[#0E5C58]" />
                </button>

                <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0E5C58] text-[9px] font-semibold text-white">
                  {initials}
                </div>
              </div>
            </div>

            {/* Mobile navigation */}
            <div className="overflow-x-auto border-t border-zinc-100 px-4 py-2 dark:border-zinc-800">
              <AdminNav />
            </div>
          </div>

          {/* --------------------------------------------------------------- */}
          {/* Page content                                                    */}
          {/* --------------------------------------------------------------- */}

          <main className="px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
            <div className="mx-auto w-full max-w-[1480px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}