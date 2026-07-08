import Link from "next/link";
import { typography } from "@/app/lib/typography";

const COURSE_PATH = "/learn/machine-learning";

const footerColumns = [
  {
    heading: "Learn",
    links: [
      { label: "Machine Learning", href: COURSE_PATH },
      { label: "Introduction", href: `${COURSE_PATH}/introduction` },
      { label: "Decision Trees", href: `${COURSE_PATH}/decision-trees` },
      { label: "Random Forest", href: `${COURSE_PATH}/random-forest` },
    ],
  },
  {
    heading: "Platform",
    links: [
      { label: "Practice Labs", href: "/labs" },
      { label: "Quizzes", href: "/quizzes" },
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "WebAiGen Agency", href: "https://webaigen.com" },
      { label: "Contact", href: "/connect" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Settings", href: "/cookies" },
    ],
  },
] as const;

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.35 1.12 2.92.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
      </svg>
    ),
  },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      {/* Faint grid texture, echoing the page background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(113,113,122,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(113,113,122,0.18)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.15] dark:opacity-[0.1] [mask-image:linear-gradient(to_bottom,transparent,black_60%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        {/* Top band: brand + link columns */}
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)] lg:gap-8">
          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-baseline gap-1.5">
              <span className="text-lg font-semibold tracking-tight">
                WebAIGen
              </span>
              <span className="text-lg font-light tracking-tight text-zinc-500 dark:text-zinc-400">
                Academy
              </span>
            </Link>
            <p className={`mt-4 ${typography.caption}`}>
              Interactive AI and machine learning education. Lessons,
              notebooks, and quizzes — all in the browser.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100 dark:focus-visible:outline-zinc-100"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400 dark:text-zinc-500">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-zinc-200 py-8 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {year} WebAiGen LLC. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* Status indicator */}
            <span className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-500">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </span>

            <span className="hidden h-3 w-px bg-zinc-200 dark:bg-zinc-800 sm:block" />

            <p className="text-xs text-zinc-400 dark:text-zinc-600">
              Built in Boston · English · Français · Kreyòl
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}