"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
    
const COURSE_PATH = "/learn/machine-learning";

type HeroCard = {
  slug: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  href: string;
  visual: string;
};

const heroCards: HeroCard[] = [
  {
    slug: "introduction",
    title: "Introduction to Machine Learning",
    provider: "WebAIGen Academy",
    duration: "1 week to complete",
    level: "Introductory level",
    href: `${COURSE_PATH}/introduction`,
    visual: "from-orange-500 via-zinc-800 to-zinc-950",
  },
  {
    slug: "decision-trees",
    title: "Decision Trees: Splits, Impurity, and Pruning",
    provider: "WebAIGen Academy",
    duration: "2 weeks to complete",
    level: "Introductory level",
    href: `${COURSE_PATH}/decision-trees`,
    visual: "from-emerald-500 via-zinc-800 to-zinc-950",
  },
  {
    slug: "random-forest",
    title: "Random Forest: Ensembles That Generalize",
    provider: "WebAIGen Academy",
    duration: "1 week to complete",
    level: "Intermediate level",
    href: `${COURSE_PATH}/random-forest`,
    visual: "from-sky-500 via-zinc-800 to-zinc-950",
  },
];

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GaugeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 12l4-3" strokeLinecap="round" />
    </svg>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      className={`h-4 w-4 ${direction === "left" ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Hero() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const cardStep = useCallback(() => {
    const track = trackRef.current;

    if (!track || track.children.length < 2) {
      return track?.clientWidth ?? 0;
    }

    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;

    return second.offsetLeft - first.offsetLeft;
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const clamped = Math.max(0, Math.min(index, heroCards.length - 1));

      track.scrollTo({
        left: clamped * cardStep(),
        behavior: "smooth",
      });

      setActiveIndex(clamped);
    },
    [cardStep]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const step = cardStep();
      if (step > 0) {
        setActiveIndex(Math.round(track.scrollLeft / step));
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    return () => track.removeEventListener("scroll", onScroll);
  }, [cardStep]);

  return (
    <section className="relative overflow-hidden  bg-zinc-950 text-zinc-100 shadow-2xl">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(249,115,22,0.28),transparent_32%),linear-gradient(to_bottom_right,#09090b,#18181b,#09090b)]" /> */}

        <div
          className="absolute -right-32 -top-28 h-[420px] w-[720px] bg-white/[0.04]"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 35%)",
          }}
        />

        <div
          className="absolute bottom-0 left-0 h-[360px] w-[620px] bg-white/[0.035]"
          style={{
            clipPath: "polygon(0 0, 26% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* <div className="absolute left-10 top-10 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" /> */}
        <div className="absolute bottom-10 right-20 h-52 w-52 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <div className="relative grid gap-12 px-7 py-14 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:px-14 lg:py-20">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
            WebAIGen Academy
          </p>

          <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-[1.02] tracking-tight text-white sm:text-6xl">
            Level up your
            <br />
            AI skills.
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-300 sm:text-lg">
            Learn machine learning with interactive browser-based lessons,
            runnable Python notebooks, and quick quizzes that help you build
            confidence as you go.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4 font-medium">
            <Link
              href={`${COURSE_PATH}/introduction`}
              className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Explore courses
            </Link>

            <Link
              href={COURSE_PATH}
              className="rounded-full border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15"
            >
              View syllabus
            </Link>
          </div>
        </div>

        {/* Right */}
        <div className="min-w-0">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Featured lessons"
          >
            {heroCards.map((card) => (
              <Link
                key={card.slug}
                href={card.href}
                className="group w-[84%] shrink-0 snap-start overflow-hidden rounded-3xl bg-white text-zinc-900 shadow-2xl shadow-black/20 transition duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-[58%] lg:w-[calc(50%-10px)]"
              >
                <div className="bg-zinc-50 px-5 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500">
                    Featured lesson
                  </p>
                </div>

                <div className={`relative h-36 bg-zinc-50`}>
                    <Image src="/images/machine-learning.jpg" alt="Machine Learning" width={1200} height={600} />
                  {/* <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_34%)]" /> */}

                  <div className="absolute left-4 top-4 rounded-xl bg-white px-3 py-1.5 shadow-sm">
                    <span className="text-[11px] font-black tracking-tight text-zinc-900">
                      WebAIGen
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    ML
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-5 pb-6 pt-5">
                  <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {card.title}
                  </h3>

                  <p className="text-sm font-medium text-zinc-600">
                    {card.provider}
                  </p>

                  <div className="mt-4 space-y-2.5 text-sm font-medium text-zinc-700">
                    <p className="flex items-center gap-2.5">
                      <ClockIcon />
                      {card.duration}
                    </p>

                    <p className="flex items-center gap-2.5">
                      <GaugeIcon />
                      {card.level}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 flex justify-center lg:justify-start">
            <div className="flex items-center gap-4 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 shadow-lg backdrop-blur">
              <button
                type="button"
                onClick={() => scrollToCard(activeIndex - 1)}
                disabled={activeIndex === 0}
                aria-label="Previous lesson"
                className="text-white transition-opacity disabled:opacity-30"
              >
                <Chevron direction="left" />
              </button>

              <div className="flex items-center gap-2.5">
                {heroCards.map((card, index) => (
                  <button
                    key={card.slug}
                    type="button"
                    onClick={() => scrollToCard(index)}
                    aria-label={`Go to lesson ${index + 1} of ${heroCards.length}`}
                    aria-current={index === activeIndex}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-orange-400"
                        : "w-2.5 bg-white/35 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToCard(activeIndex + 1)}
                disabled={activeIndex === heroCards.length - 1}
                aria-label="Next lesson"
                className="text-white transition-opacity disabled:opacity-30"
              >
                <Chevron direction="right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}