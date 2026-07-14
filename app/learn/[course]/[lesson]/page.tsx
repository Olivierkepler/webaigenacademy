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
import Rightbar from "@/app/components/rightbar";
import LessonPager from "@/app/components/LessonPager";

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
      <section className="scrollbar-fancy ml-[var(--sidebar-width)] mr-[var(--rightbar-width)] flex h-[calc(100vh-var(--navbar-height)-2.75rem)] flex-row gap-4 overflow-y-auto px-6 py-6 transition-[margin] duration-300 ease-out motion-reduce:transition-none lg:px-8 lg:py-8">   <div className="flex w-full min-w-0 flex-col gap-6 px-8">
      <LessonPager
    previousLesson={previousLesson}
    nextLesson={nextLesson}
  />
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

         {/* Pill-style lesson navigation — replaces the old prev/next block */} 
         {(previousLesson || nextLesson) && (
  <nav
    aria-label="Lesson navigation"
    className="flex items-center justify-center gap-6 border-t border-zinc-200 pt-8 dark:border-zinc-800"
  >
    {previousLesson ? (
      <Link
        href={`/learn/${previousLesson.course}/${previousLesson.slug}`}
        className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:border-zinc-400 hover:bg-[#003334]/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950 lg:px-6 lg:text-base"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Previous
      </Link>
    ) : (
      <span />
    )}

    {nextLesson ? (
      <Link
        href={`/learn/${nextLesson.course}/${nextLesson.slug}`}
        className="group inline-flex items-center gap-2.5 rounded-full border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-700 transition-colors duration-200 hover:border-zinc-400 hover:bg-[#003334]/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:border-zinc-500 dark:hover:bg-zinc-800 dark:focus-visible:ring-offset-zinc-950 lg:px-6 lg:text-base"
      >
        Next lesson
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </Link>
    ) : (
      <span />
    )}
  </nav>
)}

<p className="h-10"> <br /> </p>
        </div>

      
      </section>
      <Rightbar video={lesson.video} />
    </main>
  );
}