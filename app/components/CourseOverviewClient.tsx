"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCourseProgress } from "@/app/hooks/useCourseProgress";
import {
  getCompletedCount,
  getCourseProgressPercent,
} from "@/app/lib/progress";
import {
  accent,
  accentBadgeClass,
  cardPadding,
  primaryButtonClass,
  typography,
} from "@/app/lib/typography";

export type CourseLesson = {
  slug: string;
  title: string;
  order: number;
  section: string;
  description: string;
  duration: string;
  difficulty: string;
};

type CourseOverviewHeaderProps = {
  course: string;
  courseTitle: string;
  difficulty: string;
  description: string;
  lessons: CourseLesson[];
};

type CourseCurriculumProps = {
  course: string;
  lessons: CourseLesson[];
};

type SectionGroup = {
  name: string;
  lessons: CourseLesson[];
};

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

const pageText = "!text-black dark:!text-white";
const mutedText = "!text-black/70 dark:!text-white/70";

function groupLessonsBySection(lessons: CourseLesson[]): SectionGroup[] {
  const sections: SectionGroup[] = [];
  const indexByName = new Map<string, number>();

  for (const lesson of lessons) {
    const existingIndex = indexByName.get(lesson.section);

    if (existingIndex === undefined) {
      indexByName.set(lesson.section, sections.length);
      sections.push({ name: lesson.section, lessons: [lesson] });
    } else {
      sections[existingIndex].lessons.push(lesson);
    }
  }

  return sections;
}

function CheckmarkBadge() {
  return (
    <span
      aria-label="Completed"
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${accent.borderMedium} ${accent.bgSubtle}`}
    >
      <svg
        aria-hidden
        className={`h-3.5 w-3.5 ${accent.text}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}

function IncompleteBadge() {
  return (
    <span
      aria-hidden
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-zinc-300 dark:border-zinc-600"
    />
  );
}

export function CourseOverviewHeader({
  course,
  courseTitle,
  difficulty,
  description,
  lessons,
}: CourseOverviewHeaderProps) {
  const { progress, completedSlugs } = useCourseProgress(course);
  const completedCount = getCompletedCount(course, progress);
  const progressPercent = getCourseProgressPercent(
    course,
    lessons.length,
    progress
  );

  const sortedLessons = useMemo(
    () => [...lessons].sort((a, b) => a.order - b.order),
    [lessons]
  );

  const targetLesson = useMemo(() => {
    const firstIncomplete = sortedLessons.find(
      (lesson) => !completedSlugs.includes(lesson.slug)
    );

    return firstIncomplete ?? sortedLessons[0];
  }, [sortedLessons, completedSlugs]);

  const buttonLabel =
    completedCount === 0
      ? "Start Course"
      : completedCount === lessons.length
        ? "Review Course"
        : "Continue Learning";

  return (
    <header className={`${cardClass} ${cardPadding}`}>
      <p className={typography.label}>Course</p>
      <h1 className={`mt-3 ${typography.pageTitle}`}>{courseTitle}</h1>

      <div className="mt-4 flex flex-wrap gap-3">
        <span className={accentBadgeClass}>
          <span className={typography.badge}>{difficulty}</span>
        </span>
        <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          <span className={typography.badge}>{lessons.length} lessons</span>
        </span>
        <span className={accentBadgeClass}>
          <span className={typography.badge}>
            {completedCount} of {lessons.length} completed
          </span>
        </span>
      </div>

      <div className="mt-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <span className={`font-medium ${typography.body}`}>
            Course progress
          </span>
          <span className={accent.text}>
            {progressPercent}%
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-all ${accent.progress}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <p className={`mt-6 max-w-3xl ${typography.body}`}>{description}</p>

      <Link
        href={`/learn/${course}/${targetLesson.slug}`}
        className={`mt-8 ${primaryButtonClass}`}
      >
        {buttonLabel}
      </Link>
    </header>
  );
}

export function CourseCurriculum({ course, lessons }: CourseCurriculumProps) {
  const { completedSlugs } = useCourseProgress(course);
  const sections = useMemo(() => groupLessonsBySection(lessons), [lessons]);

  return (
    <section className={pageText}>
      <p className={`${typography.label} ${mutedText}`}>Curriculum</p>
      <h2 className={`mt-3 ${typography.sectionTitle} ${pageText}`}>Lessons</h2>

      <div className="mt-8 space-y-8">
        {sections.map((section) => {
          const sectionCompleted = section.lessons.filter((lesson) =>
            completedSlugs.includes(lesson.slug)
          ).length;
          const sectionTotal = section.lessons.length;
          const sectionPercent =
            sectionTotal > 0
              ? Math.round((sectionCompleted / sectionTotal) * 100)
              : 0;

          return (
            <div key={section.name} className={`${cardClass} overflow-hidden`}>
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                <h3 className={`${typography.cardTitle} ${pageText}`}>
                  {section.name}
                </h3>
                <p className={`mt-1 ${typography.caption} ${mutedText}`}>
                  {sectionCompleted} / {sectionTotal} completed
                </p>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                    <div
                      className={`h-full rounded-full transition-all ${accent.progress}`}
                      style={{ width: `${sectionPercent}%` }}
                    />
                  </div>
                  <span className={`shrink-0 text-sm font-medium ${accent.text}`}>
                    {sectionPercent}%
                  </span>
                </div>
              </div>

              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {section.lessons.map((lesson) => {
                  const isCompleted = completedSlugs.includes(lesson.slug);

                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/learn/${course}/${lesson.slug}`}
                        className="group flex items-center gap-4 px-6 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                      >
                        {isCompleted ? (
                          <CheckmarkBadge />
                        ) : (
                          <IncompleteBadge />
                        )}

                        <span
                          className={`shrink-0 rounded-full border border-zinc-200 px-2.5 py-0.5 dark:border-zinc-700 ${typography.badge} ${mutedText}`}
                        >
                          {lesson.order}
                        </span>

                        <span
                          className={`min-w-0 flex-1 transition ${accent.groupHoverText} ${
                            isCompleted ? "font-semibold" : ""
                          } ${typography.sidebarItem} ${pageText}`}
                        >
                          {lesson.title}
                        </span>

                        <span
                          className={`shrink-0 ${typography.caption} ${mutedText}`}
                        >
                          {lesson.duration}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
