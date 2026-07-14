"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { searchLessons, type SearchableLesson } from "@/app/lib/lessonSearch";
import { accent } from "@/app/lib/typography";

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

/** Wraps the matched part of `text` in a highlighted <mark>. */
function Highlight({ text, query }: { text: string; query: string }) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (!query || index === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, index)}
      <mark
        className={`rounded-[3px] px-0.5 ${accent.bgSubtle} ${accent.text} dark:bg-[#5EEAD4]/15 dark:text-[#5EEAD4]`}
      >
        {text.slice(index, index + query.length)}
      </mark>
      {text.slice(index + query.length)}
    </>
  );
}

export default function NavbarSearch({ lessons }: NavbarSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const trimmedQuery = query.trim();
  const results = useMemo(
    () => searchLessons(lessons, query),
    [lessons, query]
  );
  const showDropdown = isOpen && trimmedQuery.length > 0;

  // Close when clicking outside
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  // ⌘K / Ctrl+K focuses the search from anywhere
  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // Reset the highlighted row whenever the result set changes
  useEffect(() => {
    setActiveIndex(results.length > 0 ? 0 : -1);
  }, [trimmedQuery, results.length]);

  // Keep the active row scrolled into view
  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function close(clear = false) {
    if (clear) setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setIsOpen(true);
        setActiveIndex((i) => (results.length ? (i + 1) % results.length : -1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) =>
          results.length ? (i - 1 + results.length) % results.length : -1
        );
        break;
      case "Enter": {
        const active = results[activeIndex];
        if (showDropdown && active) {
          event.preventDefault();
          close(true);
          router.push(`/learn/${active.course}/${active.slug}`);
        }
        break;
      }
      case "Escape":
        close(true);
        event.currentTarget.blur();
        break;
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      <label htmlFor="navbar-search" className="sr-only">
        Search lessons
      </label>

      <div className="group relative">
        <span
          className={`pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-zinc-400 transition group-focus-within:text-[#0F766E] dark:text-zinc-500 dark:group-focus-within:text-[#5EEAD4]`}
        >
          <SearchIcon />
        </span>

        <input
          ref={inputRef}
          id="navbar-search"
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="navbar-search-results"
          aria-activedescendant={
            activeIndex >= 0 ? `search-result-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search lessons, quizzes, notebooks..."
          className="h-11 w-full rounded-full border border-zinc-200/80 bg-white/85 pl-11 pr-16 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-xl outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 hover:bg-white focus:border-[#0F766E]/40 focus:bg-white focus:ring-4 focus:ring-[#0F766E]/10 motion-reduce:transition-none dark:border-zinc-800/80 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:focus:border-[#5EEAD4]/40 dark:focus:bg-zinc-900 dark:focus:ring-[#5EEAD4]/10 [&::-webkit-search-cancel-button]:appearance-none [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(255,255,255)] [&:-webkit-autofill]:[-webkit-text-fill-color:rgb(24,24,27)] dark:[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_rgb(24,24,27)] dark:[&:-webkit-autofill]:[-webkit-text-fill-color:rgb(244,244,245)]"
        />

        {/* ⌘K hint — hidden once the user is typing */}
        {!query && (
          <kbd className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[11px] font-semibold text-zinc-400 sm:flex dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-500">
            ⌘K
          </kbd>
        )}
      </div>

      {showDropdown && (
        <div
          id="navbar-search-results"
          className="absolute left-0 right-0 top-[calc(100%+0.65rem)] z-50 overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 shadow-[0_24px_80px_rgba(0,0,0,0.14)] backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/95 dark:shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="flex items-baseline justify-between border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400 dark:text-zinc-500">
              Search results
            </p>
            {results.length > 0 && (
              <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
                {results.length} {results.length === 1 ? "lesson" : "lessons"}
              </p>
            )}
          </div>

          {results.length === 0 ? (
            <div className="px-5 py-5">
              <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                No lessons found for &ldquo;{trimmedQuery}&rdquo;
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-500">
                Try searching for machine learning, trees, quizzes, or
                notebooks.
              </p>
            </div>
          ) : (
            <ul
              ref={listRef}
              role="listbox"
              aria-label="Lesson search results"
              className="max-h-96 overflow-y-auto p-2"
            >
              {results.map((lesson, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={lesson.slug}
                    id={`search-result-${index}`}
                    role="option"
                    aria-selected={isActive}
                    data-index={index}
                  >
                    <Link
                      href={`/learn/${lesson.course}/${lesson.slug}`}
                      onClick={() => close(true)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`group/result flex items-center justify-between gap-4 rounded-2xl px-4 py-3 transition motion-reduce:transition-none ${
                        isActive
                          ? `${accent.bgSubtle} dark:bg-[#5EEAD4]/[0.08]`
                          : "hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
                      }`}
                    >
                      <div className="min-w-0">
                        <p
                          className={`truncate text-sm font-semibold transition ${
                            isActive
                              ? accent.text
                              : "text-zinc-950 dark:text-white"
                          }`}
                        >
                          <Highlight text={lesson.title} query={trimmedQuery} />
                        </p>
                        <p className="mt-1 truncate text-xs font-medium text-zinc-500 dark:text-zinc-400">
                          {lesson.section}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                        {lesson.duration}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
