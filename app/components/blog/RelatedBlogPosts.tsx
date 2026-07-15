import Link from "next/link";
import type { BlogPost } from "@/app/lib/blog";
import {
  accent,
  accentBadgeClass,
  cardPadding,
  typography,
} from "@/app/lib/typography";

type RelatedBlogPostsProps = {
  posts: BlogPost[];
};

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors hover:border-[#0F766E]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-[#5EEAD4]/40";

export default function RelatedBlogPosts({ posts }: RelatedBlogPostsProps) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-articles-heading" className="mt-10">
      <h2 id="related-articles-heading" className={typography.sectionTitle}>
        Related articles
      </h2>
      <p className={`mt-2 ${typography.body}`}>
        More reading nearby—same topics, next ideas.
      </p>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className={`flex h-full flex-col ${cardClass} ${cardPadding}`}
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
              <h3 className={`mt-3 ${typography.cardTitle}`}>
                <span className={accent.text}>{post.title}</span>
              </h3>
              <p className={`mt-2 line-clamp-3 flex-1 ${typography.small}`}>
                {post.description}
              </p>
              <span
                className={`mt-4 text-sm font-medium ${accent.text}`}
              >
                Read article →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
