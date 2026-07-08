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

      <section className="ml-82 flex flex-row  gap-4 h-[calc(100vh-var(--navbar-height))] space-y-6 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-6 w-5/6 xl:w-4/5">
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
            <NotebookModal notebook={lesson.notebook} />
          </div>
        </LessonSection>

        <div className="text-base lg:text-lg">
          <Quiz quiz={lesson.quiz} />
        </div>

        <div className="scale-110 ml-20">
          <MarkCompleteButton course={course} lessonSlug={lessonSlug} />
        </div>

        <div className="text-base lg:text-lg">
          <KeyTakeaways takeaways={lesson.takeaways} />
        </div>

        {(previousLesson || nextLesson) && (
          <nav
            aria-label="Lesson navigation"
            className="flex items-center justify-between gap-6  border-t border-zinc-200 pt-8 dark:border-zinc-800 text-lg"
          >
            {previousLesson ? (
              <Link
                href={`/learn/${previousLesson.course}/${previousLesson.slug}`}
                className={`${secondaryButtonClass} text-base lg:text-lg px-8 py-4`}
              >
                Previous Lesson
              </Link>
            ) : (
              <span />
            )}

            {nextLesson ? (
              <Link
                href={`/learn/${nextLesson.course}/${nextLesson.slug}`}
                className={`${primaryButtonClass} text-base lg:text-lg px-8 py-4`}
              >
                Next Lesson
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>



      <div className="fixed top-28 right-4 flex flex-col gap-4 w-53 border-l-4 border-[#FF6F00] bg-white shadow-sm p-6">
        <h2 className="font-semibold text-lg mb-2">Related Lessons</h2>
      </div>
 
 
      </section>
    </main>
  );
}
