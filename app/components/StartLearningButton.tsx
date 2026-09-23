"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type StartLearningButtonProps = {
  courseSlug: string;
  firstLessonPath: string;
  isDatabaseCourse: boolean;
  children: React.ReactNode;
  className?: string;
};

export default function StartLearningButton({
  courseSlug,
  firstLessonPath,
  isDatabaseCourse,
  children,
  className = "",
}: StartLearningButtonProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleClick() {
    if (loading) {
      return;
    }

    /*
     * Existing filesystem courses do not use the enrollments table.
     * Preserve their current behavior.
     */
    if (!isDatabaseCourse) {
      router.push(firstLessonPath);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseSlug,
        }),
      });

      if (response.status === 401) {
        const callbackUrl = encodeURIComponent(firstLessonPath);

        router.push(`/signin?callbackUrl=${callbackUrl}`);
        return;
      }

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;

        throw new Error(data?.error || "Unable to start course.");
      }

      router.push(firstLessonPath);
    } catch (error) {
      console.error("[StartLearningButton] enrollment failed:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to start course."
      );

      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={className}
      >
        {loading ? "Starting..." : children}
      </button>

      {error ? (
        <p className="mt-2 text-sm font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  );
}