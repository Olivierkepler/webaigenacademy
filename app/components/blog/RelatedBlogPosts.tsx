import Link from "next/link";
import type { BlogPost } from "@/app/lib/blog";
import { accent, accentBadgeClass, typography } from "@/app/lib/typography";

type RelatedBlogPostsProps = {
  posts: BlogPost[];
};

export default function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="related-articles-heading"
      className="mt-16 border-t border-zinc-200/80 pt-14 dark:border-zinc-800 sm:mt-20 sm:pt-16"
    >
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-400 dark:text-zinc-500">
          Keep exploring
        </p>
        <h2
          id="related-articles-heading"
          className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50 sm:text-[1.75rem]"
        >
          Related articles
        </h2>
        <p className="mt-2 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-400">
          More reading nearby—same topics, next ideas.
        </p>
      </div>

      <ul className="mt-8 grid auto-rows-fr gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {posts.map((post) => (
          <li key={post.slug} className="h-full">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-[#0F766E]/35 hover:bg-[#0F766E]/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none dark:hover:border-[#5EEAD4]/35 dark:hover:bg-[#5EEAD4]/[0.03] dark:focus-visible:outline-[#5EEAD4] sm:p-6"
            >
              <div className="flex flex-wrap items-center gap-2">
                {post.category ? (
                  <span className={accentBadgeClass}>
                    <span className={typography.badge}>{post.category}</span>
                  </span>
                ) : null}
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                  {post.readingTimeMinutes} min read
                </span>
              </div>

              <h3 className="mt-4 text-base font-semibold leading-snug tracking-tight text-zinc-950 transition-colors group-hover:text-[#0F766E] dark:text-zinc-50 dark:group-hover:text-[#5EEAD4]">
                {post.title}
              </h3>

              <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {post.description}
              </p>

              <span
                className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${accent.text}`}
              >
                Read article
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
