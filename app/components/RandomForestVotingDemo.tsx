"use client";

import { useState } from "react";
import { typography } from "@/app/lib/typography";

const TREE_COUNT = 6;

type TreePrediction = 0 | 1;

function getForestPrediction(votes0: number, votes1: number) {
  if (votes0 > votes1) {
    return "Class 0";
  }

  if (votes1 > votes0) {
    return "Class 1";
  }

  return "Tie";
}

export default function RandomForestVotingDemo() {
  const [predictions, setPredictions] = useState<TreePrediction[]>(() =>
    Array.from({ length: TREE_COUNT }, (_, index) => (index % 2) as TreePrediction)
  );

  const votes0 = predictions.filter((prediction) => prediction === 0).length;
  const votes1 = predictions.filter((prediction) => prediction === 1).length;
  const forestPrediction = getForestPrediction(votes0, votes1);

  const statClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950";

  const treeCardClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950";

  function toggleTree(index: number) {
    setPredictions((current) =>
      current.map((prediction, treeIndex) =>
        treeIndex === index ? (prediction === 0 ? 1 : 0) : prediction
      )
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {predictions.map((prediction, index) => (
          <div key={`tree-${index}`} className={treeCardClass}>
            <p className={typography.caption}>Tree {index + 1}</p>
            <p className={`mt-3 ${typography.cardTitle}`}>
              Class {prediction}
            </p>
            <button
              type="button"
              onClick={() => toggleTree(index)}
              className={`mt-4 inline-flex w-full items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-800 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400 ${typography.button}`}
            >
              Toggle prediction
            </button>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className={statClass}>
          <p className={typography.caption}>Votes for Class 0</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{votes0}</p>
        </div>
        <div className={statClass}>
          <p className={typography.caption}>Votes for Class 1</p>
          <p className={`mt-2 ${typography.cardTitle}`}>{votes1}</p>
        </div>
        <div className={`${statClass} border-emerald-500/30 bg-emerald-500/10`}>
          <p className={typography.caption}>Forest prediction</p>
          <p
            className={`mt-2 text-emerald-700 dark:text-emerald-400 ${typography.cardTitle}`}
          >
            {forestPrediction}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <p className={typography.caption}>Majority vote</p>
        <p className={`mt-2 ${typography.body}`}>
          Each tree votes for Class 0 or Class 1. The random forest chooses the
          class with the most votes. If votes are equal, the result is a tie.
        </p>
        <p className={`mt-3 ${typography.code}`}>
          Tree votes: [{predictions.join(", ")}] → {forestPrediction}
        </p>
      </div>
    </div>
  );
}
