import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { LearningActivityPoint } from "@/lib/adminStats";

type LearningActivityProps = {
  activity: LearningActivityPoint[];
  activeLearners: number;
  averageLearnersPerDay: number;
};

export default function LearningActivity({
  activity,
  activeLearners,
  averageLearnersPerDay,
}: LearningActivityProps) {
  const width = 800;
  const height = 210;
  const top = 20;
  const bottom = 20;

  /*
   * The database returns one point for every day in the last 30 days.
   * For the chart labels, show a smaller representative set so the
   * interface remains clean while the graph still uses all 30 points.
   */
  const maxActivityValue = Math.max(
    1,
    ...activity.map((item) => item.value),
  );

  const maxValue = Math.max(5, Math.ceil(maxActivityValue * 1.2));

  const points = activity.map((item, index) => {
    const denominator = Math.max(activity.length - 1, 1);

    const x = (index / denominator) * width;

    const y =
      top +
      ((maxValue - item.value) / maxValue) *
        (height - top - bottom);

    return {
      ...item,
      x,
      y,
    };
  });

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath =
    points.length > 0
      ? `${linePath} L ${width} ${height} L 0 ${height} Z`
      : "";

  const labelIndexes =
    activity.length <= 7
      ? activity.map((_, index) => index)
      : Array.from(
          new Set([
            0,
            Math.round((activity.length - 1) * 0.17),
            Math.round((activity.length - 1) * 0.33),
            Math.round((activity.length - 1) * 0.5),
            Math.round((activity.length - 1) * 0.67),
            Math.round((activity.length - 1) * 0.83),
            activity.length - 1,
          ]),
        );

  const visibleLabels = labelIndexes
    .map((index) => activity[index])
    .filter(Boolean);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-col gap-4 border-b border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
              Learning activity
            </h2>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            Active learners over the last 30 days
          </p>
        </div>

        <Link
          href="/admin/analytics"
          className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0E5C58] transition hover:text-[#003334] dark:text-[#85D7CE]"
        >
          View analytics
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="px-5 pb-5 pt-4">
        <div className="mb-5 flex flex-wrap items-end gap-x-8 gap-y-3">
          <div>
            <p className="text-[11px] font-medium text-zinc-400">
              Active learners
            </p>

            <p className="mt-1 text-[26px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
              {activeLearners.toLocaleString()}
            </p>
          </div>

          <div className="border-l border-zinc-200 pl-8 dark:border-zinc-800">
            <p className="text-[11px] font-medium text-zinc-400">
              30-day average
            </p>

            <p className="mt-1 text-[15px] font-semibold text-zinc-700 dark:text-zinc-300">
              {averageLearnersPerDay.toLocaleString()} learners / day
            </p>
          </div>
        </div>

        {activity.length > 0 ? (
          <>
            <div className="relative h-[220px] w-full">
              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                {[4, 3, 2, 1, 0].map((value) => (
                  <div
                    key={value}
                    className="border-t border-zinc-100 dark:border-zinc-800/80"
                  />
                ))}
              </div>

              <svg
                viewBox={`0 0 ${width} ${height}`}
                className="relative h-full w-full overflow-visible"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="activityFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#0E5C58"
                      stopOpacity="0.12"
                    />

                    <stop
                      offset="100%"
                      stopColor="#0E5C58"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>

                {areaPath ? (
                  <path
                    d={areaPath}
                    fill="url(#activityFill)"
                  />
                ) : null}

                {linePath ? (
                  <path
                    d={linePath}
                    fill="none"
                    stroke="#0E5C58"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null}

                {points.map((point) => (
                  <circle
                    key={point.date}
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="white"
                    stroke="#0E5C58"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
            </div>

            <div
              className="mt-2 grid text-[10px] text-zinc-400"
              style={{
                gridTemplateColumns: `repeat(${visibleLabels.length}, minmax(0, 1fr))`,
              }}
            >
              {visibleLabels.map((item, index) => (
                <span
                  key={item.date}
                  className={
                    index === visibleLabels.length - 1
                      ? "text-right"
                      : index === 0
                        ? "text-left"
                        : "text-center"
                  }
                >
                  {item.label}
                </span>
              ))}
            </div>
          </>
        ) : (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="text-center">
              <p className="text-[12px] font-medium text-zinc-600 dark:text-zinc-300">
                No learning activity yet
              </p>

              <p className="mt-1 text-[11px] text-zinc-400">
                Activity will appear when learners begin completing lessons.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}