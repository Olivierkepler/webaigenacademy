"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { SearchableLesson } from "@/app/lib/lessonSearch";
import { typography } from "@/app/lib/typography";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";
import NodeALogo from "./logo";

type NavbarProps = {
  searchableLessons: SearchableLesson[];
  userMenu?: ReactNode;
};

export default function Navbar({ searchableLessons, userMenu }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-30 flex h-[var(--navbar-height)] shrink-0 items-center border-b px-6 transition-all duration-300 lg:px-10 ${
        scrolled
          ? "border-zinc-200/80 bg-white/90 shadow-sm backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/90"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="flex w-full items-center gap-4 lg:gap-8">
        <Link href="/" className="group shrink-0">
          <div className="flex items-center gap-2 ">
            <NodeALogo size={54} />

            <div>
              <div
                className="relative inline-block "
              >
                <p className={typography.navbarSmall}>WebAiGen</p>
              </div>
         

              <h3
                className={`mt-1 text-20px] transition font-medium leading-tight `}
              >
                Academy
              </h3>
            </div>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <NavbarSearch lessons={searchableLessons} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {userMenu}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
