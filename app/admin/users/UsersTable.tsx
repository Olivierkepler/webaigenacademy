"use client";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import type { AdminUserRow } from "@/lib/adminStats";
import type { UserRole } from "@/lib/admin";

export type AdminDirectoryUser = AdminUserRow & {
  role: UserRole;
};

type UsersTableProps = {
  users: AdminDirectoryUser[];
};

const PAGE_SIZE = 10;

function formatJoinedDate(value: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name: string | null, email: string) {
  const source = name?.trim() || email.trim();

  if (!source) return "U";

  return source.charAt(0).toUpperCase();
}

function formatRole(role: UserRole) {
  return role === "admin" ? "Administrator" : "Learner";
}

export default function UsersTable({ users }: UsersTableProps) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all-roles");
  const [status, setStatus] = useState("all-statuses");
  const [page, setPage] = useState(1);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        role === "all-roles" ||
        (role === "admin" && user.role === "admin") ||
        (role === "learner" && user.role === "learner");

      /*
       * There is currently no persisted account-status column.
       * Registered users are therefore displayed as active.
       */
      const matchesStatus =
        status === "all-statuses" || status === "active";

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / PAGE_SIZE),
  );

  const safePage = Math.min(page, totalPages);

  const paginatedUsers = filteredUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleRole(value: string) {
    setRole(value);
    setPage(1);
  }

  function handleStatus(value: string) {
    setStatus(value);
    setPage(1);
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 px-5 py-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-950">
              Academy users
            </h2>

            <p className="mt-1 text-[12px] text-slate-500">
              Learners and administrators registered with WebAIgen Academy.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="search"
                value={search}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Search users..."
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 sm:w-[220px]"
              />
            </div>

            <select
              value={role}
              onChange={(event) => handleRole(event.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none focus:border-teal-600"
            >
              <option value="all-roles">All roles</option>
              <option value="learner">Learners</option>
              <option value="admin">Administrators</option>
            </select>

            <select
              value={status}
              onChange={(event) => handleStatus(event.target.value)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[12px] text-slate-600 outline-none focus:border-teal-600"
            >
              <option value="all-statuses">All statuses</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/60">
              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                User
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Role
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Status
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Progress
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Lessons completed
              </th>

              <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Joined
              </th>

              <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => {
                /*
                 * We have real completion counts but not yet a reliable
                 * per-user enrollment denominator.
                 *
                 * Therefore we do not fabricate a completion percentage.
                 */
                const isLearner =
                  user.role === "learner";

                const hasLearningActivity =
                  isLearner &&
                  user.completions > 0;

                const hasEnrollments =
                  isLearner &&
                  user.enrolledCourses > 0;

                const allCoursesCompleted =
                  hasEnrollments &&
                  user.completedCourses ===
                  user.enrolledCourses;

                const lessonsComplete =
                  hasLearningActivity &&
                  user.totalLessons > 0 &&
                  user.completions >=
                  user.totalLessons;

                const assessmentRemaining =
                  lessonsComplete &&
                  hasEnrollments &&
                  !allCoursesCompleted;

                const progressLabel =
                  allCoursesCompleted
                    ? "Completed"
                    : assessmentRemaining
                      ? "Assessment remaining"
                      : hasLearningActivity
                        ? "In progress"
                        : "No progress";

                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[12px] font-semibold text-slate-600">
                          {getInitials(user.name, user.email)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-slate-900">
                            {user.name || "Unnamed user"}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      {user.role === "admin" ? (
                        <span className="inline-flex rounded-md bg-teal-50 px-2 py-1 text-[11px] font-medium text-teal-700">
                          Administrator
                        </span>
                      ) : (
                        <span className="text-[12px] text-slate-600">
                          {formatRole(user.role)}
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                        <span className="text-[12px] text-slate-600">
                          Active
                        </span>
                      </div>
                    </td>

                    {/* Progress */}
                    <td className="px-5 py-4">
                      {user.role === "admin" ? (
                        <span className="text-[12px] text-slate-400">
                          —
                        </span>
                      ) : (
                        <div className="w-[140px]">
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span
                              className={`text-[11px] font-medium ${allCoursesCompleted
                                ? "text-emerald-700"
                                : assessmentRemaining
                                  ? "text-amber-700"
                                  : hasLearningActivity
                                    ? "text-slate-600"
                                    : "text-slate-500"
                                }`}
                            >
                              {progressLabel}
                            </span>

                            {hasLearningActivity ? (
                              <span className="text-[10px] text-slate-400">
                                {user.progressPercent}%
                              </span>
                            ) : null}
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className="h-full rounded-full bg-teal-700 transition-[width] duration-300"
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    user.progressPercent
                                  )
                                )}%`,
                              }}
                            />
                          </div>

                          {hasEnrollments ? (
                            <p className="mt-1.5 text-[10px] text-slate-400">
                              {user.completedCourses} of{" "}
                              {user.enrolledCourses}{" "}
                              {user.enrolledCourses === 1
                                ? "course"
                                : "courses"}{" "}
                              completed
                            </p>
                          ) : null}
                        </div>
                      )}
                    </td>

                    {/* Completed */}
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-medium text-slate-700">
                        {user.completions}
                      </span>

                      <span className="ml-1 text-[11px] text-slate-400">
                        {user.completions === 1 ? "lesson" : "lessons"}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4 text-[12px] text-slate-500">
                      {formatJoinedDate(user.createdAt)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">
                      <span
                        title="User detail page will be added later"
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-slate-400"
                      >
                        View user
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-5 py-14 text-center">
                  <p className="text-[13px] font-medium text-slate-700">
                    No users found
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] text-slate-400">
          Showing{" "}
          <span className="font-medium text-slate-600">
            {filteredUsers.length}
          </span>{" "}
          {filteredUsers.length === 1 ? "user" : "users"}
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() =>
              setPage((current) => Math.max(1, current - 1))
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-teal-700 px-2 text-[11px] font-semibold text-white">
            {safePage}
          </span>

          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() =>
              setPage((current) =>
                Math.min(totalPages, current + 1),
              )
            }
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[11px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-white"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}