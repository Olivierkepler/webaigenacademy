"use client";

import { useState } from "react";
import Link from "next/link";
import { primaryButtonClass, secondaryButtonClass } from "@/app/lib/typography";

const COURSE_PATH = "/learn/machine-learning";

/**
 * Signature element: a live decision tree built from the course's own
 * teaching dataset (hours studied, review session attendance → pass/fail).
 * Convention: y = 0 (fail) is red, y = 1 (pass) is blue.
 *
 * Hovering a leaf lights up the decision path that reaches it.
 */

type EdgeId = "root-review" | "root-pass" | "review-fail" | "review-pass";

const LEAF_PATHS: Record<string, EdgeId[]> = {
  "leaf-pass-right": ["root-pass"],
  "leaf-fail": ["root-review", "review-fail"],
  "leaf-pass-left": ["root-review", "review-pass"],
};

const lessons = [
  { label: "Introduction", href: `${COURSE_PATH}/introduction`, depth: "Depth 0" },
  { label: "Decision Trees", href: `${COURSE_PATH}/decision-trees`, depth: "Depth 1" },
  { label: "Random Forest", href: `${COURSE_PATH}/random-forest`, depth: "Depth 2" },
] as const;

export default function Hero() {
  const [activePath, setActivePath] = useState<EdgeId[]>([]);

  const edgeClass = (id: EdgeId) =>
    activePath.includes(id)
      ? "stroke-zinc-100"
      : "stroke-zinc-600 transition-colors duration-300";

  const leafProps = (leafId: string) => ({
    onMouseEnter: () => setActivePath(LEAF_PATHS[leafId]),
    onMouseLeave: () => setActivePath([]),
    onFocus: () => setActivePath(LEAF_PATHS[leafId]),
    onBlur: () => setActivePath([]),
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 text-zinc-100 dark:border dark:border-zinc-800">
      {/* Faint grid, fading toward the text side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(161,161,170,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(161,161,170,0.1)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:linear-gradient(to_left,black,transparent_65%)]"
      />

      <div className="relative grid gap-14 px-8 py-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:px-14 lg:py-20">
        {/* ── Left: copy ─────────────────────────────────────────── */}
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-zinc-500">
            WebAIGen Academy
          </p>

          <h1 className="mt-6 text-5xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
            Learn machine learning{" "}
            <span className="relative whitespace-nowrap">
              from the roots up.
              {/* Underline drawn like a tree branch */}
              <svg
                aria-hidden="true"
                viewBox="0 0 300 14"
                className="absolute -bottom-3 left-0 w-full"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 10 Q 75 2 150 8 T 298 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="text-sky-400 motion-safe:[stroke-dasharray:320] motion-safe:[stroke-dashoffset:320] motion-safe:animate-[hero-draw_1s_ease-out_0.9s_forwards]"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">
            Every concept starts as a single split. Interactive lessons,
            runnable notebooks, and quizzes take you from your first decision
            boundary to full ensembles — entirely in the browser.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link href={`${COURSE_PATH}/introduction`} className={primaryButtonClass}>
              Make your first split
            </Link>
            <Link href={COURSE_PATH} className={secondaryButtonClass}>
              View syllabus
            </Link>
          </div>

          {/* Lesson trail, labeled by tree depth */}
          <div className="mt-12 flex flex-wrap gap-3">
            {lessons.map((lesson) => (
              <Link
                key={lesson.label}
                href={lesson.href}
                className="group rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition-colors hover:border-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-100"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500 group-hover:text-zinc-400">
                  {lesson.depth}
                </p>
                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {lesson.label}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Right: the living decision tree ────────────────────── */}
        <figure className="mx-auto w-full max-w-md lg:max-w-none">
          <svg
            viewBox="0 0 480 400"
            role="img"
            aria-label="Decision tree from the course dataset: if hours studied is at least 4, the model predicts pass; otherwise it checks review session attendance."
            className="w-full"
          >
            {/* Edges */}
            <g
              fill="none"
              strokeWidth="2"
              className="motion-safe:[stroke-dasharray:220] motion-safe:[stroke-dashoffset:220] motion-safe:animate-[hero-draw_0.8s_ease-out_forwards]"
            >
              <path d="M240 78 L132 176" className={edgeClass("root-review")} />
              <path d="M240 78 L354 176" className={edgeClass("root-pass")} />
              <path
                d="M126 234 L66 314"
                style={{ animationDelay: "0.35s" }}
                className={edgeClass("review-fail")}
              />
              <path
                d="M138 234 L210 314"
                style={{ animationDelay: "0.35s" }}
                className={edgeClass("review-pass")}
              />
            </g>

            {/* Edge labels */}
            <g className="fill-zinc-500 font-mono text-[11px] motion-safe:animate-[hero-fade_0.5s_ease-out_0.5s_both]">
              <text x="158" y="118">no</text>
              <text x="312" y="118">yes</text>
              <text x="72" y="272">no</text>
              <text x="192" y="272">yes</text>
            </g>

            {/* Root node */}
            <g className="motion-safe:animate-[hero-fade_0.5s_ease-out_both]">
              <rect x="158" y="30" width="164" height="48" rx="12" className="fill-zinc-900 stroke-zinc-700" strokeWidth="1.5" />
              <text x="240" y="50" textAnchor="middle" className="fill-zinc-200 font-mono text-[13px] font-semibold">
                hours ≥ 4?
              </text>
              <text x="240" y="67" textAnchor="middle" className="fill-zinc-500 font-mono text-[10px]">
                n = 8
              </text>
            </g>

            {/* Internal node */}
            <g className="motion-safe:animate-[hero-fade_0.5s_ease-out_0.25s_both]">
              <rect x="48" y="186" width="168" height="48" rx="12" className="fill-zinc-900 stroke-zinc-700" strokeWidth="1.5" />
              <text x="132" y="206" textAnchor="middle" className="fill-zinc-200 font-mono text-[13px] font-semibold">
                review session?
              </text>
              <text x="132" y="223" textAnchor="middle" className="fill-zinc-500 font-mono text-[10px]">
                n = 4
              </text>
            </g>

            {/* Leaf: pass (right) — y = 1 → blue */}
            <g
              tabIndex={0}
              className="cursor-pointer outline-none motion-safe:animate-[hero-fade_0.5s_ease-out_0.25s_both]"
              {...leafProps("leaf-pass-right")}
            >
              <rect
                x="300"
                y="186"
                width="108"
                height="48"
                rx="24"
                className="fill-sky-500/15 stroke-sky-400 transition-transform duration-200 [transform-box:fill-box] [transform-origin:center] hover:scale-105 motion-reduce:hover:scale-100"
                strokeWidth="1.5"
              />
              <text x="354" y="215" textAnchor="middle" className="pointer-events-none fill-sky-300 font-mono text-[13px] font-bold">
                pass
              </text>
            </g>

            {/* Leaf: fail — y = 0 → red */}
            <g
              tabIndex={0}
              className="cursor-pointer outline-none motion-safe:animate-[hero-fade_0.5s_ease-out_0.6s_both]"
              {...leafProps("leaf-fail")}
            >
              <rect
                x="14"
                y="324"
                width="104"
                height="48"
                rx="24"
                className="fill-red-500/15 stroke-red-400 transition-transform duration-200 [transform-box:fill-box] [transform-origin:center] hover:scale-105 motion-reduce:hover:scale-100"
                strokeWidth="1.5"
              />
              <text x="66" y="353" textAnchor="middle" className="pointer-events-none fill-red-300 font-mono text-[13px] font-bold">
                fail
              </text>
            </g>

            {/* Leaf: pass (left) — y = 1 → blue */}
            <g
              tabIndex={0}
              className="cursor-pointer outline-none motion-safe:animate-[hero-fade_0.5s_ease-out_0.6s_both]"
              {...leafProps("leaf-pass-left")}
            >
              <rect
                x="156"
                y="324"
                width="108"
                height="48"
                rx="24"
                className="fill-sky-500/15 stroke-sky-400 transition-transform duration-200 [transform-box:fill-box] [transform-origin:center] hover:scale-105 motion-reduce:hover:scale-100"
                strokeWidth="1.5"
              />
              <text x="210" y="353" textAnchor="middle" className="pointer-events-none fill-sky-300 font-mono text-[13px] font-bold">
                pass
              </text>
            </g>
          </svg>

          <figcaption className="mt-4 text-center font-mono text-xs text-zinc-500">
            The course dataset, as the model sees it. Hover a leaf to trace its
            path.
          </figcaption>
        </figure>
      </div>

      {/* Keyframes for the draw/fade animations */}
      <style jsx global>{`
        @keyframes hero-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes hero-fade {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}