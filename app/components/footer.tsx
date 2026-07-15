import Link from "next/link";

const COURSE_PATH = "/learn/machine-learning";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const footerColumns: ReadonlyArray<{
  heading: string;
  links: readonly FooterLink[];
}> = [
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
      { label: "Blog", href: "/blog" },
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
      { label: "WebAiGen Agency", href: "https://webaigen.com", external: true },
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

const focusRing =
  "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#003334]";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-[#0B4A4B] bg-[#003334] text-white">
      {/* Subtle grid texture, fading in toward the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.12] [mask-image:linear-gradient(to_bottom,transparent,black_60%)]"
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-x-8 gap-y-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand column */}
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Link href="/" className={`inline-flex items-baseline gap-1.5 ${focusRing}`}>
              <span className="text-lg font-semibold tracking-tight text-white">
                WebAiGen
              </span>
              <span className="text-lg font-light tracking-tight text-white/60">
                Academy
              </span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-white/65">
              Interactive AI and machine learning education. Lessons,
              notebooks, and quizzes — all in the browser.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`${social.label} (opens in a new tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white ${focusRing} focus-visible:rounded-full`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {footerColumns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/40">
                {column.heading}
              </p>

              <ul className="mt-4 space-y-3">
                {column.links.map((link) => {
                  const linkClasses = `text-sm text-white/65 transition-colors duration-200 hover:text-white hover:underline hover:underline-offset-4 hover:decoration-white/30 ${focusRing}`;

                  return (
                    <li key={link.label}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${linkClasses} inline-flex items-center gap-1`}
                        >
                          {link.label}
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3 w-3 opacity-50"
                            aria-hidden="true"
                          >
                            <path d="M7 17L17 7M17 7H8M17 7v9" />
                          </svg>
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClasses}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/45">
            © {year} WebAiGen LLC. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-2 text-xs text-white/50">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              All systems operational
            </span>

            <span aria-hidden="true" className="hidden h-3 w-px bg-white/15 sm:block" />

            <p className="text-xs text-white/35">
              Built in Boston · English · Français · Kreyòl
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}