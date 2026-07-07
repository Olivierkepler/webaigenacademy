"use client";

import { useMemo } from "react";
import { typography } from "@/app/lib/typography";

type DataRow = {
  feature0: number;
  feature1: number;
  y: number;
};

type FeatureKey = "feature0" | "feature1";

type CandidateSplit = {
  feature: FeatureKey;
  featureIndex: number;
  threshold: number;
  leftY: number[];
  rightY: number[];
  giniLeft: number;
  giniRight: number;
  weightedGini: number;
};

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

const CANDIDATE_SPLITS: Array<{
  feature: FeatureKey;
  featureIndex: number;
  threshold: number;
}> = [
  { feature: "feature0", featureIndex: 0, threshold: 1.5 },
  { feature: "feature0", featureIndex: 0, threshold: 2.5 },
  { feature: "feature0", featureIndex: 0, threshold: 3.5 },
  { feature: "feature1", featureIndex: 1, threshold: 0.5 },
];

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

function evaluateSplit(
  feature: FeatureKey,
  featureIndex: number,
  threshold: number
): CandidateSplit {
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

  return {
    feature,
    featureIndex,
    threshold,
    leftY: leftGroup.map((row) => row.y),
    rightY: rightGroup.map((row) => row.y),
    giniLeft,
    giniRight,
    weightedGini,
  };
}

function findBestSplit(splits: CandidateSplit[]): CandidateSplit {
  return splits.reduce((best, current) => {
    if (current.weightedGini < best.weightedGini) {
      return current;
    }

    if (
      current.weightedGini === best.weightedGini &&
      current.featureIndex < best.featureIndex
    ) {
      return current;
    }

    return best;
  });
}

function isSameSplit(a: CandidateSplit, b: CandidateSplit) {
  return a.feature === b.feature && a.threshold === b.threshold;
}

export default function BestSplitFinder() {
  const splits = useMemo(
    () =>
      CANDIDATE_SPLITS.map((candidate) =>
        evaluateSplit(candidate.feature, candidate.featureIndex, candidate.threshold)
      ),
    []
  );

  const bestSplit = useMemo(() => findBestSplit(splits), [splits]);

  const tableClass = "w-full border-collapse text-left text-sm";
  const headerClass =
    "border-b border-zinc-300 px-3 py-3 dark:border-zinc-700";
  const cellClass = "border-b border-zinc-200 px-3 py-3 dark:border-zinc-800";

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-5">
        <p className={typography.label}>Best split</p>
        <p className={`mt-2 ${typography.accentSubtitle}`}>
          {bestSplit.feature} &le; {bestSplit.threshold}
        </p>
        <p className={`mt-3 ${typography.body}`}>
          Weighted Gini:{" "}
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            {bestSplit.weightedGini.toFixed(3)}
          </span>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
        <table className={tableClass}>
          <thead>
            <tr className={typography.caption}>
              <th className={headerClass}>Feature</th>
              <th className={headerClass}>Threshold</th>
              <th className={headerClass}>Left y values</th>
              <th className={headerClass}>Right y values</th>
              <th className={headerClass}>Gini(left)</th>
              <th className={headerClass}>Gini(right)</th>
              <th className={headerClass}>Weighted Gini</th>
            </tr>
          </thead>
          <tbody className={typography.code}>
            {splits.map((split) => {
              const isBest = isSameSplit(split, bestSplit);

              return (
                <tr
                  key={`${split.feature}-${split.threshold}`}
                  className={
                    isBest
                      ? "bg-emerald-500/10 text-emerald-900 dark:text-emerald-100"
                      : ""
                  }
                >
                  <td className={cellClass}>{split.feature}</td>
                  <td className={cellClass}>{split.threshold}</td>
                  <td className={cellClass}>[{split.leftY.join(", ")}]</td>
                  <td className={cellClass}>[{split.rightY.join(", ")}]</td>
                  <td className={cellClass}>{split.giniLeft.toFixed(3)}</td>
                  <td className={cellClass}>{split.giniRight.toFixed(3)}</td>
                  <td
                    className={`${cellClass} ${
                      isBest
                        ? "font-semibold text-emerald-700 dark:text-emerald-400"
                        : ""
                    }`}
                  >
                    {split.weightedGini.toFixed(3)}
                    {isBest ? " ★" : ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className={typography.caption}>
        The best split has the smallest weighted Gini. Ties are broken by lower
        feature index (feature0 before feature1).
      </p>
    </div>
  );
}
