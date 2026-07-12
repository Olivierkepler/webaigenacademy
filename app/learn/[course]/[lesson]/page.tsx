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
import {
  cardPadding,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/app/lib/typography";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubNav from "@/app/components/SubNav";

type PageProps = {
  params: Promise<{
    course: string;
    lesson: string;
  }>;
};

const cardClass =
  " border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

export default async function LessonPage({ params }: PageProps) {
  const { course, lesson: lessonSlug } = await params;

  const lesson = lessons.find(
    (item) => item.course === course && item.slug === lessonSlug
  );

  if (!lesson) {
    notFound();
  }

  // Sorted by order so the SubNav and prev/next navigation
  // follow lesson order, not data-file order.
  const courseLessons = lessons
    .filter((item) => item.course === course)
    .sort((a, b) => a.order - b.order);

  const currentIndex = courseLessons.findIndex((item) => item.slug === lessonSlug);
  const previousLesson =
    currentIndex > 0 ? courseLessons[currentIndex - 1] : undefined;
  const nextLesson =
    currentIndex < courseLessons.length - 1
      ? courseLessons[currentIndex + 1]
      : undefined;

  return (
    <main className="bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* W3Schools-style topic bar — offset past the fixed sidebar on desktop */}
      <div className="lg:ml-[var(--sidebar-width)]">
        <SubNav course={course} />
      </div>

      <LessonSidebar currentCourse={course} currentLesson={lessonSlug} />

      {/* Height now also subtracts the h-11 (2.75rem) subnav bar */}
      <section className="ml-[var(--sidebar-width)]   flex h-[calc(100vh-var(--navbar-height)-2.75rem)] flex-row gap-4 space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
        <div className="flex w-5/6 flex-col gap-6 xl:w-4/5 pl-8">
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

          <div className={`${cardClass} ${cardPadding} text-lg lg:text-xl`}>
            <LessonContent content={lesson.content} hideTitle />
          </div>

          <div className="text-base lg:text-lg">
            <LessonVisualizations visualizations={lesson.visualizations} />
          </div>

          <LessonSection
            label="Practice"
            title="Try It Yourself"
            description="Open the practice lab to complete the starter code in the notebook."
          >
            <div className="scale-105">
              <NotebookModal
                notebook={lesson.notebook}
                lessonTitle={lesson.title}
              />
            </div>
          </LessonSection>

          <div className="text-base lg:text-lg">
            <Quiz quiz={lesson.quiz} />
          </div>

          <div className="ml-20 scale-110">
            <MarkCompleteButton course={course} lessonSlug={lessonSlug} />
          </div>

          <div className="text-base lg:text-lg">
            <KeyTakeaways takeaways={lesson.takeaways} />
          </div>

          {(previousLesson || nextLesson) && (
            <nav
              aria-label="Lesson navigation"
              className="flex items-center justify-between gap-6 border-t border-zinc-200 pt-8 text-lg dark:border-zinc-800"
            >
              {previousLesson ? (
                <Link
                  href={`/learn/${previousLesson.course}/${previousLesson.slug}`}
                  className={`${secondaryButtonClass} px-8 py-4 text-base lg:text-lg`}
                >
                  Previous Lesson
                </Link>
              ) : (
                <span />
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${nextLesson.course}/${nextLesson.slug}`}
                  className={`${primaryButtonClass} px-8 py-4 text-base lg:text-lg`}
                >
                  Next Lesson
                </Link>
              ) : (
                <span />
              )}
            </nav>
          )}
        </div>

        {/* Pushed down by the subnav height (top-28 → +2.75rem) */}
        <div className="fixed right-4 top-[9.75rem] flex w-53 flex-col gap-4 border-l-4 border-[#FF6F00] bg-white p-6 shadow-sm dark:bg-zinc-950">
          <h2 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Related Lessons
          </h2>
        </div>
      </section>
    </main>
  );
}