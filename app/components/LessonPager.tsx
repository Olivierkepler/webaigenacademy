import Link from "next/link";

type LessonRef = {
  course: string;
  slug: string;
  title?: string;
};

type LessonPagerProps = {
  previousLesson?: LessonRef;
  nextLesson?: LessonRef;
  /** "float" pins it top-right of the nearest `relative` parent;
      "inline" renders it in normal flow (e.g. inside a header row). */
  variant?: "float" | "inline";
};

const arrowButtonClass = [
  "inline-flex h-10 w-10 items-center justify-center rounded-full",
  "text-[#0B3B38] dark:text-emerald-300",
  "transition-colors duration-200",
  "hover:bg-zinc-100 dark:hover:bg-zinc-800",
  "focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2",
  "focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950",
].join(" ");

const disabledClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full text-zinc-300 dark:text-zinc-700 cursor-not-allowed";

function ArrowLeft() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export default function LessonPager({
  previousLesson,
  nextLesson,
  variant = "float",
}: LessonPagerProps) {
  if (!previousLesson && !nextLesson) return null;

  const positionClass =
    variant === "float"
      ? "relative flex items-end gap-1"
      : "";

  return (
    <nav
      aria-label="Lesson navigation"
      className="relative flex items-end gap-1 justify-end"
    >
      {previousLesson ? (
        <Link
          href={`/learn/${previousLesson.course}/${previousLesson.slug}`}
          aria-label={
            previousLesson.title
              ? `Previous lesson: ${previousLesson.title}`
              : "Previous lesson"
          }
          title={previousLesson.title ?? "Previous lesson"}
          className={arrowButtonClass}
        >
          <ArrowLeft />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ArrowLeft />
        </span>
      )}

      {nextLesson ? (
        <Link
          href={`/learn/${nextLesson.course}/${nextLesson.slug}`}
          aria-label={
            nextLesson.title
              ? `Next lesson: ${nextLesson.title}`
              : "Next lesson"
          }
          title={nextLesson.title ?? "Next lesson"}
          className={arrowButtonClass}
        >
          <ArrowRight />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ArrowRight />
        </span>
      )}
    </nav>
  );
}