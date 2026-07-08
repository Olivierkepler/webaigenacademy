"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  searchLessons,
  type SearchableLesson,
} from "@/app/lib/lessonSearch";
import { accent, typography } from "@/app/lib/typography";

type NavbarSearchProps = {
  lessons: SearchableLesson[];
};

function SearchIcon() {
  return (
    <svg
      aria-hidden
      className="h-4 w-4 text-zinc-400 dark:text-zinc-500"
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
  const results = useMemo(
    () => searchLessons(lessons, query),
    [lessons, query]
  );
  const showDropdown = isOpen && trimmedQuery.length > 0;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  const handleResultClick = () => {
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <label htmlFor="navbar-search" className="sr-only">
        Search lessons
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
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
          placeholder="Search lessons, quizzes, and notebooks..."
          className={`w-full rounded-full border border-zinc-300 bg-white py-2.5 pl-11 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${accent.focusBorder} ${accent.focusRing} ${typography.small}`}
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
          {results.length === 0 ? (
            <p className={`px-4 py-3 ${typography.caption}`}>
              No lessons found for &ldquo;{trimmedQuery}&rdquo;
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {results.map((lesson) => (
                <li key={lesson.slug}>
                  <Link
                    href={`/learn/${lesson.course}/${lesson.slug}`}
                    onClick={handleResultClick}
                    className="flex items-center justify-between gap-4 px-4 py-3 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  >
                    <div className="min-w-0">
                      <p className={`truncate ${typography.sidebarItem} text-zinc-900 dark:text-white`}>
                        {lesson.title}
                      </p>
                      <p className={`mt-0.5 truncate ${typography.caption}`}>
                        {lesson.section}
                      </p>
                    </div>
                    <span className={`shrink-0 ${typography.caption}`}>
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
