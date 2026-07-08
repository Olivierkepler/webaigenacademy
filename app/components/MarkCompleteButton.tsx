"use client";

import { useEffect, useState } from "react";
import {
  isLessonComplete,
  markLessonComplete,
  PROGRESS_UPDATED_EVENT,
} from "@/app/lib/progress";
import { accent, primaryButtonClass, typography } from "@/app/lib/typography";

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
          ? `inline-flex items-center rounded-lg border px-6 py-3 ${accent.borderSubtle} ${accent.bgSubtle} ${accent.text} ${typography.button}`
          : primaryButtonClass
      }
    >
      {completed ? "Completed" : "Mark Lesson Complete"}
    </button>
  );
}
