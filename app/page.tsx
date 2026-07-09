import Link from "next/link";
import { lessons } from "@/data/lessons";
import Background from "@/app/components/background";
import Footer from "./components/footer";
import CareerGoalBanner from "@/app/components/CareerGoalBanner";
import Chatbot from "@/app/components/Chatbot";
import FAQ from "@/app/components/FAQ";
import RoadmapComingSoon from "@/app/components/RoadmapComingSoon";
import CommunitySection from "@/app/components/CommunitySection";
import {
  accent,
  accentBadgeClass,
  primaryButtonClass,
  secondaryButtonClass,
  cardPadding,
  typography,
} from "@/app/lib/typography";
import Hero from "./components/Hero";
import BlinkingRobot from "./components/BlinkingRobot";
import RobotEyes from "./components/RobotEyes";
import Testimonials from "./components/Testimonials";
import PartnerLogos from "./components/PartnerLogos";
import EligibleEducation from "./components/EligibleEducation";
import RevealOnScroll from "./components/RevealOnScroll";

const COURSE_SLUG = "machine-learning";
const COURSE_PATH = `/learn/${COURSE_SLUG}`;
const INTRO_PATH = `${COURSE_PATH}/introduction`;

const LESSON_LABELS: Record<string, string> = {
  introduction: "Introduction",
  "decision-trees": "Decision Trees",
  "random-forest": "Random Forest",
};

const courseLessons = lessons.filter((lesson) => lesson.course === COURSE_SLUG);
const courseTitle = courseLessons[0]?.courseTitle ?? "Machine Learning";

const features = [
  {
    title: "Interactive Practice Labs",
    description:
      "Run Python notebooks in your browser with JupyterLite—no local setup required.",
  },
  {
    title: "Step-by-Step Lessons",
    description:
      "Clear explanations and examples that build concepts one section at a time.",
  },
  {
    title: "Quick Quizzes",
    description:
      "Check your understanding with short quizzes after each lesson.",
  },
  {
    title: "Browser-Based Learning",
    description: "Learn from any device. Everything runs in the browser.",
  },
] as const;

const comingSoon = [
  "Deep Learning",
  "Computer Vision",
  "Natural Language Processing",
  "Python for AI",
] as const;

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

/** Renders the natural-language separator for the lesson list: "A and B" / "A, B, and C". */
function lessonSeparator(index: number, total: number): string {
  if (index === 0) return "";
  const isLast = index === total - 1;
  if (!isLast) return ", ";
  return total > 2 ? ", and " : " and ";
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    

      <Hero />
      <RevealOnScroll>
        <CareerGoalBanner />
      </RevealOnScroll>
      {/* <RoadmapComingSoon />
      <PartnerLogos />     */}
      <RevealOnScroll delay={0.05}>
        <EligibleEducation />
      </RevealOnScroll>
      <RevealOnScroll delay={0.08}>
        <CommunitySection />
      </RevealOnScroll>

      {/* Content — lifted above the background layer */}
      {/* <div className="relative z-10 mx-auto max-w-6xl space-y-16 px-6 py-12 lg:px-10 lg:py-16">
        <section className="text-center">
          <p className={typography.label}>WebAIGen Academy</p>
          <h1 className={`mx-auto mt-4 max-w-4xl ${typography.hero}`}>
            Learn AI and Machine Learning the simple way.
          </h1>
          <p className={`mx-auto mt-6 max-w-2xl ${typography.subtitle}`}>
            Interactive lessons, browser-based notebooks, quizzes, and
            step-by-step explanations.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href={INTRO_PATH} className={primaryButtonClass}>
              Start Learning
            </Link>
            <Link href={COURSE_PATH} className={secondaryButtonClass}>
              View Course
            </Link>
          </div>
        </section>

        <section className={`${cardClass} ${cardPadding}`}>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <p className={typography.label}>Featured Course</p>
              <h2 className={`mt-3 ${typography.sectionTitle}`}>
                {courseTitle}
              </h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className={accentBadgeClass}>
                  <span className={typography.badge}>Beginner</span>
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <span className={typography.badge}>
                    {courseLessons.length}{" "}
                    {courseLessons.length === 1 ? "lesson" : "lessons"} available
                  </span>
                </span>
              </div>
              <p className={`mt-6 ${typography.body}`}>
                Includes{" "}
                {courseLessons.map((lesson, index) => (
                  <span key={lesson.slug}>
                    {lessonSeparator(index, courseLessons.length)}
                    <Link
                      href={`/learn/${lesson.course}/${lesson.slug}`}
                      className={`font-medium underline-offset-2 hover:underline ${accent.text}`}
                    >
                      {LESSON_LABELS[lesson.slug] ?? lesson.title}
                    </Link>
                  </span>
                ))}
                .
              </p>
            </div>
            <Link
              href={COURSE_PATH}
              className={`shrink-0 ${primaryButtonClass}`}
            >
              Continue Course
            </Link>
          </div>
        </section>

        <section>
          <div className="text-center">
            <p className={typography.label}>Platform</p>
            <h2 className={`mt-3 ${typography.sectionTitle}`}>
              Platform Features
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`${cardClass} p-6 transition-shadow duration-200 hover:shadow-md motion-reduce:transition-none`}
              >
                <h3 className={typography.cardTitle}>{feature.title}</h3>
                <p className={`mt-3 ${typography.caption}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={`${cardClass} ${cardPadding}`}>
          <p className={typography.label}>Roadmap</p>
          <h2 className={`mt-3 ${typography.sectionTitle}`}>Coming Soon</h2>
          <p className={`mt-4 max-w-2xl ${typography.body}`}>
            More courses are on the way. Here is what we are building next.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {comingSoon.map((topic) => (
              <div
                key={topic}
                className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6 text-center dark:border-zinc-700 dark:bg-zinc-950"
              >
                <p className={`font-medium ${typography.body}`}>{topic}</p>
                <p className={`mt-2 ${typography.caption}`}>Coming soon</p>
              </div>
            ))}
          </div>
        </section>
      </div> */}
      <RevealOnScroll delay={0.1}>
        <FAQ />
      </RevealOnScroll>
      <RevealOnScroll delay={0.12}>
        <Testimonials />
      </RevealOnScroll>
      <Chatbot />

      {/* <BlinkingRobot /> */}
      <RevealOnScroll delay={0.14}>
        <Footer />
      </RevealOnScroll>
    
    </main>
  );
}