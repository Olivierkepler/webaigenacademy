"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchLessons, type SearchableLesson } from "@/app/lib/lessonSearch";

type NavbarSearchProps = {
  lessons: SearchableLesson[];
};

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
      />
    </svg>
  );
}

export default function NavbarSearch({ lessons }: NavbarSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmedQuery = query.trim();

  const results = useMemo(() => searchLessons(lessons, query), [lessons, query]);

  const showDropdown = isOpen && trimmedQuery.length > 0;

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function handleResultClick() {
    setQuery("");
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <label htmlFor="navbar-search" className="sr-only">
        Search lessons
      </label>

      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-[#0E5C58] dark:text-zinc-500 dark:group-focus-within:text-[#85D7CE]">
          <SearchIcon />
        </span>

        <input
          id="navbar-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setQuery("");
              setIsOpen(false);
              event.currentTarget.blur();
            }
          }}
          placeholder="Search lessons, quizzes, notebooks..."
          className="h-11 w-full rounded-full border border-zinc-200/80 bg-white/85 pl-11 pr-4 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-xl outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-white focus:border-[#0E5C58]/40 focus:bg-white focus:ring-4 focus:ring-[#0E5C58]/10 dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-700 dark:focus:border-[#85D7CE]/40 dark:focus:ring-[#85D7CE]/10"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95">
          <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Search results
            </p>
          </div>

          {results.length === 0 ? (
            <div className="px-5 py-5">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No lessons found for &ldquo;{trimmedQuery}&rdquo;
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                Try searching for machine learning, trees, quizzes, or notebooks.
              </p>
            </div>
          ) : (
            <ul className="max-h-96 overflow-y-auto p-2">
              {results.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/learn/${lesson.course}/${lesson.slug}`}
                    onClick={handleResultClick}
                    className="group/result flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-zinc-950 transition group-hover/result:text-[#0E5C58] dark:text-white dark:group-hover/result:text-[#85D7CE]">
                        {lesson.title}
                      </p>
                      <p className="mt-1 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                        {lesson.section}
                      </p>
                    </div>

                    <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-900 dark:text-zinc-400">
                      {lesson.duration}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}