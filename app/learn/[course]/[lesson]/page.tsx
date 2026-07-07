import NotebookModal from "../../../components/NotebookModal";
import LessonSidebar from "../../../components/LessonSidebar";
import LessonContent from "../../../components/LessonContent";
import LessonHeader from "../../../components/LessonHeader";
import LessonSection from "../../../components/LessonSection";
import KeyTakeaways from "../../../components/KeyTakeaways";
import MarkCompleteButton from "../../../components/MarkCompleteButton";
import LessonVisualizations from "../../../components/LessonVisualizations";
import Quiz from "../../../components/Quiz";
import { lessons } from "@/data/lessons";
import { cardPadding, typography } from "@/app/lib/typography";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{
    course: string;
    lesson: string;
  }>;
};

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

export default async function LessonPage({ params }: PageProps) {
  const { course, lesson: lessonSlug } = await params;

  const lesson = lessons.find(
    (item) => item.course === course && item.slug === lessonSlug
  );

  if (!lesson) {
    notFound();
  }

  const courseLessons = lessons.filter((item) => item.course === course);
  const currentIndex = courseLessons.findIndex((item) => item.slug === lessonSlug);
  const previousLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : undefined;

  return (
    <main className="bg-zinc-100 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <LessonSidebar currentCourse={course} currentLesson={lessonSlug} />

      <section className="ml-72 h-[calc(100vh-var(--navbar-height))] space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className={cardClass}>
          <LessonHeader
            courseTitle={lesson.courseTitle}
            lessonNumber={lesson.order}
            totalLessons={courseLessons.length}
            title={lesson.title}
            description={lesson.description}
            difficulty={lesson.difficulty}
            duration={lesson.duration}
            downloadHref={`/lessons/${lesson.download}`}
          />
        </div>

        <div className={`${cardClass} ${cardPadding}`}>
          <LessonContent content={lesson.content} hideTitle />
        </div>

        <LessonVisualizations visualizations={lesson.visualizations} />

        <LessonSection
          label="Practice"
          title="Try It Yourself"
          description="Open the practice lab to complete the starter code in the notebook."
        >
          <NotebookModal notebook={lesson.notebook} />
        </LessonSection>

        <Quiz quiz={lesson.quiz} />

        <MarkCompleteButton course={course} lessonSlug={lessonSlug} />

        <KeyTakeaways takeaways={lesson.takeaways} />

        {(previousLesson || nextLesson) && (
          <nav
            aria-label="Lesson navigation"
            className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-6 dark:border-zinc-800"
          >
            {previousLesson ? (
              <Link
                href={`/learn/${previousLesson.course}/${previousLesson.slug}`}
                className={`inline-flex items-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-zinc-800 transition hover:border-emerald-500 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:hover:border-emerald-500 dark:hover:text-emerald-400 ${typography.button}`}
              >
                Previous Lesson
              </Link>
            ) : (
              <span />
            )}

            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.course}/${nextLesson.slug}`}
                className={`inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 text-white shadow-sm transition hover:bg-emerald-500 ${typography.button}`}
              >
                Next Lesson
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </section>
    </main>
  );
}
