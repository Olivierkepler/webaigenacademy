import {
  ArrowUpRight,
  CalendarPlus,
  ShieldCheck,
  UserCheck,
  Users,
} from "lucide-react";

import {
  getAdminUserDirectoryStats,
  getAdminUsers,
} from "@/lib/adminStats";

import { resolveUserRole } from "@/lib/admin";

import UsersTable, { type AdminDirectoryUser } from "./UsersTable";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const [users, stats] = await Promise.all([
    getAdminUsers(),
    getAdminUserDirectoryStats(),
  ]);

  /*
   * Roles are resolved on the server.
   *
   * ADMIN_EMAILS stays server-side and is never exposed to
   * the browser.
   */
  const directoryUsers: AdminDirectoryUser[] = users.map((user) => ({
    ...user,
    role: resolveUserRole(user.email),
  }));

  const administratorCount = directoryUsers.filter(
    (user) => user.role === "admin",
  ).length;

  const statCards = [
    {
      label: "Total users",
      value: stats.totalUsers.toLocaleString(),
      description: "Registered Academy accounts",
      icon: Users,
    },
    {
      label: "Active learners",
      value: stats.activeLearnersLast30Days.toLocaleString(),
      description: "Completed learning activity in the last 30 days",
      icon: UserCheck,
    },
    {
      label: "New this month",
      value: stats.newUsersThisMonth.toLocaleString(),
      description: "Accounts registered this month",
      icon: CalendarPlus,
    },
    {
      label: "Administrators",
      value: administratorCount.toLocaleString(),
      description: "Users with admin access",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="min-w-0">
      {/* Page heading */}
      <section className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[12px] font-medium text-slate-500">
                User management
              </span>
            </div>

            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-slate-950">
              Users
            </h1>

            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              Manage learner accounts, enrollment and learning progress.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[12px] text-slate-400">
            <span>Live Academy data</span>

            <button
              type="button"
              disabled
              title="User export will be added later"
              className="inline-flex h-9 cursor-not-allowed items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 font-medium text-slate-400"
            >
              Export users
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="relative min-h-[126px] px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* User directory */}
      <UsersTable users={directoryUsers} />

      {/* Footer */}
      <section className="mt-5 flex flex-col gap-2 border-t border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-slate-700">
              User directory
            </p>

            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[9px] font-medium text-emerald-700">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            {stats.totalUsers.toLocaleString()} registered{" "}
            {stats.totalUsers === 1 ? "user" : "users"} ·{" "}
            {stats.activeLearnersLast30Days.toLocaleString()} active in the
            last 30 days ·{" "}
            {stats.newUsersThisMonth.toLocaleString()} new this month ·{" "}
            {administratorCount.toLocaleString()}{" "}
            {administratorCount === 1 ? "administrator" : "administrators"}
          </p>
        </div>

        <p className="text-[11px] text-slate-400">
          Connected to Academy user and lesson progress data.
        </p>
      </section>
    </main>
  );
}