"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "./Navbar";

const COURSE_PATH = "/learn/machine-learning";

type HeroCard = {
  slug: string;
  title: string;
  provider: string;
  duration: string;
  level: string;
  href: string;
  image: string;
};

const heroCards: HeroCard[] = [
  {
    slug: "introduction",
    title: "Introduction to Machine Learning",
    provider: "WebAIGen Academy",
    duration: "1 week to complete",
    level: "Introductory level",
    href: `${COURSE_PATH}/introduction`,
    image: "/images/technician2.jpeg",
  },
  {
    slug: "decision-trees",
    title: "Decision Trees: Splits, Impurity, and Pruning",
    provider: "WebAIGen Academy",
    duration: "2 weeks to complete",
    level: "Introductory level",
    href: `${COURSE_PATH}/decision-trees`,
    image: "/images/technicians.jpg",
  },
  {
    slug: "random-forest",
    title: "Random Forest: Ensembles That Generalize",
    provider: "WebAIGen Academy",
    duration: "1 week to complete",
    level: "Intermediate level",
    href: `${COURSE_PATH}/random-forest`,
    image: "/images/technician2.jpeg",
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
  const [isReady, setIsReady] = useState(false);

  const visibleCards = 2;
  const totalSlides = Math.max(1, heroCards.length - visibleCards + 1);

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track || track.children.length < 2) return track?.clientWidth ?? 0;

    const first = track.children[0] as HTMLElement;
    const second = track.children[1] as HTMLElement;

    return second.offsetLeft - first.offsetLeft;
  }, []);

  const scrollToCard = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!track) return;

      const clamped = Math.max(0, Math.min(index, totalSlides - 1));

      track.scrollTo({
        left: clamped * cardStep(),
        behavior: "smooth",
      });

      setActiveIndex(clamped);
    },
    [cardStep, totalSlides]
  );

  useEffect(() => setIsReady(true), []);

  useEffect(() => {
    if (!isReady) return;

    const track = trackRef.current;
    if (!track) return;

    const onScroll = () => {
      const step = cardStep();

      if (step > 0) {
        const nextIndex = Math.round(track.scrollLeft / step);
        setActiveIndex(Math.min(nextIndex, totalSlides - 1));
      }
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    return () => track.removeEventListener("scroll", onScroll);
  }, [cardStep, isReady, totalSlides]);

  const isPreviousDisabled = isReady && activeIndex === 0;
  const isNextDisabled = isReady && activeIndex >= totalSlides - 1;

  return (
    <section className="relative overflow-hidden bg-white pt-20 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="grid h-full w-full grid-cols-[45%_55%] bg-gradient-to-br from-white via-[#FCFCFC] to-[#F7F7F8] dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900">
          <div className="flex items-center justify-center overflow-hidden">
            <div className="grid -rotate-12 gap-6 opacity-90">
              <div className="h-48 w-72 rounded-[2.5rem] bg-[#EEF7F6] dark:bg-zinc-900" />

              <div className="flex gap-6">
                <div className="h-72 w-44 rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] dark:bg-zinc-900" />
                <div className="h-72 w-52 rounded-[2rem] bg-[#F5FAF9] dark:bg-zinc-900/80" />
              </div>

              <div className="flex gap-6">
                <div className="h-40 w-64 rounded-[2rem] bg-[#FFF6EE] dark:bg-zinc-900/70" />
                <div className="h-40 w-40 rounded-full border border-[#D8E7E5] bg-white shadow-[0_20px_60px_rgba(14,92,88,.08)] dark:border-zinc-800 dark:bg-zinc-900" />
              </div>
            </div>
          </div>

          <div />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.025)_1px,transparent_1px)] bg-[size:48px_48px] opacity-20 dark:opacity-10" />
        <div className="absolute left-[-10%] top-[5%] h-[550px] w-[550px] rounded-full bg-[#0E5C58]/5 blur-[120px]" />
        <div className="absolute left-[18%] bottom-[8%] h-[180px] w-[180px] rounded-full bg-orange-400/8 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-full gap-16 px-8 pb-24 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20 lg:px-24 lg:pb-28">
        <div>
          <h2 className="max-w-[560px] text-[52px] font-black italic leading-[0.9] tracking-tight sm:text-[60px]">
            Level up your
            <br />
            AI skills.
          </h2>

          <p className="mt-7 max-w-xl text-[20px] leading-8 text-zinc-600 dark:text-zinc-400">
            Learn machine learning with interactive browser-based lessons,
            runnable Python notebooks, and quick quizzes that help you build
            confidence as you go.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={`${COURSE_PATH}/introduction`}
              className="rounded-full bg-orange-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/15 transition hover:bg-orange-600 hover:shadow-orange-500/30"
            >
              Explore courses
            </Link>

            <Link
              href={COURSE_PATH}
              className="rounded-full border border-zinc-300 bg-white/80 px-7 py-3.5 text-sm font-semibold text-zinc-900 backdrop-blur transition hover:bg-white dark:border-zinc-700 dark:bg-zinc-900/70 dark:text-white dark:hover:bg-zinc-900"
            >
              View syllabus
            </Link>
          </div>
        </div>

        <div className="min-w-0">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-label="Featured lessons"
          >
            {heroCards.map((card, index) => (
              <Link
                key={card.slug}
                href={card.href}
                className="group w-[86%] shrink-0 snap-start overflow-hidden rounded-[0.75rem] border border-zinc-200/60 bg-white text-zinc-950 transition duration-300 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:border-zinc-800/80 dark:bg-zinc-900 dark:text-zinc-100 sm:w-[58%] lg:w-[calc(50%-10px)]"
              >
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 86vw, 50vw"
                    priority={index === 0}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                    Featured
                  </div>

                  <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white px-3 py-1 text-xs font-bold text-zinc-950 shadow-md">
                    ML
                  </div>
                </div>

                <div className="px-5 pb-6 pt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
                    {card.provider}
                  </p>

                  <h3 className="mt-3 text-xl font-bold leading-snug tracking-[-0.02em] text-zinc-950 transition group-hover:text-[#0E5C58] dark:text-white dark:group-hover:text-[#85D7CE]">
                    {card.title}
                  </h3>

                  <div className="mt-5 space-y-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    <p className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <ClockIcon />
                      </span>
                      {card.duration}
                    </p>

                    <p className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        <GaugeIcon />
                      </span>
                      {card.level}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-7 flex justify-center lg:justify-start">
            <div className="flex items-center gap-4 rounded-full bg-white/90 px-3 py-2 text-zinc-800 shadow-lg backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100">
              <button
                type="button"
                onClick={() => scrollToCard(activeIndex - 1)}
                disabled={isPreviousDisabled}
                aria-label="Previous lessons"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800"
              >
                <Chevron direction="left" />
              </button>

              <div className="flex items-center gap-2.5">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollToCard(index)}
                    aria-label={`Go to slide ${index + 1} of ${totalSlides}`}
                    aria-current={
                      isReady && index === activeIndex ? true : undefined
                    }
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-7 bg-orange-500"
                        : "w-2.5 bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToCard(activeIndex + 1)}
                disabled={isNextDisabled}
                aria-label="Next lessons"
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-zinc-800"
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