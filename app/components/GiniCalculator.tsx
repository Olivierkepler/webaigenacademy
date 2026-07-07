"use client";

import { useState } from "react";
import { typography } from "@/app/lib/typography";

const MAX_COUNT = 100;

export default function GiniCalculator() {
  const [class0Count, setClass0Count] = useState(6);
  const [class1Count, setClass1Count] = useState(4);

  const total = class0Count + class1Count;
  const p0 = total > 0 ? class0Count / total : 0;
  const p1 = total > 0 ? class1Count / total : 0;
  const gini = total > 0 ? 1 - (p0 * p0 + p1 * p1) : 0;

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

  const sliderClass = "w-full accent-emerald-600";

  const statClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950";

  function clampCount(value: number) {
    return Math.min(MAX_COUNT, Math.max(0, Math.round(value)));
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="class-0-count"
            className={`block ${typography.body}`}
          >
            Class 0 count
          </label>
          <input
            id="class-0-count"
            type="range"
            min={0}
            max={MAX_COUNT}
            value={class0Count}
            onChange={(event) => setClass0Count(Number(event.target.value))}
            className={`mt-3 ${sliderClass}`}
          />
          <input
            type="number"
            min={0}
            max={MAX_COUNT}
            value={class0Count}
            onChange={(event) =>
              setClass0Count(clampCount(Number(event.target.value) || 0))
            }
            className={`mt-3 ${inputClass} ${typography.code}`}
          />
        </div>

        <div>
          <label
            htmlFor="class-1-count"
            className={`block ${typography.body}`}
          >
            Class 1 count
          </label>
          <input
            id="class-1-count"
            type="range"
            min={0}
            max={MAX_COUNT}
            value={class1Count}
            onChange={(event) => setClass1Count(Number(event.target.value))}
            className={`mt-3 ${sliderClass}`}
          />
          <input
            type="number"
            min={0}
            max={MAX_COUNT}
            value={class1Count}
            onChange={(event) =>
              setClass1Count(clampCount(Number(event.target.value) || 0))
            }
            className={`mt-3 ${inputClass} ${typography.code}`}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={statClass}>
          <p className={typography.caption}>Total samples</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{total}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>p₀</p>
          <p className={`mt-2 ${typography.code}`}>{p0.toFixed(3)}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>p₁</p>
          <p className={`mt-2 ${typography.code}`}>{p1.toFixed(3)}</p>
        </div>
        <div className={`${statClass} border-emerald-500/30 bg-emerald-500/10`}>
          <p className={typography.caption}>Gini</p>
          <p
            className={`mt-2 text-emerald-700 dark:text-emerald-400 ${typography.cardTitle}`}
          >
            {gini.toFixed(3)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className={typography.caption}>Formula</p>
        <p className={`mt-2 ${typography.code}`}>
          Gini = 1 − (p₀² + p₁²) = 1 − ({p0.toFixed(3)}² + {p1.toFixed(3)}²) ={" "}
          {gini.toFixed(3)}
        </p>
      </div>
    </div>
  );
}
