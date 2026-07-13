"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export type SubNavItem = {
  label: string;
  href: string;
  /**
   * When set, the tab is active if the pathname starts with this
   * prefix (e.g. "/learn/machine-learning/" keeps the Course tab
   * active on every lesson page). Otherwise: exact pathname match.
   */
  activePrefix?: string;
};

type SubNavClientProps = {
  items: SubNavItem[];
  ariaLabel?: string;
};

export default function SubNavClient({
  items,
  ariaLabel = "Course sections",
}: SubNavClientProps) {
  const pathname = usePathname();
  const trackRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  const isItemActive = useCallback(
    (item: SubNavItem) => {
      if (item.activePrefix) return pathname.startsWith(item.activePrefix);
      return pathname === item.href.split("#")[0]; // ignore hash targets
    },
    [pathname]
  );

  // Track overflow so we can hint scrollability with an edge fade
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () =>
      setIsOverflowing(track.scrollWidth > track.clientWidth + 4);

    update();
    const observer = new ResizeObserver(update);
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  // Bring the active tab into view on navigation
  useEffect(() => {
    activeRef.current?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <nav
      aria-label={ariaLabel}
      className="relative px-6 lg:px-10 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
    >
      <ul
        ref={trackRef}
        className="flex gap-8 overflow-x-auto px-6 [scrollbar-width:none] lg:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => {
          const active = isItemActive(item);

          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                ref={active ? activeRef : undefined}
                aria-current={active ? "page" : undefined}
                className={`relative flex h-12 items-center whitespace-nowrap text-[15px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:focus-visible:outline-[#85D7CE] ${
                  active
                    ? "font-semibold text-zinc-950 dark:text-white"
                    : "font-medium text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                {item.label}

                {/* Underline indicator */}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 h-[3px] rounded-t-full transition-colors ${
                    active
                      ? "bg-[#0E5C58] dark:bg-[#85D7CE]"
                      : "bg-transparent"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right edge fade — hints that more tabs are scrollable */}
      {isOverflowing && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent dark:from-zinc-950"
        />
      )}
    </nav>
  );
}