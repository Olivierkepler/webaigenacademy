"use client";

import { useState } from "react";
import { typography } from "@/app/lib/typography";

const MAX_COUNT = 100;

function computeGini(class0: number, class1: number): number {
  const total = class0 + class1;

  if (total === 0) {
    return 0;
  }

  const p0 = class0 / total;
  const p1 = class1 / total;

  return 1 - (p0 * p0 + p1 * p1);
}

function clampCount(value: number) {
  return Math.min(MAX_COUNT, Math.max(0, Math.round(value)));
}

type GroupInputsProps = {
  title: string;
  class0: number;
  class1: number;
  onClass0Change: (value: number) => void;
  onClass1Change: (value: number) => void;
  idPrefix: string;
  inputClass: string;
  sliderClass: string;
  groupClass: string;
};

function GroupInputs({
  title,
  class0,
  class1,
  onClass0Change,
  onClass1Change,
  idPrefix,
  inputClass,
  sliderClass,
  groupClass,
}: GroupInputsProps) {
  return (
    <div className={groupClass}>
      <h3 className={typography.cardTitle}>{title}</h3>

      <div className="mt-6 space-y-6">
        <div>
          <label
            htmlFor={`${idPrefix}-class-0`}
            className={`block ${typography.body}`}
          >
            Class 0 count
          </label>
          <input
            id={`${idPrefix}-class-0`}
            type="range"
            min={0}
            max={MAX_COUNT}
            value={class0}
            onChange={(event) => onClass0Change(Number(event.target.value))}
            className={`mt-3 ${sliderClass}`}
          />
          <input
            type="number"
            min={0}
            max={MAX_COUNT}
            value={class0}
            onChange={(event) =>
              onClass0Change(clampCount(Number(event.target.value) || 0))
            }
            className={`mt-3 ${inputClass} ${typography.code}`}
          />
        </div>

        <div>
          <label
            htmlFor={`${idPrefix}-class-1`}
            className={`block ${typography.body}`}
          >
            Class 1 count
          </label>
          <input
            id={`${idPrefix}-class-1`}
            type="range"
            min={0}
            max={MAX_COUNT}
            value={class1}
            onChange={(event) => onClass1Change(Number(event.target.value))}
            className={`mt-3 ${sliderClass}`}
          />
          <input
            type="number"
            min={0}
            max={MAX_COUNT}
            value={class1}
            onChange={(event) =>
              onClass1Change(clampCount(Number(event.target.value) || 0))
            }
            className={`mt-3 ${inputClass} ${typography.code}`}
          />
        </div>
      </div>
    </div>
  );
}

export default function WeightedGiniCalculator() {
  const [leftClass0, setLeftClass0] = useState(6);
  const [leftClass1, setLeftClass1] = useState(4);
  const [rightClass0, setRightClass0] = useState(2);
  const [rightClass1, setRightClass1] = useState(8);

  const leftTotal = leftClass0 + leftClass1;
  const rightTotal = rightClass0 + rightClass1;
  const totalSamples = leftTotal + rightTotal;
  const giniLeft = computeGini(leftClass0, leftClass1);
  const giniRight = computeGini(rightClass0, rightClass1);
  const weightedGini =
    totalSamples > 0
      ? (leftTotal / totalSamples) * giniLeft +
        (rightTotal / totalSamples) * giniRight
      : 0;

  const inputClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

  const sliderClass = "w-full accent-emerald-600";

  const statClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950";

  const groupClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950";

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <GroupInputs
          title="Left group"
          class0={leftClass0}
          class1={leftClass1}
          onClass0Change={setLeftClass0}
          onClass1Change={setLeftClass1}
          idPrefix="left"
          inputClass={inputClass}
          sliderClass={sliderClass}
          groupClass={groupClass}
        />
        <GroupInputs
          title="Right group"
          class0={rightClass0}
          class1={rightClass1}
          onClass0Change={setRightClass0}
          onClass1Change={setRightClass1}
          idPrefix="right"
          inputClass={inputClass}
          sliderClass={sliderClass}
          groupClass={groupClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className={statClass}>
          <p className={typography.caption}>Left total</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{leftTotal}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Right total</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{rightTotal}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Total samples</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{totalSamples}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Gini(left)</p>
          <p className={`mt-2 ${typography.code}`}>{giniLeft.toFixed(3)}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Gini(right)</p>
          <p className={`mt-2 ${typography.code}`}>{giniRight.toFixed(3)}</p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className={typography.caption}>Weighted Gini formula</p>
        <p className={`mt-2 ${typography.code}`}>
          ({leftTotal} / {totalSamples}) × {giniLeft.toFixed(3)} + ({rightTotal}{" "}
          / {totalSamples}) × {giniRight.toFixed(3)} = {weightedGini.toFixed(3)}
        </p>
        <p className={`mt-3 ${typography.body}`}>
          (n<sub>left</sub> / n) × Gini(left) + (n<sub>right</sub> / n) ×
          Gini(right)
        </p>
      </div>

      <div className={`${statClass} border-emerald-500/30 bg-emerald-500/10`}>
        <p className={typography.caption}>Weighted Gini</p>
        <p
          className={`mt-2 text-emerald-700 dark:text-emerald-400 ${typography.cardTitle}`}
        >
          {weightedGini.toFixed(3)}
        </p>
      </div>
    </div>
  );
}
