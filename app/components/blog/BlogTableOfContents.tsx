import type { BlogTocItem } from "@/app/lib/blogHeadings";
import { typography } from "@/app/lib/typography";

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
      className="rounded-2xl border border-zinc-200 bg-white shadow-sm open:pb-4 dark:border-zinc-800 dark:bg-zinc-900 lg:sticky lg:top-24"
    >
      <summary
        className={`cursor-pointer list-none rounded-2xl px-5 py-4 marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] [&::-webkit-details-marker]:hidden ${typography.cardTitle}`}
      >
        <span className="flex items-center justify-between gap-3">
          <span>On this page</span>
          <span
            className="text-sm font-medium text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          >
            ⌄
          </span>
        </span>
      </summary>

      <nav aria-label="Table of contents" className="px-5 pb-1">
        <ol className="max-h-[min(70vh,28rem)] space-y-2 overflow-y-auto border-t border-zinc-100 pt-3 dark:border-zinc-800">
          {items.map((item) => (
            <li
              key={item.id}
              className={item.level === 3 ? "ml-4" : undefined}
            >
              <a
                href={`#${item.id}`}
                className={`block rounded-sm text-sm leading-snug text-zinc-600 transition-colors hover:text-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:text-zinc-300 dark:hover:text-[#5EEAD4] ${
                  item.level === 2 ? "font-medium" : ""
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
