import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { UserJourneyStats } from "@/lib/adminStats";

type UserJourneyProps = {
  journey: UserJourneyStats;
};

function percentage(value: number, total: number): number {
  if (total <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((value / total) * 1000) / 10,
  );
}

export default function UserJourney({
  journey,
}: UserJourneyProps) {
  const stages = [
    {
      name: "Registered",
      value: journey.registered,
      percentage:
        journey.registered > 0 ? 100 : 0,
    },
    {
      name: "Started learning",
      value: journey.startedLearning,
      percentage: percentage(
        journey.startedLearning,
        journey.registered,
      ),
    },
    {
      name: "Reached halfway",
      value: journey.reachedHalfway,
      percentage: percentage(
        journey.reachedHalfway,
        journey.registered,
      ),
    },
    {
      name: "Completed",
      value: journey.completed,
      percentage: percentage(
        journey.completed,
        journey.registered,
      ),
    },
  ];

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold text-zinc-950 dark:text-white">
              User journey
            </h2>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </span>
          </div>

          <p className="mt-1 text-[12px] text-zinc-500 dark:text-zinc-400">
            Progression through the learning experience
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

      <div className="grid divide-y divide-zinc-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4 dark:divide-zinc-800">
        {stages.map((stage, index) => (
          <div
            key={stage.name}
            className="px-5 py-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                  {stage.name}
                </p>

                <p className="mt-1.5 text-[23px] font-semibold tracking-[-0.03em] text-zinc-950 dark:text-white">
                  {stage.value.toLocaleString()}
                </p>
              </div>

              <span className="text-[11px] font-medium text-zinc-400">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <div className="mt-5">
              <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-[#0E5C58] dark:bg-[#85D7CE]"
                  style={{
                    width: `${stage.percentage}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">
                  Conversion
                </span>

                <span className="text-[11px] font-medium text-[#0E5C58] dark:text-[#85D7CE]">
                  {stage.percentage}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}