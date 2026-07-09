


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
    className={`fixed left-0 top-0 z-50 flex h-[var(--navbar-height)] w-full shrink-0 items-center px-6 transition-all duration-300 lg:px-10 ${
      scrolled
        ? "border-zinc-200/70 bg-white  shadow-[0_8px_30px_rgba(0,0,0,0.06)] dark:border-zinc-800/80 dark:bg-zinc-950/80"
        : "border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
    }`}
  >
      <div className="mx-auto flex w-full max-w-7xl items-center gap-4 lg:gap-8">
      <Link
  href="/"
  className="group flex shrink-0 items-center gap-3"
>
  <NodeALogo
    size={36}
  />

 <div className="flex flex-col leading-none">
      <span className="text-[17px] font-semibold tracking-[-0.03em] text-zinc-950 transition-colors dark:text-white">
        WebAiGen
      </span>

      <span className="mt-0.5 text-[12px] font-medium uppercase tracking-[0.22em] text-zinc-500 transition-colors dark:text-zinc-400">
        Academy
      </span>
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