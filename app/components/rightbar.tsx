"use client";

import { useEffect, useState } from "react";

const RIGHTBAR_COLLAPSED_KEY = "webaigenacademy-rightbar-collapsed";
const RIGHTBAR_OPEN_WIDTH = "13.25rem";

export default function Rightbar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          className="fixed right-2 mt-1.5 cursor-pointer top-[calc(var(--navbar-height))] z-20 rounded-lg border border-zinc-200 bg-white p-2 text-zinc-500 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F00] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
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
        <div className="flex h-full w-53 min-w-53 flex-col">
          <div className="shrink-0  px-6 py-4 dark:border-zinc-800">
            <div className="flex items-start justify-between gap-2">
            <button
                type="button"
                onClick={toggleCollapsed}
                aria-label="Collapse related lessons"
                aria-expanded={!isCollapsed}
                className="shrink-0 cursor-pointer rounded-lg p-1.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF6F00] dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-300"
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
             
              <h2 className="min-w-0 flex-1 text-lg h-12.5 font-semibold text-zinc-900 dark:text-zinc-100">
                Related
              </h2>
             
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto  p-6">
            {/* Related lessons content goes here */}
          </div>
        </div>
      </aside>
    </>
  );
}
