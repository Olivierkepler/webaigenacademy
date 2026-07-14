export const PROGRESS_STORAGE_KEY = "webaigenacademy-progress";

export const PROGRESS_UPDATED_EVENT = "webaigenacademy-progress-updated";

export type CourseProgress = Record<string, string[]>;

/** Set by ProgressSync when next-auth session status is known. */
let progressSyncEnabled = false;
let syncStartedThisSession = false;

export function setProgressSyncEnabled(enabled: boolean): void {
  progressSyncEnabled = enabled;
}

export function readProgress(): CourseProgress {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as CourseProgress;
  } catch {
    return {};
  }
}

export function writeProgress(progress: CourseProgress): void {
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function postProgress(
  courseSlug: string,
  lessonSlug: string,
  completed: boolean
): void {
  if (!progressSyncEnabled || typeof window === "undefined") {
    return;
  }

  void fetch("/api/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ courseSlug, lessonSlug, completed }),
  }).catch(console.error);
}

export function markLessonComplete(
  course: string,
  lessonSlug: string
): CourseProgress {
  const progress = readProgress();
  const completed = progress[course] ?? [];

  if (!completed.includes(lessonSlug)) {
    progress[course] = [...completed, lessonSlug];
    writeProgress(progress);
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
    postProgress(course, lessonSlug, true);
  }

  return progress;
}

export function isLessonComplete(
  course: string,
  lessonSlug: string,
  progress: CourseProgress = readProgress()
): boolean {
  return (progress[course] ?? []).includes(lessonSlug);
}

export function getCompletedSlugs(
  course: string,
  progress: CourseProgress = readProgress()
): string[] {
  return progress[course] ?? [];
}

export function getCompletedCount(
  course: string,
  progress: CourseProgress = readProgress()
): number {
  return getCompletedSlugs(course, progress).length;
}

export function getCourseProgressPercent(
  course: string,
  totalLessons: number,
  progress: CourseProgress = readProgress()
): number {
  if (totalLessons === 0) {
    return 0;
  }

  return Math.round((getCompletedCount(course, progress) / totalLessons) * 100);
}

type ServerCompletion = {
  course_slug?: unknown;
  lesson_slug?: unknown;
};

function serverRowsToProgress(rows: unknown): CourseProgress {
  const progress: CourseProgress = {};

  if (!Array.isArray(rows)) {
    return progress;
  }

  for (const row of rows as ServerCompletion[]) {
    const course =
      typeof row.course_slug === "string" ? row.course_slug : null;
    const lesson =
      typeof row.lesson_slug === "string" ? row.lesson_slug : null;

    if (!course || !lesson) {
      continue;
    }

    const existing = progress[course] ?? [];
    if (!existing.includes(lesson)) {
      progress[course] = [...existing, lesson];
    }
  }

  return progress;
}

function mergeProgress(
  local: CourseProgress,
  server: CourseProgress
): CourseProgress {
  const merged: CourseProgress = {};
  const courses = new Set([
    ...Object.keys(local),
    ...Object.keys(server),
  ]);

  for (const course of courses) {
    const union = new Set([
      ...(local[course] ?? []),
      ...(server[course] ?? []),
    ]);
    merged[course] = [...union];
  }

  return merged;
}

/**
 * One-time merge of localStorage progress with the signed-in user's
 * server completions. Safe to call when signed out (no-op) or if the
 * network/API fails (localStorage left unchanged).
 */
export async function syncProgress(): Promise<void> {
  if (!progressSyncEnabled || typeof window === "undefined") {
    return;
  }

  if (syncStartedThisSession) {
    return;
  }
  syncStartedThisSession = true;

  try {
    const response = await fetch("/api/progress");
    if (!response.ok) {
      syncStartedThisSession = false;
      return;
    }

    const rows: unknown = await response.json();
    const serverProgress = serverRowsToProgress(rows);
    const localProgress = readProgress();
    const merged = mergeProgress(localProgress, serverProgress);

    for (const [course, lessons] of Object.entries(localProgress)) {
      const serverLessons = new Set(serverProgress[course] ?? []);
      for (const lessonSlug of lessons) {
        if (!serverLessons.has(lessonSlug)) {
          postProgress(course, lessonSlug, true);
        }
      }
    }

    writeProgress(merged);
    window.dispatchEvent(new CustomEvent(PROGRESS_UPDATED_EVENT));
  } catch (error) {
    console.error("[progress] syncProgress failed:", error);
    syncStartedThisSession = false;
  }
}
