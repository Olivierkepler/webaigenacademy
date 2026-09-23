import { ArrowDownRight, ArrowUpRight } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change?: string;
  description?: string;
  trend?: "up" | "down" | "neutral";
};

export default function StatCard({
  label,
  value,
  change,
  description,
  trend = "neutral",
}: StatCardProps) {
  return (
    <div className="bg-white px-5 py-5">
      <p className="text-[12px] font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-[26px] font-semibold tracking-[-0.03em] text-slate-950">
          {value}
        </p>
      </div>

      <div className="mt-2 flex min-h-5 items-center gap-1.5 text-[11px]">
        {change && trend !== "neutral" && (
          <span
            className={
              trend === "up"
                ? "flex items-center font-medium text-emerald-600"
                : "flex items-center font-medium text-rose-600"
            }
          >
            {trend === "up" ? (
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
            )}

            {change}
          </span>
        )}

        {description && (
          <span className="text-slate-400">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}