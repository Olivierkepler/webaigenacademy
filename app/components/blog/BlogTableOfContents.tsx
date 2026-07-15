import type { BlogTocItem } from "@/app/lib/blogHeadings";

type BlogTableOfContentsProps = {
  items: BlogTocItem[];
};

export default function BlogTableOfContents({
  items,
}: BlogTableOfContentsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <details
      open
      className="group w-full rounded-xl border border-zinc-200/80 bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.04)] open:pb-2 dark:border-zinc-800 dark:bg-zinc-900/90 dark:shadow-none lg:w-[280px] lg:max-w-[280px] lg:shrink-0"
    >
      <summary className="cursor-pointer list-none rounded-xl px-3.5 py-3 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:focus-visible:outline-[#5EEAD4] [&::-webkit-details-marker]:hidden">
        <span className="flex items-start justify-between gap-2">
          <span className="min-w-0">
            <span className="block text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
              Contents
            </span>
            <span className="mt-0.5 block text-sm font-semibold leading-snug text-zinc-900 dark:text-zinc-50">
              On this page
            </span>
          </span>
          <span
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-zinc-200 text-zinc-400 transition group-open:rotate-180 dark:border-zinc-700 dark:text-zinc-500"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-3 w-3"
            >
              <path
                d="M5 8l5 5 5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </summary>

      <nav aria-label="Table of contents" className="px-1.5 pb-1">
        <ol className="max-h-[min(70vh,28rem)] space-y-0.5 overflow-y-auto border-t border-zinc-100 px-1.5 pt-2 dark:border-zinc-800">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block rounded-md py-1 transition-colors hover:bg-[#0F766E]/6 hover:text-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:hover:bg-[#5EEAD4]/10 dark:hover:text-[#5EEAD4] dark:focus-visible:outline-[#5EEAD4] ${
                  item.level === 2
                    ? "px-2 text-[13px] font-medium leading-snug text-zinc-700 dark:text-zinc-200"
                    : "ml-2 border-l border-zinc-200 px-2.5 text-[12px] leading-snug text-zinc-500 dark:border-zinc-700 dark:text-zinc-400"
                }`}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
