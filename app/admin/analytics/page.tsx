import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  getAdminCoursePerformance,
  getAdminOverview,
} from "@/lib/adminStats";

function MetricCard({
  label,
  value,
  description,
  change,
  icon: Icon,
}: {
  label: string;
  value: string;
  description: string;
  change?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="min-w-0 flex-1 px-5 py-5 lg:px-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[12px] font-medium text-slate-500">{label}</p>

          <div className="mt-2 flex items-end gap-2">
            <p className="text-[27px] font-semibold tracking-[-0.03em] text-slate-950">
              {value}
            </p>

            {change && (
              <span className="mb-1 text-[11px] font-semibold text-emerald-600">
                {change}
              </span>
            )}
          </div>
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

function LineChart({
  data,
}: {
  data: { label: string; learners: number }[];
}) {
  const width = 900;
  const height = 230;
  const paddingX = 14;
  const paddingTop = 24;
  const paddingBottom = 36;

  if (data.length === 0) {
    return (
      <div className="mt-6 flex h-[220px] items-center justify-center text-[12px] text-slate-400">
        No learner activity recorded in this period.
      </div>
    );
  }

  const values = data.map((item) => item.learners);

  const maxValue = Math.max(...values, 1);

  const chartHeight =
    height - paddingTop - paddingBottom;

  const points = data.map((item, index) => {
    const x =
      data.length === 1
        ? width / 2
        : paddingX +
        (index / (data.length - 1)) *
        (width - paddingX * 2);

    const y =
      paddingTop +
      (1 - item.learners / maxValue) *
      chartHeight;

    return {
      x,
      y,
    };
  });

  const path = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const baselineY =
    height - paddingBottom;

  const areaPath =
    points.length > 0
      ? `${path} L ${points[points.length - 1].x
      } ${baselineY} L ${points[0].x
      } ${baselineY} Z`
      : "";

  return (
    <div className="mt-6">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-[220px] w-full overflow-visible"
        preserveAspectRatio="none"
        role="img"
        aria-label="Active learner trend"
      >
        <defs>
          <linearGradient
            id="analyticsActivityGradient"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#0f766e"
              stopOpacity="0.14"
            />

            <stop
              offset="100%"
              stopColor="#0f766e"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map(
          (ratio) => {
            const y =
              paddingTop +
              ratio * chartHeight;

            return (
              <line
                key={ratio}
                x1="0"
                x2={width}
                y1={y}
                y2={y}
                stroke="#e2e8f0"
                strokeWidth="1"
              />
            );
          }
        )}

        <path
          d={areaPath}
          fill="url(#analyticsActivityGradient)"
        />

        <path
          d={path}
          fill="none"
          stroke="#0f766e"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <circle
            key={`${data[index].label}-${index}`}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="white"
            stroke="#0f766e"
            strokeWidth="2"
          />
        ))}
      </svg>

      <div className="flex justify-between text-[10px] text-slate-400">
        {data.map((item, index) => (
          <span key={`${item.label}-${index}`}>
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function AdminAnalyticsPage() {
  const [overview, coursePerformance] =
    await Promise.all([
      getAdminOverview(),
      getAdminCoursePerformance(),
    ]);

  const activityData = overview.learningActivity.map(
    (item) => ({
      label: item.label,
      learners: item.value,
    })
  );

  const journeyTotal =
    overview.userJourney.registered;

  const journeyPercent = (value: number) => {
    if (journeyTotal <= 0) {
      return 0;
    }

    return Math.round(
      (value / journeyTotal) * 1000
    ) / 10;
  };

  const journey = [
    {
      label: "Registered",
      value:
        overview.userJourney.registered.toLocaleString(),
      percent: journeyPercent(
        overview.userJourney.registered
      ),
    },
    {
      label: "Started learning",
      value:
        overview.userJourney.startedLearning.toLocaleString(),
      percent: journeyPercent(
        overview.userJourney.startedLearning
      ),
    },
    {
      label: "Reached halfway",
      value:
        overview.userJourney.reachedHalfway.toLocaleString(),
      percent: journeyPercent(
        overview.userJourney.reachedHalfway
      ),
    },
    {
      label: "Completed",
      value:
        overview.userJourney.completed.toLocaleString(),
      percent: journeyPercent(
        overview.userJourney.completed
      ),
    },
  ];

  const peakActivity =
    overview.learningActivity.reduce(
      (highest, item) =>
        Math.max(highest, item.value),
      0
    );
  const activeRate =
    overview.totalUsers > 0
      ? Math.round(
        (overview.activeLearnersLast30Days /
          overview.totalUsers) *
        1000
      ) / 10
      : 0;

  const lessonsPerLearner =
    overview.userJourney.startedLearning > 0
      ? Math.round(
        (overview.totalCompletions /
          overview.userJourney.startedLearning) *
        10
      ) / 10
      : 0;

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-7 lg:px-8">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[11px] font-medium text-slate-500">
                Academy analytics
              </span>
            </div>

            <h1 className="mt-2 text-[26px] font-semibold tracking-[-0.035em] text-slate-950">
              Analytics
            </h1>

            <p className="mt-1 text-[13px] text-slate-500">
              Understand learner engagement, progress and course
              performance.
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-[12px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Last 30 days
              <Clock3 size={14} />
            </button>
          </div>
        </div>

        {/* KPI row */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            <MetricCard
              label="Active learners"
              value={overview.activeLearnersLast30Days.toLocaleString()}
              description="Learners active in the last 30 days"
              icon={Users}
            />

            <MetricCard
              label="Lesson completions"
              value={overview.totalCompletions.toLocaleString()}
              description="Total recorded lesson completions"
              icon={CheckCircle2}
            />

            <MetricCard
              label="Registered users"
              value={overview.totalUsers.toLocaleString()}
              description="Total Academy accounts"
              icon={Users}
            />

            <MetricCard
              label="Courses completed"
              value={overview.userJourney.completed.toLocaleString()}
              description="Users who completed current course requirements"
              icon={CheckCircle2}
            />
          </div>
        </section>

        {/* Learner activity */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-start lg:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-slate-950">
                  Learner activity
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Active learner activity across the last 30 days.
              </p>
            </div>

            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-800"
            >
              View activity
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="px-5 py-5 lg:px-6">
            <div className="flex flex-wrap items-center gap-7">
              <div>
                <p className="text-[11px] text-slate-400">
                  Active learners
                </p>

                <div className="mt-1 flex items-end gap-2">
                  <span className="text-[25px] font-semibold tracking-tight text-slate-950">
                    {overview.activeLearnersLast30Days.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div>
                <p className="text-[11px] text-slate-400">
                  30-day average
                </p>

                <p className="mt-1 text-[14px] font-semibold text-slate-700">
                  {overview.averageActiveLearnersPerDay.toFixed(2)} learners / day
                </p>
              </div>

              <div className="h-10 w-px bg-slate-200" />

              <div>
                <p className="text-[11px] text-slate-400">
                  Peak activity
                </p>

                <p className="mt-1 text-[14px] font-semibold text-slate-700">
                  {peakActivity.toLocaleString()}{" "}
                  {peakActivity === 1 ? "learner" : "learners"}
                </p>
              </div>
            </div>

            <LineChart data={activityData} />
          </div>
        </section>

        {/* Two column analytics */}
        <div className="mt-6 grid gap-6">
          {/* Engagement summary */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-5 py-5 lg:px-6">
              <h2 className="text-[15px] font-semibold text-slate-950">
                Engagement
              </h2>

              <p className="mt-1 text-[12px] text-slate-500">
                Live learner participation across the Academy.
              </p>
            </div>

            <div className="grid divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
              <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6">
                <div className="flex items-center gap-3">
                  <Users
                    size={17}
                    className="text-slate-400"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-[12px] text-slate-600">
                      30-day active rate
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Active users / registered users
                    </p>
                  </div>
                </div>

                <span className="text-[14px] font-semibold text-slate-950">
                  {activeRate}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6">
                <div className="flex items-center gap-3">
                  <BookOpen
                    size={17}
                    className="text-slate-400"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-[12px] text-slate-600">
                      Lessons / learner
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Completed lessons per learner
                    </p>
                  </div>
                </div>

                <span className="text-[14px] font-semibold text-slate-950">
                  {lessonsPerLearner}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6">
                <div className="flex items-center gap-3">
                  <TrendingUp
                    size={17}
                    className="text-slate-400"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-[12px] text-slate-600">
                      Started learning
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Users with learning activity
                    </p>
                  </div>
                </div>

                <span className="text-[14px] font-semibold text-slate-950">
                  {overview.userJourney.startedLearning.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4 px-5 py-5 lg:px-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2
                    size={17}
                    className="text-slate-400"
                    strokeWidth={1.7}
                  />

                  <div>
                    <p className="text-[12px] text-slate-600">
                      Course completions
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Users meeting all requirements
                    </p>
                  </div>
                </div>

                <span className="text-[14px] font-semibold text-slate-950">
                  {overview.userJourney.completed.toLocaleString()}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Learning journey */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 lg:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-slate-950">
                  Learner journey
                </h2>

              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Conversion through the Academy learning experience.
              </p>
            </div>

            <BarChart3
              size={18}
              className="text-slate-400"
              strokeWidth={1.7}
            />
          </div>

          <div className="grid divide-y divide-slate-200 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {journey.map((item, index) => (
              <div key={item.label} className="px-5 py-5 lg:px-6">
                <div className="flex justify-between gap-4">
                  <p className="text-[11px] text-slate-500">
                    {item.label}
                  </p>

                  <span className="text-[10px] text-slate-400">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-2 text-[22px] font-semibold tracking-tight text-slate-950">
                  {item.value}
                </p>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-700"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>

                <div className="mt-2 flex justify-between text-[10px]">
                  <span className="text-slate-400">Conversion</span>

                  <span className="font-medium text-teal-700">
                    {item.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course performance */}
        <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-5 lg:px-6">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-slate-950">
                  Course performance
                </h2>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Compare engagement and completion across Academy courses.
              </p>
            </div>

            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-teal-700 hover:text-teal-800"
            >
              View courses
              <ArrowUpRight size={13} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 lg:px-6">
                    Course
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Enrolled
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Active
                  </th>

                  <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                    Completed
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400 lg:px-6">
                    Completion
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {coursePerformance.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-[12px] text-slate-400"
                    >
                      No published courses available.
                    </td>
                  </tr>
                )}
                {coursePerformance.map((course) => (
                  <tr key={course.course}>
                    <td className="px-5 py-4 lg:px-6">
                      <p className="text-[12px] font-medium text-slate-800">
                        {course.course}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {course.category}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-[12px] font-medium text-slate-600">
                      {course.enrolled}
                    </td>

                    <td className="px-4 py-4 text-[12px] font-medium text-slate-600">
                      {course.active}
                    </td>

                    <td className="px-4 py-4 text-[12px] font-medium text-slate-600">
                      {course.completed}
                    </td>

                    <td className="px-5 py-4 lg:px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-700"
                            style={{
                              width: `${course.completion}%`,
                            }}
                          />
                        </div>

                        <span className="text-[11px] font-medium text-slate-600">
                          {course.completion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-slate-200 py-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-[11px] font-medium text-slate-600">
              Analytics overview
            </p>

            <p className="mt-1 text-[10px] text-slate-400">
              Live Academy learning and enrollment data.
            </p>
          </div>

          <p className="text-[10px] text-slate-400">
            {overview.totalUsers.toLocaleString()} registered users ·{" "}
            {overview.totalCompletions.toLocaleString()} lesson completions ·{" "}
            {overview.activeLearnersLast30Days.toLocaleString()} active in the last 30 days
          </p>
        </div>
      </div>
    </main>
  );
}