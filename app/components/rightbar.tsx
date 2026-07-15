"use client";

import { useEffect, useState } from "react";
import VideoTutorial from "@/app/components/lesson/VideoTutorial";
import type { LessonVideo } from "@/app/lib/lessonVideo";

const RIGHTBAR_COLLAPSED_KEY = "webaigenacademy-rightbar-collapsed";
const RIGHTBAR_OPEN_WIDTH = "22rem";

type RightbarProps = {
  video?: LessonVideo;
};

export default function Rightbar({ video }: RightbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const activeVideo = video;

  useEffect(() => {
    setIsCollapsed(localStorage.getItem(RIGHTBAR_COLLAPSED_KEY) === "true");
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--rightbar-width",
      isCollapsed ? "0rem" : RIGHTBAR_OPEN_WIDTH
    );
  }, [isCollapsed]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(RIGHTBAR_COLLAPSED_KEY, String(next));
      return next;
    });
  };

  return (
    <>
      {isCollapsed && (
        <button
          type="button"
          onClick={toggleCollapsed}
          aria-label="Open related lessons"
          className="fixed right-2 top-[calc(var(--navbar-height))] z-20 mt-1.5 cursor-pointer rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:focus-visible:outline-[#85D7CE]"
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
      )}

      <aside
        className="fixed right-0 top-[calc(var(--navbar-height))] z-20 flex h-[calc(100vh-var(--navbar-height)-2.75rem)] w-[var(--rightbar-width)] flex-col overflow-hidden border-l border-zinc-200 bg-white transition-[width] duration-300 ease-out motion-reduce:transition-none dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex h-full w-[22rem] min-w-[22rem] flex-col">
          <div className="shrink-0 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
            <div className="flex items-center justify-between gap-2">
              <h2 className="min-w-0 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Lessons
              </h2>
              <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="Collapse related lessons"
                aria-expanded={!isCollapsed}
                className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 dark:focus-visible:outline-[#85D7CE]"
              >
                <svg
                  aria-hidden
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="scrollbar-fancy min-h-0 flex-1 overflow-y-auto p-4">
            {activeVideo?.id ? (
              <VideoTutorial video={activeVideo} />
            ) : (
              <div className="mt-5 flex aspect-video w-full items-center justify-center rounded-xl bg-zinc-100 text-sm text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                Video tutorial coming soon
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
