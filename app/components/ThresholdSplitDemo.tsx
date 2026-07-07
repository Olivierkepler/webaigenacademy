"use client";

import { useState } from "react";
import { typography } from "@/app/lib/typography";

type DataRow = {
  feature0: number;
  feature1: number;
  y: number;
};

type FeatureKey = "feature0" | "feature1";

const DATASET: DataRow[] = [
  { feature0: 1, feature1: 0, y: 0 },
  { feature0: 2, feature1: 0, y: 0 },
  { feature0: 3, feature1: 0, y: 1 },
  { feature0: 4, feature1: 0, y: 1 },
  { feature0: 1, feature1: 1, y: 0 },
  { feature0: 2, feature1: 1, y: 1 },
  { feature0: 3, feature1: 1, y: 1 },
  { feature0: 4, feature1: 1, y: 1 },
];

const THRESHOLDS: Record<FeatureKey, number[]> = {
  feature0: [1.5, 2.5, 3.5],
  feature1: [0.5],
};

function computeGini(rows: DataRow[]): number {
  const class0 = rows.filter((row) => row.y === 0).length;
  const class1 = rows.filter((row) => row.y === 1).length;
  const total = class0 + class1;

  if (total === 0) {
    return 0;
  }

  const p0 = class0 / total;
  const p1 = class1 / total;

  return 1 - (p0 * p0 + p1 * p1);
}

function formatRow(row: DataRow) {
  return `(${row.feature0}, ${row.feature1}, y=${row.y})`;
}

export default function ThresholdSplitDemo() {
  const [feature, setFeature] = useState<FeatureKey>("feature0");
  const [threshold, setThreshold] = useState(1.5);

  const thresholdOptions = THRESHOLDS[feature];
  const leftGroup = DATASET.filter((row) => row[feature] <= threshold);
  const rightGroup = DATASET.filter((row) => row[feature] > threshold);
  const leftTotal = leftGroup.length;
  const rightTotal = rightGroup.length;
  const totalSamples = DATASET.length;
  const giniLeft = computeGini(leftGroup);
  const giniRight = computeGini(rightGroup);
  const weightedGini =
    totalSamples > 0
      ? (leftTotal / totalSamples) * giniLeft +
        (rightTotal / totalSamples) * giniRight
      : 0;

  const leftYValues = leftGroup.map((row) => row.y);
  const rightYValues = rightGroup.map((row) => row.y);

  const selectClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

  const statClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950";

  const groupClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950";

  const tableClass =
    "w-full border-collapse text-left text-sm";

  const cellClass =
    "border-b border-zinc-200 px-3 py-2 dark:border-zinc-800";

  function handleFeatureChange(nextFeature: FeatureKey) {
    setFeature(nextFeature);
    setThreshold(THRESHOLDS[nextFeature][0]);
  }

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
        <p className={typography.label}>Current split rule</p>
        <p className={`mt-2 ${typography.accentSubtitle}`}>
          {feature} &le; {threshold}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="feature-select" className={`block ${typography.body}`}>
            Feature
          </label>
          <select
            id="feature-select"
            value={feature}
            onChange={(event) =>
              handleFeatureChange(event.target.value as FeatureKey)
            }
            className={`mt-3 ${selectClass} ${typography.body}`}
          >
            <option value="feature0">feature0</option>
            <option value="feature1">feature1</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="threshold-select"
            className={`block ${typography.body}`}
          >
            Threshold
          </label>
          <select
            id="threshold-select"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className={`mt-3 ${selectClass} ${typography.body}`}
          >
            {thresholdOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={groupClass}>
          <h3 className={typography.cardTitle}>Left group</h3>
          <p className={`mt-2 ${typography.caption}`}>
            {feature} &le; {threshold}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className={typography.caption}>
                  <th className={cellClass}>feature0</th>
                  <th className={cellClass}>feature1</th>
                  <th className={cellClass}>y</th>
                </tr>
              </thead>
              <tbody className={typography.code}>
                {leftGroup.map((row, index) => (
                  <tr key={`left-${index}`}>
                    <td className={cellClass}>{row.feature0}</td>
                    <td className={cellClass}>{row.feature1}</td>
                    <td className={cellClass}>{row.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${typography.body}`}>
            Rows: {leftGroup.map(formatRow).join(", ") || "None"}
          </p>
          <p className={`mt-2 ${typography.body}`}>
            y values: [{leftYValues.join(", ")}]
          </p>
        </div>

        <div className={groupClass}>
          <h3 className={typography.cardTitle}>Right group</h3>
          <p className={`mt-2 ${typography.caption}`}>
            {feature} &gt; {threshold}
          </p>
          <div className="mt-4 overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr className={typography.caption}>
                  <th className={cellClass}>feature0</th>
                  <th className={cellClass}>feature1</th>
                  <th className={cellClass}>y</th>
                </tr>
              </thead>
              <tbody className={typography.code}>
                {rightGroup.map((row, index) => (
                  <tr key={`right-${index}`}>
                    <td className={cellClass}>{row.feature0}</td>
                    <td className={cellClass}>{row.feature1}</td>
                    <td className={cellClass}>{row.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={`mt-4 ${typography.body}`}>
            Rows: {rightGroup.map(formatRow).join(", ") || "None"}
          </p>
          <p className={`mt-2 ${typography.body}`}>
            y values: [{rightYValues.join(", ")}]
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className={statClass}>
          <p className={typography.caption}>Gini(left)</p>
          <p className={`mt-2 ${typography.code}`}>{giniLeft.toFixed(3)}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Gini(right)</p>
          <p className={`mt-2 ${typography.code}`}>{giniRight.toFixed(3)}</p>
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

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className={typography.caption}>Weighted Gini formula</p>
        <p className={`mt-2 ${typography.code}`}>
          ({leftTotal} / {totalSamples}) × {giniLeft.toFixed(3)} + ({rightTotal}{" "}
          / {totalSamples}) × {giniRight.toFixed(3)} = {weightedGini.toFixed(3)}
        </p>
      </div>
    </div>
  );
}
