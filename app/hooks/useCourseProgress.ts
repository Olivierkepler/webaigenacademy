"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type CourseProgress,
  PROGRESS_UPDATED_EVENT,
  readProgress,
} from "@/app/lib/progress";

export function useCourseProgress(course: string) {
  const [progress, setProgress] = useState<CourseProgress>({});

  const refresh = useCallback(() => {
    setProgress(readProgress());
  }, []);

  useEffect(() => {
    refresh();

    const handleUpdate = () => refresh();

    window.addEventListener(PROGRESS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(PROGRESS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [refresh]);

  const completedSlugs = progress[course] ?? [];

  return { progress, completedSlugs };
}
