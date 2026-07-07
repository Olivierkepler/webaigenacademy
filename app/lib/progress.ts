export const PROGRESS_STORAGE_KEY = "webaigenacademy-progress";

export const PROGRESS_UPDATED_EVENT = "webaigenacademy-progress-updated";

export type CourseProgress = Record<string, string[]>;

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
