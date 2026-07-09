


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SearchableLesson } from "@/app/lib/lessonSearch";
import { typography } from "@/app/lib/typography";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";
import NodeALogo from "./logo";

type NavbarProps = {
  searchableLessons: SearchableLesson[];
};

export default function Navbar({ searchableLessons }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 flex h-[var(--navbar-height)] w-full shrink-0 items-center border-b px-6 transition-all duration-300 lg:px-10 ${
        scrolled
          ? "border-zinc-200/70 bg-white shadow-sm  dark:border-zinc-800/80 dark:bg-zinc-950/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 lg:gap-8">
        <Link href="/" className="group shrink-0">
          <div className="flex items-center gap-2.5">
            <NodeALogo size={34} />


            <div className="leading-none">
              <p className="font-black  italic">WebAiGen</p>
              <h3 className="mt-1 text-sm font-black italic tracking-tight text-zinc-950 transition dark:text-white">
                Academy
              </h3>
            </div>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <NavbarSearch lessons={searchableLessons} />
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}