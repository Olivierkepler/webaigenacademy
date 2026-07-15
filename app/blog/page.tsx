import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { getAllBlogPosts, type BlogPost } from "@/app/lib/blog";
import { getDefaultSocialImagePath } from "@/app/lib/seo";
import { absoluteUrl } from "@/app/lib/siteUrl";
import Footer from "@/app/components/footer";
import {
  accent,
  accentBadgeClass,
  cardPadding,
  primaryButtonClass,
  typography,
} from "@/app/lib/typography";

const blogTitle = "Blog | WebAIGen Academy";
const blogDescription =
  "Beginner-friendly articles on Python, machine learning, and decision trees from WebAIGen Academy.";
const blogUrl = absoluteUrl("/blog");
const blogSocialImage = getDefaultSocialImagePath();

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  alternates: {
    canonical: blogUrl,
  },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: blogUrl,
    type: "website",
    ...(blogSocialImage
      ? { images: [{ url: blogSocialImage, alt: "WebAIGen Academy" }] }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: blogTitle,
    description: blogDescription,
    ...(blogSocialImage ? { images: [blogSocialImage] } : {}),
  },
};

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

function formatPublishedDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function publicImageExists(coverImage: string | undefined): boolean {
  if (!coverImage || !coverImage.startsWith("/")) {
    return false;
  }

  const relative = coverImage.replace(/^\/+/, "");
  const absolute = path.join(process.cwd(), "public", relative);
  return fs.existsSync(absolute);
}

function CoverMedia({
  post,
  priority = false,
}: {
  post: BlogPost;
  priority?: boolean;
}) {
  const hasCover = publicImageExists(post.coverImage);

  if (hasCover && post.coverImage) {
    return (
      // Native img avoids next/image hard-fail when assets are placeholders.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={post.coverImage}
        alt=""
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  return (
    <div
      className={`flex h-full w-full flex-col justify-end bg-gradient-to-br from-zinc-100 via-[#0F766E]/10 to-[#0F766E]/25 p-6 dark:from-zinc-900 dark:via-[#0F766E]/20 dark:to-[#0B5F59]/40 ${
        priority ? "min-h-[16rem] sm:min-h-[18rem]" : ""
      }`}
      aria-hidden="true"
    >
      <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent.text}`}>
        {post.category ?? "Article"}
      </p>
      <p className="mt-2 line-clamp-2 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
        {post.title}
      </p>
    </div>
  );
}

function PostMetaRow({ post }: { post: BlogPost }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
      <span>{post.author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={post.publishedAt}>
        {formatPublishedDate(post.publishedAt)}
      </time>
      <span aria-hidden="true">·</span>
      <span>
        {post.readingTimeMinutes} min read
      </span>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li key={tag}>
          <span
            className={`rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300`}
          >
            {tag}
          </span>
        </li>
      ))}
    </ul>
  );
}

function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className={`overflow-hidden ${cardClass}`}>
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]">
          <CoverMedia post={post} priority />
        </div>

        <div className={`${cardPadding} flex flex-col justify-center`}>
          <div className="flex flex-wrap items-center gap-2">
            <span className={accentBadgeClass}>
              <span className={typography.badge}>Featured</span>
            </span>
            {post.category ? (
              <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                {post.category}
              </span>
            ) : null}
          </div>

          <h2 className={`mt-4 ${typography.sectionTitle}`}>
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-sm transition hover:text-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:hover:text-[#5EEAD4]"
            >
              {post.title}
            </Link>
          </h2>

          <p className={`mt-4 ${typography.body}`}>{post.description}</p>

          <PostMetaRow post={post} />
          <TagList tags={post.tags} />

          <div className="mt-8">
            <Link href={`/blog/${post.slug}`} className={primaryButtonClass}>
              Read article
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className={`flex h-full flex-col overflow-hidden ${cardClass}`}>
      <div className="aspect-[16/10] overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <CoverMedia post={post} />
      </div>

      <div className="flex flex-1 flex-col p-6">
        {post.category ? (
          <p className={`text-xs font-semibold uppercase tracking-[0.16em] ${accent.text}`}>
            {post.category}
          </p>
        ) : null}

        <h3 className={`mt-3 ${typography.cardTitle}`}>
          <Link
            href={`/blog/${post.slug}`}
            className="rounded-sm transition hover:text-[#0F766E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E] dark:hover:text-[#5EEAD4]"
          >
            {post.title}
          </Link>
        </h3>

        <p className={`mt-3 line-clamp-3 ${typography.caption}`}>
          {post.description}
        </p>

        <PostMetaRow post={post} />
        <TagList tags={post.tags} />

        <div className="mt-auto pt-6">
          <Link
            href={`/blog/${post.slug}`}
            className={`inline-flex items-center gap-1 rounded-sm text-sm font-semibold ${accent.text} hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]`}
          >
            Read article
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const featured =
    posts.find((post) => post.featured) ?? posts[0] ?? null;
  const remaining = featured
    ? posts.filter((post) => post.slug !== featured.slug)
    : posts;

  return (
    <>
      <main className="flex-1 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 lg:py-16">
          <header className="max-w-3xl">
            <p className={typography.label}>Blog</p>
            <h1 className={`mt-3 ${typography.sectionTitle}`}>
              Learn AI and Python, one clear article at a time
            </h1>
            <p className={`mt-4 ${typography.body}`}>
              Practical guides for beginners—roadmaps, core machine-learning
              ideas, and explainable models you can practice inside WebAIGen
              Academy.
            </p>
          </header>

          {posts.length === 0 ? (
            <section className={`mt-12 ${cardClass} ${cardPadding}`}>
              <h2 className={typography.cardTitle}>No articles yet</h2>
              <p className={`mt-3 ${typography.body}`}>
                Published posts will appear here soon.
              </p>
            </section>
          ) : (
            <>
              {featured ? (
                <section className="mt-12" aria-labelledby="featured-heading">
                  <h2 id="featured-heading" className="sr-only">
                    Featured article
                  </h2>
                  <FeaturedPost post={featured} />
                </section>
              ) : null}

              {remaining.length > 0 ? (
                <section className="mt-14" aria-labelledby="latest-heading">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className={typography.label}>Library</p>
                      <h2
                        id="latest-heading"
                        className={`mt-2 ${typography.cardTitle}`}
                      >
                        More articles
                      </h2>
                    </div>
                  </div>

                  <ul className="mt-8 grid list-none gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {remaining.map((post) => (
                      <li key={post.slug} className="h-full">
                        <PostCard post={post} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
