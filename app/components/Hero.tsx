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
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

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
  }, [cardStep, isReady]);

  const isPreviousDisabled = isReady && activeIndex === 0;
  const isNextDisabled = isReady && activeIndex === heroCards.length - 1;

  return (
    <section className="relative overflow-hidden bg-white text-zinc-900  transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Panel 1 */}
        <div
          className="absolute -right-32 -top-28 h-[420px] w-[720px] bg-white/5 dark:bg-zinc-900/10"
          style={{
            clipPath: "polygon(25% 0%, 100% 0%, 100% 100%, 0% 35%)",
          }}
        />
        {/* Panel 2 */}
        <div
          className="absolute bottom-0 left-0 h-[360px] w-[620px] bg-white/5 dark:bg-zinc-900/10"
          style={{
            clipPath: "polygon(0 0, 26% 0, 100% 100%, 0 100%)",
          }}
        />
        {/* Subtle accent orb */}
        <div className="absolute bottom-10 right-20 h-52 w-52 rounded-full bg-sky-400/10 blur-3xl dark:bg-sky-500/10" />
      </div>

      <div className="relative grid gap-12 px-7 py-14 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12 lg:px-14 lg:py-20">
        {/* Left */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#FF6F00] dark:text-[#FFB74D]">
            WebAIGen Academy
          </p>

          <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-[1.02] tracking-tight text-zinc-950 dark:text-white sm:text-6xl">
            Level up your
            <br />
            AI skills.
          </h1>

          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-lg">
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
              className="rounded-full border border-green-900 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-white dark:hover:bg-zinc-700/70"
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
            {heroCards.map((card, index) => (
              <Link
                key={card.slug}
                href={card.href}
                className="group w-[84%] shrink-0 snap-start overflow-hidden rounded-3xl bg-white text-zinc-900 transition duration-200 hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transition-none motion-reduce:hover:translate-y-0 dark:bg-zinc-900 dark:text-zinc-100 sm:w-[58%] lg:w-[calc(50%-10px)]"
              >
                <div className="bg-zinc-50 px-5 py-3 dark:bg-zinc-800">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-500 dark:text-zinc-400">
                    Featured lesson
                  </p>
                </div>

                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  {/* <div className="absolute left-4 top-4 z-10 rounded-xl bg-white px-3 py-1.5 shadow-sm dark:bg-zinc-900">
                    <span className="text-[11px] font-black tracking-tight text-zinc-900 dark:text-white">
                      WebAIGen
                    </span>
                  </div> */}

                  <div className="absolute bottom-4 right-4 z-10 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur dark:bg-zinc-800/60 dark:text-zinc-200">
                    ML
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 px-5 pb-6 pt-5">
                  <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:underline group-hover:underline-offset-4">
                    {card.title}
                  </h3>

                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    {card.provider}
                  </p>

                  <div className="mt-4 space-y-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-400">
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
            <div className="flex items-center gap-4 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-zinc-800 shadow-lg dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100">
              <button
                type="button"
                onClick={() => scrollToCard(activeIndex - 1)}
                disabled={isPreviousDisabled}
                aria-label="Previous lesson"
                className="text-zinc-800 cursor-pointer transition-opacity disabled:opacity-30 dark:text-zinc-100"
              >
                <Chevron direction="left" />
              </button>

              <div className="flex items-center gap-2.5 cursor-pointer">
                {heroCards.map((card, index) => (
                  <button
                    key={card.slug}
                    type="button"
                    onClick={() => scrollToCard(index)}
                    aria-label={`Go to lesson ${index + 1} of ${heroCards.length}`}
                    aria-current={isReady && index === activeIndex ? true : undefined}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-6 bg-[#FF6F00] dark:bg-[#FFB74D]"
                        : "w-2.5 bg-zinc-300 cursor-pointer hover:bg-zinc-400 dark:bg-zinc-700 dark:hover:bg-zinc-500"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToCard(activeIndex + 1)}
                disabled={isNextDisabled}
                aria-label="Next lesson"
                className="text-zinc-800 cursor-pointer transition-opacity disabled:opacity-30 dark:text-zinc-100"
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
