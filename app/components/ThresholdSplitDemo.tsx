"use client";

import { useMemo, useState } from "react";
import { typography } from "@/app/lib/typography";

type Patient = {
  id: string;
  age: number;
  restingBp: number;
  heartDisease: 0 | 1;
};

const PATIENTS: Patient[] = [
  { id: "P1", age: 42, restingBp: 118, heartDisease: 0 },
  { id: "P2", age: 45, restingBp: 122, heartDisease: 0 },
  { id: "P3", age: 45, restingBp: 128, heartDisease: 0 },
  { id: "P4", age: 48, restingBp: 130, heartDisease: 0 },
  { id: "P5", age: 50, restingBp: 135, heartDisease: 0 },
  { id: "P6", age: 53, restingBp: 138, heartDisease: 1 },
  { id: "P7", age: 55, restingBp: 142, heartDisease: 1 },
  { id: "P8", age: 55, restingBp: 145, heartDisease: 1 },
  { id: "P9", age: 58, restingBp: 148, heartDisease: 1 },
  { id: "P10", age: 60, restingBp: 150, heartDisease: 1 },
  { id: "P11", age: 63, restingBp: 155, heartDisease: 1 },
  { id: "P12", age: 67, restingBp: 160, heartDisease: 1 },
];

const AGE_THRESHOLDS = [43.5, 46.5, 49, 51.5, 54, 56.5, 59, 61.5, 65];

const AGE_MIN = 40;
const AGE_MAX = 70;
const BP_MIN = 115;
const BP_MAX = 165;

const PLOT_WIDTH = 360;
const PLOT_HEIGHT = 280;
const MARGIN = { top: 24, right: 20, bottom: 44, left: 48 };

function scaleAge(age: number) {
  const innerWidth = PLOT_WIDTH - MARGIN.left - MARGIN.right;
  return MARGIN.left + ((age - AGE_MIN) / (AGE_MAX - AGE_MIN)) * innerWidth;
}

function scaleBp(bp: number) {
  const innerHeight = PLOT_HEIGHT - MARGIN.top - MARGIN.bottom;
  return (
    MARGIN.top + innerHeight - ((bp - BP_MIN) / (BP_MAX - BP_MIN)) * innerHeight
  );
}

export default function ThresholdSplitDemo() {
  const [threshold, setThreshold] = useState(51.5);

  const leftGroup = useMemo(
    () => PATIENTS.filter((patient) => patient.age <= threshold),
    [threshold]
  );
  const rightGroup = useMemo(
    () => PATIENTS.filter((patient) => patient.age > threshold),
    [threshold]
  );

  const selectClass =
    "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

  const panelClass =
    "rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-950";

  const cellClass =
    "border-b border-zinc-200 px-3 py-2 dark:border-zinc-800";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4">
          <p className={typography.label}>Split rule (Age only)</p>
          <p className={`mt-2 ${typography.accentSubtitle}`}>
            Age &le; {threshold}
          </p>
        </div>

        <div>
          <label htmlFor="threshold-select" className={`block ${typography.body}`}>
            Candidate threshold
          </label>
          <select
            id="threshold-select"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className={`mt-3 ${selectClass} ${typography.body}`}
          >
            {AGE_THRESHOLDS.map((value) => (
              <option key={value} value={value}>
                t = {value}
              </option>
            ))}
          </select>
          <p className={`mt-2 ${typography.caption}`}>
            Midpoints between consecutive unique Age values
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className={panelClass}>
            <h3 className={typography.cardTitle}>Left region</h3>
            <p className={`mt-1 ${typography.caption}`}>Age &le; {threshold}</p>
            <p className={`mt-3 text-2xl font-semibold text-zinc-900 dark:text-white`}>
              {leftGroup.length}
            </p>
            <p className={`mt-1 ${typography.caption}`}>patients</p>
            <p className={`mt-3 ${typography.body}`}>
              {leftGroup.map((patient) => patient.id).join(", ")}
            </p>
          </div>

          <div className={panelClass}>
            <h3 className={typography.cardTitle}>Right region</h3>
            <p className={`mt-1 ${typography.caption}`}>Age &gt; {threshold}</p>
            <p className={`mt-3 text-2xl font-semibold text-zinc-900 dark:text-white`}>
              {rightGroup.length}
            </p>
            <p className={`mt-1 ${typography.caption}`}>patients</p>
            <p className={`mt-3 ${typography.body}`}>
              {rightGroup.map((patient) => patient.id).join(", ")}
            </p>
          </div>
        </div>

        <div className={panelClass}>
          <p className={typography.caption}>How patients are divided</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className={typography.caption}>
                  <th className={cellClass}>Patient</th>
                  <th className={cellClass}>Age</th>
                  <th className={cellClass}>Region</th>
                </tr>
              </thead>
              <tbody className={typography.code}>
                {PATIENTS.map((patient) => {
                  const region =
                    patient.age <= threshold ? "Left" : "Right";

                  return (
                    <tr key={patient.id}>
                      <td className={cellClass}>{patient.id}</td>
                      <td className={cellClass}>{patient.age}</td>
                      <td className={cellClass}>{region}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className={panelClass}>
        <h3 className={typography.cardTitle}>Scatter plot</h3>
        <p className={`mt-2 ${typography.caption}`}>
          Blue = No disease &nbsp;·&nbsp; Red = Disease
        </p>

        <svg
          viewBox={`0 0 ${PLOT_WIDTH} ${PLOT_HEIGHT}`}
          className="mt-4 w-full"
          role="img"
          aria-label="Scatter plot of patient age versus resting blood pressure with threshold line"
        >
          <rect
            x={MARGIN.left}
            y={MARGIN.top}
            width={scaleAge(threshold) - MARGIN.left}
            height={PLOT_HEIGHT - MARGIN.top - MARGIN.bottom}
            className="fill-blue-500/10"
          />
          <rect
            x={scaleAge(threshold)}
            y={MARGIN.top}
            width={PLOT_WIDTH - MARGIN.right - scaleAge(threshold)}
            height={PLOT_HEIGHT - MARGIN.top - MARGIN.bottom}
            className="fill-red-500/10"
          />

          <line
            x1={MARGIN.left}
            y1={PLOT_HEIGHT - MARGIN.bottom}
            x2={PLOT_WIDTH - MARGIN.right}
            y2={PLOT_HEIGHT - MARGIN.bottom}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1}
          />
          <line
            x1={MARGIN.left}
            y1={MARGIN.top}
            x2={MARGIN.left}
            y2={PLOT_HEIGHT - MARGIN.bottom}
            className="stroke-zinc-400 dark:stroke-zinc-500"
            strokeWidth={1}
          />

          <text
            x={(MARGIN.left + PLOT_WIDTH - MARGIN.right) / 2}
            y={PLOT_HEIGHT - 8}
            textAnchor="middle"
            className="fill-zinc-500 text-[11px] dark:fill-zinc-400"
          >
            Age (years)
          </text>
          <text
            x={14}
            y={(MARGIN.top + PLOT_HEIGHT - MARGIN.bottom) / 2}
            textAnchor="middle"
            transform={`rotate(-90 14 ${(MARGIN.top + PLOT_HEIGHT - MARGIN.bottom) / 2})`}
            className="fill-zinc-500 text-[11px] dark:fill-zinc-400"
          >
            Resting BP
          </text>

          {AGE_THRESHOLDS.map((value) => {
            const x = scaleAge(value);
            const isActive = value === threshold;

            return (
              <g key={value}>
                <line
                  x1={x}
                  y1={MARGIN.top}
                  x2={x}
                  y2={PLOT_HEIGHT - MARGIN.bottom}
                  className={
                    isActive
                      ? "stroke-emerald-500"
                      : "stroke-zinc-300 dark:stroke-zinc-600"
                  }
                  strokeWidth={isActive ? 2 : 1}
                  strokeDasharray={isActive ? "6 4" : "4 4"}
                />
                <text
                  x={x}
                  y={MARGIN.top - 6}
                  textAnchor="middle"
                  className={
                    isActive
                      ? "fill-emerald-600 text-[10px] font-semibold dark:fill-emerald-400"
                      : "fill-zinc-400 text-[9px] dark:fill-zinc-500"
                  }
                >
                  {value}
                </text>
              </g>
            );
          })}

          {PATIENTS.map((patient) => {
            const cx = scaleAge(patient.age);
            const cy = scaleBp(patient.restingBp);
            const isLeft = patient.age <= threshold;

            return (
              <g key={patient.id}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={7}
                  className={
                    patient.heartDisease === 0
                      ? "fill-blue-500 stroke-white dark:stroke-zinc-900"
                      : "fill-red-500 stroke-white dark:stroke-zinc-900"
                  }
                  strokeWidth={1.5}
                  opacity={isLeft || patient.age > threshold ? 1 : 0.4}
                />
                <text
                  x={cx}
                  y={cy - 10}
                  textAnchor="middle"
                  className="fill-zinc-600 text-[9px] dark:fill-zinc-300"
                >
                  {patient.id}
                </text>
              </g>
            );
          })}

          <text
            x={MARGIN.left + 8}
            y={MARGIN.top + 14}
            className="fill-blue-600 text-[10px] font-medium dark:fill-blue-400"
          >
            Left
          </text>
          <text
            x={PLOT_WIDTH - MARGIN.right - 28}
            y={MARGIN.top + 14}
            className="fill-red-600 text-[10px] font-medium dark:fill-red-400"
          >
            Right
          </text>
        </svg>

        <p className={`mt-4 ${typography.body}`}>
          The highlighted dashed line is the active threshold. Fainter lines show
          the other candidate midpoints between unique Age values.
        </p>
      </div>
    </div>
  );
}
