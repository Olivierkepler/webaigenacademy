import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  GraduationCap,
  UserPlus,
  Users,
} from "lucide-react";
import {
  getAdminActivity,
  type AdminActivityEventType,
} from "@/lib/adminStats";

function MetricCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="min-w-0 flex-1 px-5 py-5 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-[27px] font-semibold tracking-[-0.03em] text-slate-950">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
          <Icon size={16} strokeWidth={1.7} />
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-5 text-slate-400">
        {description}
      </p>
    </div>
  );
}

function TypeBadge({
  type,
}: {
  type: AdminActivityEventType;
}) {
  const styles: Record<
    AdminActivityEventType,
    string
  > = {
    Lesson: "bg-emerald-50 text-emerald-700",
    Assessment: "bg-violet-50 text-violet-700",
    Enrollment: "bg-blue-50 text-blue-700",
    Course: "bg-teal-50 text-teal-700",
    Account: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex rounded-md px-2 py-1 text-[10px] font-medium ${styles[type]}`}
    >
      {type}
    </span>
  );
}

function EventIcon({
  type,
}: {
  type: AdminActivityEventType;
}) {
  const icons: Record<
    AdminActivityEventType,
    React.ElementType
  > = {
    Lesson: BookOpen,
    Assessment: ClipboardCheck,
    Enrollment: UserPlus,
    Course: GraduationCap,
    Account: Users,
  };

  const Icon = icons[type];

  return <Icon size={14} strokeWidth={1.7} />;
}

function initialsFor(
  name: string,
  email: string
): string {
  const value = name.trim() || email.trim();

  if (!value) {
    return "?";
  }

  const parts = value
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }

  return value.slice(0, 1).toUpperCase();
}

function formatEventDate(
  value: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatEventTime(
  value: string
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminActivityPage() {
  const activity = await getAdminActivity();

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-7 lg:px-8">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-medium text-slate-500">
                Academy activity
              </span>
            </div>

            <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
              Activity
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Review recorded learner and Academy activity.
            </p>
          </div>

          <div className="inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-600 shadow-sm">
            Last 7 days
          </div>
        </div>

        {/* KPI SUMMARY */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            <MetricCard
              label="Events today"
              value={activity.eventsToday.toLocaleString()}
              description="Recorded Academy events today"
              icon={Activity}
            />

            <MetricCard
              label="Active learners"
              value={activity.activeLearnersToday.toLocaleString()}
              description="Learners with recorded activity today"
              icon={Users}
            />

            <MetricCard
              label="Lesson completions"
              value={activity.lessonCompletionsToday.toLocaleString()}
              description="Lessons completed today"
              icon={BookOpen}
            />

            <MetricCard
              label="Assessments"
              value={activity.assessmentsToday.toLocaleString()}
              description="Assessment attempts completed today"
              icon={ClipboardCheck}
            />
          </div>
        </section>

        {/* ACTIVITY FEED */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between lg:px-6">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-950">
                Activity feed
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Recorded events from the last 7 days.
              </p>
            </div>

            <p className="text-[11px] text-slate-400">
              {activity.eventsLast7Days.toLocaleString()}{" "}
              {activity.eventsLast7Days === 1
                ? "event"
                : "events"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 lg:px-6">
                    User
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Activity
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Type
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 lg:px-6">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {activity.events.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center"
                    >
                      <Activity
                        size={22}
                        className="mx-auto text-slate-300"
                        strokeWidth={1.6}
                      />

                      <p className="mt-3 text-[12px] font-medium text-slate-600">
                        No recorded activity
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        No Academy events were recorded during the last 7 days.
                      </p>
                    </td>
                  </tr>
                )}

                {activity.events.map((event) => (
                  <tr
                    key={event.id}
                    className="transition hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
                          {initialsFor(
                            event.user,
                            event.email
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[12px] font-medium text-slate-800">
                            {event.user}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-slate-400">
                            {event.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400">
                          <EventIcon type={event.type} />
                        </div>

                        <div>
                          <p className="text-[12px] font-medium text-slate-700">
                            {event.action}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <TypeBadge type={event.type} />
                    </td>

                    <td className="px-4 py-4 text-[11px] text-slate-500">
                      {formatEventDate(
                        event.occurredAt
                      )}
                    </td>

                    <td className="px-5 py-4 text-right text-[11px] font-medium text-slate-500 lg:px-6">
                      {formatEventTime(
                        event.occurredAt
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-100 px-5 py-4 lg:px-6">
            <p className="text-[10px] text-slate-400">
              Showing up to 100 recorded events from the last 7 days.
            </p>
          </div>
        </section>

        {/* LOWER SECTION */}
        <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          {/* ACTIVITY BREAKDOWN */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 lg:px-6">
              <div>
                <h2 className="text-[15px] font-semibold text-slate-950">
                  Activity breakdown
                </h2>

                <p className="mt-1 text-[12px] text-slate-500">
                  Distribution of recorded events during the last 7 days.
                </p>
              </div>

              <Activity
                size={18}
                className="text-slate-400"
                strokeWidth={1.7}
              />
            </div>

            <div className="space-y-5 px-5 py-6 lg:px-6">
              {activity.breakdown.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-medium text-slate-700">
                        {item.label}
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        {item.value.toLocaleString()}{" "}
                        {item.value === 1
                          ? "event"
                          : "events"}
                      </p>
                    </div>

                    <span className="text-[12px] font-semibold text-slate-700">
                      {item.percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-700"
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ACTIVITY SUMMARY */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
              <h2 className="text-[15px] font-semibold text-slate-950">
                Activity summary
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Current 7-day Academy activity snapshot.
              </p>
            </div>

            <div className="divide-y divide-slate-100 px-5 lg:px-6">
              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Recorded events
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-700">
                    {activity.eventsLast7Days.toLocaleString()}{" "}
                    {activity.eventsLast7Days === 1
                      ? "event"
                      : "events"}
                  </p>
                </div>

                <Activity
                  size={17}
                  className="text-slate-400"
                  strokeWidth={1.7}
                />
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Most active course
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-700">
                    {activity.mostActiveCourse ??
                      "No course activity"}
                  </p>
                </div>

                <BookOpen
                  size={17}
                  className="text-slate-400"
                  strokeWidth={1.7}
                />
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Most active learner
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-700">
                    {activity.mostActiveLearner ??
                      "No learner activity"}
                  </p>
                </div>

                <Users
                  size={17}
                  className="text-slate-400"
                  strokeWidth={1.7}
                />
              </div>

              <div className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-[11px] text-slate-400">
                    Lesson completions today
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-slate-700">
                    {activity.lessonCompletionsToday.toLocaleString()}{" "}
                    {activity.lessonCompletionsToday === 1
                      ? "completion"
                      : "completions"}
                  </p>
                </div>

                <CheckCircle2
                  size={17}
                  className="text-slate-400"
                  strokeWidth={1.7}
                />
              </div>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-200 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-medium text-slate-600">
              Academy activity
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Live data from recorded Academy learning events.
            </p>
          </div>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1 text-[11px] font-medium text-teal-700 hover:text-teal-800"
          >
            View analytics
            <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </main>
  );
}