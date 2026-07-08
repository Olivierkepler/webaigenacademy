import { notFound } from "next/navigation";
import { lessons } from "@/data/lessons";
import { cardPadding, typography } from "@/app/lib/typography";
import {
  CourseCurriculum,
  CourseOverviewHeader,
} from "@/app/components/CourseOverviewClient";

const COURSE_DESCRIPTION =
  "Learn machine learning step by step with interactive lessons, browser-based notebooks, and quizzes.";

const features = [
  {
    title: "Interactive Practice Labs",
    description:
      "Run Python notebooks in your browser with JupyterLite—no local setup required.",
  },
  {
    title: "Quick Quizzes",
    description:
      "Check your understanding with short quizzes after each lesson.",
  },
  {
    title: "Downloadable Notebooks",
    description:
      "Download starter notebooks from each lesson to practice offline.",
  },
] as const;

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

type PageProps = {
  params: Promise<{
    course: string;
  }>;
};

export default async function CoursePage({ params }: PageProps) {
  const { course } = await params;

  const courseLessons = lessons
    .filter((lesson) => lesson.course === course)
    .sort((a, b) => a.order - b.order);

  if (courseLessons.length === 0) {
    notFound();
  }

  const courseTitle = courseLessons[0].courseTitle;
  const difficulty = courseLessons[0].difficulty;

  return (
    <main className="min-h-screen bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 ">
      <div className="mx-auto max-w-4xl space-y-16 px-6 py-12 lg:px-10 lg:py-16">
        <CourseOverviewHeader
          course={course}
          courseTitle={courseTitle}
          difficulty={difficulty}
          description={COURSE_DESCRIPTION}
          lessons={courseLessons.map((lesson) => ({
            slug: lesson.slug,
            title: lesson.title,
            order: lesson.order,
            section: lesson.section,
            description: lesson.description,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
          }))}
        />

        <CourseCurriculum
          course={course}
          lessons={courseLessons.map((lesson) => ({
            slug: lesson.slug,
            title: lesson.title,
            order: lesson.order,
            section: lesson.section,
            description: lesson.description,
            duration: lesson.duration,
            difficulty: lesson.difficulty,
          }))}
        />

        <section>
          <p className={typography.label}>Included</p>
          <h2 className={`mt-3 ${typography.sectionTitle}`}>Features</h2>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className={`${cardClass} p-6`}>
                <h3 className={typography.cardTitle}>{feature.title}</h3>
                <p className={`mt-3 ${typography.caption}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
