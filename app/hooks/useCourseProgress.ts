"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  type CourseProgress,
  PROGRESS_UPDATED_EVENT,
  readProgress,
  setProgressSyncEnabled,
  syncProgress,
} from "@/app/lib/progress";

export function useCourseProgress(course: string) {
  const { status } = useSession();
  const [progress, setProgress] = useState<CourseProgress>({});

  const refresh = useCallback(() => {
    setProgress(readProgress());
  }, []);

  useEffect(() => {
    const signedIn = status === "authenticated";
    setProgressSyncEnabled(signedIn);

    if (signedIn) {
      void syncProgress().then(refresh);
    }
  }, [status, refresh]);

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
