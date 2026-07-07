"use client";

import { useEffect, useState } from "react";
import {
  isLessonComplete,
  markLessonComplete,
  PROGRESS_UPDATED_EVENT,
} from "@/app/lib/progress";
import { typography } from "@/app/lib/typography";

type MarkCompleteButtonProps = {
  course: string;
  lessonSlug: string;
};

export default function MarkCompleteButton({
  course,
  lessonSlug,
}: MarkCompleteButtonProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const sync = () => setCompleted(isLessonComplete(course, lessonSlug));

    sync();
    window.addEventListener(PROGRESS_UPDATED_EVENT, sync);

    return () => window.removeEventListener(PROGRESS_UPDATED_EVENT, sync);
  }, [course, lessonSlug]);

  const handleClick = () => {
    if (completed) {
      return;
    }

    markLessonComplete(course, lessonSlug);
    setCompleted(true);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={completed}
      className={
        completed
          ? `inline-flex items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-emerald-700 dark:text-emerald-400 ${typography.button}`
          : `inline-flex items-center rounded-lg bg-emerald-600 px-6 py-3 text-white shadow-sm transition hover:bg-emerald-500 ${typography.button}`
      }
    >
      {completed ? "Completed" : "Mark Lesson Complete"}
    </button>
  );
}
