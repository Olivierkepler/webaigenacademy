"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useCourseProgress } from "@/app/hooks/useCourseProgress";
import { getCourseProgressPercent } from "@/app/lib/progress";
import { accent, typography } from "@/app/lib/typography";

const SIDEBAR_SECTIONS_KEY = "webaigenacademy-sidebar-sections";
const SIDEBAR_COLLAPSED_KEY = "webaigenacademy-sidebar-collapsed";

type SidebarLesson = {
  slug: string;
  title: string;
  section: string;
  course: string;
  duration: string;
};

type LessonSidebarClientProps = {
  currentCourse: string;
  currentLesson: string;
  courseTitle: string;
  lessons: SidebarLesson[];
};

type SectionGroup = {
  name: string;
  lessons: SidebarLesson[];
};

type SidebarSectionState = Record<string, Record<string, boolean>>;

function readSidebarSectionState(): SidebarSectionState {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(SIDEBAR_SECTIONS_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as SidebarSectionState;
  } catch {
    return {};
  }
}

function writeSidebarSectionState(state: SidebarSectionState): void {
  localStorage.setItem(SIDEBAR_SECTIONS_KEY, JSON.stringify(state));
}

function groupLessonsBySection(lessons: SidebarLesson[]): SectionGroup[] {
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

function CheckmarkIcon() {
  return (
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
  );
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden
      className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform dark:text-zinc-400 ${
        expanded ? "rotate-90" : ""
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LessonStatusIcon({
  isCompleted,
  isActive,
}: {
  isCompleted: boolean;
  isActive: boolean;
}) {
  if (isCompleted) {
    return (
      <span
        aria-label="Completed"
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${accent.borderMedium} ${accent.bgSubtle}`}
      >
        <CheckmarkIcon />
      </span>
    );
  }

  return (
    <span
      aria-label={isActive ? "Current lesson" : "Not completed"}
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        isActive
          ? `border-[#FF6F00] ${accent.bgSubtle}`
          : "border-zinc-300 bg-transparent dark:border-zinc-600"
      }`}
    >
      {!isActive && (
        <span className="sr-only">Incomplete</span>
      )}
    </span>
  );
}

export default function LessonSidebarClient({
  currentCourse,
  currentLesson,
  courseTitle,
  lessons,
}: LessonSidebarClientProps) {
  const { progress, completedSlugs } = useCourseProgress(currentCourse);
  const progressPercent = getCourseProgressPercent(
    currentCourse,
    lessons.length,
    progress
  );

  const sections = useMemo(() => groupLessonsBySection(lessons), [lessons]);

  const currentSection = useMemo(
    () =>
      sections.find((section) =>
        section.lessons.some((lesson) => lesson.slug === currentLesson)
      )?.name ?? null,
    [sections, currentLesson]
  );

  const buildExpandedState = useCallback(
    (saved: SidebarSectionState) => {
      const courseSaved = saved[currentCourse] ?? {};
      const next: Record<string, boolean> = {};

      for (const section of sections) {
        const containsCurrent = section.lessons.some(
          (lesson) => lesson.slug === currentLesson
        );
        next[section.name] = containsCurrent
          ? true
          : (courseSaved[section.name] ?? false);
      }

      return next;
    },
    [sections, currentCourse, currentLesson]
  );

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
    () => buildExpandedState({})
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setExpandedSections(buildExpandedState(readSidebarSectionState()));
  }, [buildExpandedState]);

  useEffect(() => {
    setIsCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true");
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--sidebar-width",
      isCollapsed ? "0rem" : "20.5rem"
    );
  }, [isCollapsed]);

  useEffect(() => {
    if (!currentSection) {
      return;
    }

    setExpandedSections((prev) => {
      if (prev[currentSection]) {
        return prev;
      }

      return { ...prev, [currentSection]: true };
    });
  }, [currentSection]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) => {
      const next = { ...prev, [sectionName]: !prev[sectionName] };
      const allSaved = readSidebarSectionState();

      writeSidebarSectionState({
        ...allSaved,
        [currentCourse]: {
          ...(allSaved[currentCourse] ?? {}),
          [sectionName]: next[sectionName],
        },
      });

      return next;
    });
  };

  return (
    <>
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Open sidebar"
          className="fixed left-2 top-[calc(var(--navbar-height)+4rem)] z-20 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F00] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        >
          <svg
            aria-hidden
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <aside className="fixed left-0 top-[var(--navbar-height)] z-20 flex h-[calc(100vh-var(--navbar-height))] w-[var(--sidebar-width)] flex-col overflow-hidden border-r border-zinc-200 bg-white transition-[width] duration-300 ease-out motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex h-full w-82 min-w-82 flex-col">
      <div className="shrink-0 border-b border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className={typography.label}>Course</p>
            <h2 className={`mt-2 ${typography.sidebarTitle}`}>{courseTitle}</h2>
          </div>
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            aria-expanded={!isCollapsed}
            className="shrink-0 rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F00] dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <svg
              aria-hidden
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {sections.map((section) => {
            const isExpanded = expandedSections[section.name] ?? false;
            const sectionCompleted = section.lessons.filter((lesson) =>
              completedSlugs.includes(lesson.slug)
            ).length;
            const sectionTotal = section.lessons.length;
            const sectionPercent =
              sectionTotal > 0
                ? Math.round((sectionCompleted / sectionTotal) * 100)
                : 0;

            return (
              <div
                key={section.name}
                className="overflow-hidden rounded-xl  "
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.name)}
                  aria-expanded={isExpanded}
                  className="flex w-full items-start gap-2 px-3 py-3 text-left transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  <ChevronIcon expanded={isExpanded} />
                  <div className="min-w-0 flex-1">
                    <p className={typography.sidebarSection}>
                      {section.name}
                    </p>
                    <p className={`mt-0.5 ${typography.caption}`}>
                      {sectionCompleted} / {sectionTotal} completed
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                        <div
                          className={`h-full rounded-full transition-[width] duration-300 ease-out ${accent.progress}`}
                          style={{ width: `${sectionPercent}%` }}
                        />
                      </div>
                      <span className={`shrink-0 text-xs font-medium ${accent.text}`}>
                        {sectionPercent}%
                      </span>
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-zinc-200 px-2 py-2 dark:border-zinc-800">
                    <ul className="space-y-0.5">
                      {section.lessons.map((lesson) => {
                        const isActive = lesson.slug === currentLesson;
                        const isCompleted = completedSlugs.includes(lesson.slug);

                        return (
                          <li key={lesson.slug}>
                            <Link
                              href={`/learn/${lesson.course}/${lesson.slug}`}
                              aria-current={isActive ? "page" : undefined}
                              className={`flex items-center gap-2.5 rounded-lg px-2 py-2.5 transition ${
                                isActive
                                  ? `border-l-4 ${accent.border} bg-zinc-100 pl-3 dark:bg-zinc-800/70`
                                  : "border-l-4 border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                              }`}
                            >
                              <LessonStatusIcon
                                isCompleted={isCompleted}
                                isActive={isActive}
                              />
                              <span
                                className={`min-w-0 flex-1 truncate ${
                                  isActive
                                    ? `font-semibold text-zinc-900 dark:text-white ${typography.sidebarItem}`
                                    : typography.sidebarItem
                                }`}
                              >
                                {lesson.title}
                              </span>
                              <span
                                className={`shrink-0 ${typography.caption}`}
                              >
                                {lesson.duration}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      <div className="sticky bottom-0 shrink-0 border-t border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div
          className={`flex items-center justify-between ${typography.sidebarItem}`}
        >
          <span className="font-medium text-zinc-700 dark:text-zinc-300">
            Course Progress
          </span>
          <span className={accent.text}>
            {progressPercent}%
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-out ${accent.progress}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className={`mt-2 ${typography.caption}`}>
          {completedSlugs.length} of {lessons.length} lessons completed
        </p>
      </div>
        </div>
    </aside>
    </>
  );
}
