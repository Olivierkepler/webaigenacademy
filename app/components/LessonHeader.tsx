import { cardPadding, typography } from "@/app/lib/typography";

type LessonHeaderProps = {
  courseTitle: string;
  lessonNumber: number;
  totalLessons: number;
  title: string;
  description: string;
  difficulty: string;
  duration: string;
  downloadHref: string;
};

export default function LessonHeader({
  courseTitle,
  lessonNumber,
  totalLessons,
  title,
  description,
  difficulty,
  duration,
  downloadHref,
}: LessonHeaderProps) {
  return (
    <header
      className={` ${cardPadding}`}
    >
      {/* <div className="flex flex-wrap items-center gap-3">
        <p className={typography.label}>{courseTitle}</p>
        <span
          className={`rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300 ${typography.badge}`}
        >
          Lesson {lessonNumber} of {totalLessons}
        </span>
        <span
          className={`rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400 ${typography.badge}`}
        >
          {difficulty}
        </span>
        <span
          className={`rounded-full border border-zinc-200 px-3 py-1 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 ${typography.badge}`}
        >
          {duration}
        </span>
      </div> */}

      <h1 className={` ${typography.hero}`}>{title}</h1>

      <p className={` max-w-3xl ${typography.subtitle}`}>{description}</p>

      {/* <a
        href={downloadHref}
        download
        className={`mt-8 inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 text-white shadow-sm transition hover:bg-emerald-500 ${typography.button}`}
      >
        Download Starter Notebook
      </a> */}
    </header>
  );
}
