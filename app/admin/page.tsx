import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Users,
  UserRoundCheck,
} from "lucide-react";

import { getAdminOverview } from "@/lib/adminStats";

import LearningActivity from "./components/LearningActivity";
import UserJourney from "./components/UserJourney";

export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/*                                DEMO DATA                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

type MetricCardProps = {
  label: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<{
    className?: string;
    strokeWidth?: number;
  }>;
};

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="group relative px-5 py-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-zinc-500 dark:text-zinc-400">
            {label}
          </p>

          <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-400">
          <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
        </div>
      </div>

      <p className="mt-2 text-[11px] leading-4 text-zinc-400">
        {description}
      </p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               ADMIN OVERVIEW                               */
/* -------------------------------------------------------------------------- */

export default async function AdminOverviewPage() {
  let overview = null;
  let loadError = false;

  try {
    overview = await getAdminOverview();
  } catch (error) {
    console.error("[admin] Failed to load overview:", error);
    loadError = true;
  }

  if (loadError || !overview) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        Could not load admin analytics. Check your database connection and try
        again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------------------------------- */}
      {/* PAGE HEADER                                                          */}
      {/* -------------------------------------------------------------------- */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-[24px] font-semibold tracking-[-0.025em] text-zinc-950 dark:text-white">
            Dashboard
          </h1>

          <p className="mt-1 text-[13px] text-zinc-500 dark:text-zinc-400">
            Learning activity, learner progress and Academy performance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Live Academy data
          </span>

          <Link
            href="/admin/analytics"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-3 text-[12px] font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            View analytics
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* TOP METRICS — LIVE DATABASE DATA                                     */}
      {/* -------------------------------------------------------------------- */}

      <section className="grid overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.02)] sm:grid-cols-2 xl:grid-cols-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 sm:border-r xl:border-b-0 dark:border-zinc-800">
          <MetricCard
            label="Total users"
            value={overview.totalUsers.toLocaleString()}
            description="Registered Academy accounts"
            icon={Users}
          />
        </div>

        <div className="border-b border-zinc-200 xl:border-b-0 xl:border-r dark:border-zinc-800">
          <MetricCard
            label="Active learners"
            value={overview.activeLearnersLast7Days.toLocaleString()}
            description="Learners active in the last 7 days"
            icon={UserRoundCheck}
          />
        </div>

        <div className="border-b border-zinc-200 sm:border-b-0 sm:border-r dark:border-zinc-800">
          <MetricCard
            label="Lesson completions"
            value={overview.totalCompletions.toLocaleString()}
            description="Completed lessons across the Academy"
            icon={CheckCircle2}
          />
        </div>

        <MetricCard
          label="New users"
          value={overview.signupsLast7Days.toLocaleString()}
          description="New registrations in the last 7 days"
          icon={BookOpen}
        />
      </section>

      {/* -------------------------------------------------------------------- */}
      {/* LEARNING ACTIVITY                                                    */}
      {/* -------------------------------------------------------------------- */}

      <LearningActivity
        activity={overview.learningActivity}
        activeLearners={overview.activeLearnersLast30Days}
        averageLearnersPerDay={overview.averageActiveLearnersPerDay}
      />

      {/* -------------------------------------------------------------------- */}
      {/* USER JOURNEY                                                         */}
      {/* -------------------------------------------------------------------- */}

      <UserJourney journey={overview.userJourney} />

      {/* -------------------------------------------------------------------- */}
      {/* LOWER SECTION                                                        */}
      {/* -------------------------------------------------------------------- */}

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        {/* ------------------------------------------------------------------ */}
        {/* LESSON PERFORMANCE                                                 */}
        {/* ------------------------------------------------------------------ */}

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
                  Lesson performance
                </h2>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                Completion rate across Academy lessons.
              </p>
            </div>

            <Link
              href="/admin/analytics"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0E5C58] transition hover:text-[#003334] dark:text-[#85D7CE]"
            >
              View details
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div>
            <div className="grid grid-cols-[1fr_90px_120px] border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/30">
              <span>Lesson</span>
              <span>Completed</span>
              <span>Rate</span>
            </div>

            {overview.lessonCompletionRates.length > 0 ? (
              overview.lessonCompletionRates.slice(0, 6).map((lesson) => (
                <div
                  key={`${lesson.courseSlug}:${lesson.lessonSlug}`}
                  className="grid grid-cols-[1fr_90px_120px] items-center border-b border-zinc-100 px-5 py-3.5 last:border-0 dark:border-zinc-800"
                >
                  <div className="min-w-0 pr-5">
                    <p className="truncate text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                      {lesson.lessonTitle}
                    </p>

                    <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                      {lesson.courseSlug}
                    </p>
                  </div>

                  <span className="text-[12px] text-zinc-600 dark:text-zinc-400">
                    {lesson.completions.toLocaleString()}
                  </span>

                  <div className="flex items-center gap-2.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-[#0E5C58] dark:bg-[#85D7CE]"
                        style={{
                          width: `${lesson.ratePercent}%`,
                        }}
                      />
                    </div>

                    <span className="w-8 text-right text-[11px] font-medium text-zinc-600 dark:text-zinc-300">
                      {lesson.ratePercent}%
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[150px] items-center justify-center px-5">
                <div className="text-center">
                  <p className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300">
                    No lesson completions yet
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-400">
                    Lesson performance will appear when learners complete lessons.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* RECENT USERS — REAL DATABASE DATA                                  */}
        {/* ------------------------------------------------------------------ */}

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
                  Recent users
                </h2>

                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </span>
              </div>

              <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
                Latest Academy registrations.
              </p>
            </div>

            <Link
              href="/admin/users"
              className="text-[12px] font-medium text-[#0E5C58] transition hover:text-[#003334] dark:text-[#85D7CE]"
            >
              View all
            </Link>
          </div>

          {overview.recentSignups.length > 0 ? (
            <div>
              {overview.recentSignups.slice(0, 6).map((user) => {
                const initials = (user.name ?? user.email)
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 border-b border-zinc-100 px-5 py-3.5 last:border-0 dark:border-zinc-800"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {initials}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-medium text-zinc-800 dark:text-zinc-200">
                        {user.name ?? user.email}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-zinc-400">
                        {user.email}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] text-zinc-400">
                        {formatDate(user.createdAt)}
                      </p>

                      <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                        {user.completions} completed
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-[190px] items-center justify-center">
              <p className="text-[12px] text-zinc-400">
                No users yet.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* ACADEMY SNAPSHOT                                                     */}
      {/* -------------------------------------------------------------------- */}

      <section className="flex flex-col justify-between gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300">
              Academy snapshot
            </p>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-[11px] text-zinc-400">
            {overview.totalUsers.toLocaleString()} registered users ·{" "}
            {overview.totalCompletions.toLocaleString()} lesson completions ·{" "}
            {overview.activeLearnersLast7Days.toLocaleString()} active in the last 7 days
          </p>
        </div>

        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0E5C58] transition hover:text-[#003334] dark:text-[#85D7CE]"
        >
          Manage learners
          <span aria-hidden="true">→</span>
        </Link>
      </section>
    </div>
  );
}