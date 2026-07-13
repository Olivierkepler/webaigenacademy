import { accentBadgeClass, cardPadding, primaryButtonClass, typography } from "@/app/lib/typography";

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
      className={` ${cardPadding} border-l-8 border-[#003334]/50`}
    >
      {/* <div className="flex flex-wrap items-center gap-3">
        <p className={typography.label}>{courseTitle}</p>
        <span
          className={`rounded-full border border-zinc-200 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:text-zinc-300 ${typography.badge}`}
        >
          Lesson {lessonNumber} of {totalLessons}
        </span>
        <span
          className={`${accentBadgeClass} ${typography.badge}`}
        >
          {difficulty}
        </span>
        <span
          className={`rounded-full border border-zinc-200 px-3 py-1 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400 ${typography.badge}`}
        >
          {duration}
        </span>
      </div> */}

      <h1 className={typography.lessonTitle}>{title}</h1>

      <p className={`mt-4 max-w-3xl ${typography.body}`}>{description}</p>

      {/* <a
        href={downloadHref}
        download
        className={`mt-8 ${primaryButtonClass}`}
      >
        Download Starter Notebook
      </a> */}
    </header>
  );
}
