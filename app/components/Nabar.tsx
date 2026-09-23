"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import type { SearchableLesson } from "@/app/lib/lessonSearch";
import { typography } from "@/app/lib/typography";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";
import NodeALogo from "./logo";
import { usePathname } from "next/navigation";

type NavbarProps = {
  searchableLessons: SearchableLesson[];
  userMenu?: ReactNode;
};

export default function Navbar({ searchableLessons, userMenu }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isSignInPage = pathname === "/signin";

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
    className={`fixed left-0 top-0 z-50 flex h-[var(--navbar-height)] w-full shrink-0 items-center border-b px-3 transition-shadow duration-200 sm:px-6 lg:px-10 ${
      scrolled
        ? "border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
        : "border-zinc-200/70 bg-white dark:border-zinc-800/70 dark:bg-zinc-950"
    }`}
    >
      <div className="flex w-full min-w-0 items-center gap-2 sm:gap-4 lg:gap-8">
        <Link href="/" className="group shrink-0">
          <div className="flex items-center gap-3">
            <NodeALogo size={46} strokeWidth={4.5} />

            <div className="flex flex-col">
              <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-900 dark:text-white">
                WebAIgen
              </span>

              <span className="mt-1 text-[17px] font-medium leading-none text-zinc-900 dark:text-zinc-100">
                Academy
              </span>
            </div>
          </div>
        </Link>

        <div className="hidden min-w-0 flex-1 justify-center px-2 sm:flex">
          <NavbarSearch lessons={searchableLessons} />
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Link
            href="/blog"
            className="hidden text-sm font-medium text-zinc-700 transition hover:text-[#0E5C58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:text-zinc-300 dark:hover:text-[#85D7CE] sm:block"
          >
            Blog
          </Link>
          {!isSignInPage && userMenu}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
