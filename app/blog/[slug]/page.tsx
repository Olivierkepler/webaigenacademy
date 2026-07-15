import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllBlogSlugs,
  getBlogPostBySlug,
  type BlogPost,
} from "@/app/lib/blog";
import { extractBlogToc } from "@/app/lib/blogHeadings";
import { getRelatedBlogPosts } from "@/app/lib/relatedBlogPosts";
import {
  publicAssetExists,
  resolveSocialImagePath,
  toIsoDate,
} from "@/app/lib/seo";
import { absoluteUrl, getSiteUrl } from "@/app/lib/siteUrl";
import BlogMarkdown, {
  prepareBlogMarkdownContent,
} from "@/app/components/blog/BlogMarkdown";
import BlogTableOfContents from "@/app/components/blog/BlogTableOfContents";
import RelatedBlogPosts from "@/app/components/blog/RelatedBlogPosts";
import JsonLd from "@/app/components/seo/JsonLd";
import Footer from "@/app/components/footer";
import {
  accent,
  accentBadgeClass,
  cardPadding,
  primaryButtonClass,
  secondaryButtonClass,
  typography,
} from "@/app/lib/typography";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const cardClass =
  "rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900";

function formatDate(value: string): string {
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

function Cover({ post }: { post: BlogPost }) {
  const hasCover = publicAssetExists(post.coverImage);

  if (hasCover && post.coverImage) {
    return (
      <figure className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.coverImage}
          alt=""
          className="aspect-[16/9] w-full object-cover"
          loading="eager"
        />
      </figure>
    );
  }

  return (
    <div
      className="flex aspect-[16/9] w-full flex-col justify-end rounded-2xl border border-zinc-200 bg-gradient-to-br from-zinc-100 via-[#0F766E]/10 to-[#0F766E]/25 p-6 dark:border-zinc-800 dark:from-zinc-900 dark:via-[#0F766E]/20 dark:to-[#0B5F59]/40 sm:p-8"
      aria-hidden="true"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${accent.text}`}
      >
        {post.category ?? "Article"}
      </p>
      <p className="mt-2 max-w-2xl text-xl font-semibold text-zinc-900 dark:text-zinc-50 sm:text-2xl">
        {post.title}
      </p>
    </div>
  );
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found | WebAIGen Academy",
    };
  }

  const title = `${post.title} | WebAIGen Academy Blog`;
  const description = post.description;
  const canonical = absoluteUrl(`/blog/${post.slug}`);
  const publishedTime = toIsoDate(post.publishedAt);
  const modifiedTime = toIsoDate(post.updatedAt ?? post.publishedAt);
  const socialImage = resolveSocialImagePath(post.coverImage);
  const ogImages = socialImage
    ? [{ url: socialImage, alt: post.title }]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description,
      url: canonical,
      type: "article",
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      authors: [post.author],
      ...(post.tags.length > 0 ? { tags: post.tags } : {}),
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
    authors: [{ name: post.author }],
    ...(post.tags.length > 0 ? { keywords: post.tags } : {}),
  };
}

function buildArticleJsonLd(post: BlogPost) {
  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const published = toIsoDate(post.publishedAt);
  const modified = toIsoDate(post.updatedAt ?? post.publishedAt);
  // JSON-LD image: cover when the local file exists; otherwise omit (no missing files).
  const articleImage = publicAssetExists(post.coverImage)
    ? absoluteUrl(post.coverImage!)
    : undefined;
  const publisherLogoPath = resolveSocialImagePath(undefined);

  const blogPosting: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    author: {
      "@type": "Organization",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "WebAIGen Academy",
      url: getSiteUrl(),
      ...(publisherLogoPath
        ? {
            logo: {
              "@type": "ImageObject",
              url: absoluteUrl(publisherLogoPath),
            },
          }
        : {}),
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    ...(articleImage ? { image: [articleImage] } : {}),
  };

  const breadcrumb: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: absoluteUrl("/blog"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  return [blogPosting, breadcrumb];
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const showUpdated =
    Boolean(post.updatedAt) &&
    post.updatedAt !== post.publishedAt &&
    Date.parse(post.updatedAt!) !== Date.parse(post.publishedAt);

  const markdown = prepareBlogMarkdownContent(post.content);
  const toc = extractBlogToc(markdown);
  const headingIds = toc.map((item) => item.id);
  const relatedPosts = getRelatedBlogPosts(post, 3);
  const jsonLd = buildArticleJsonLd(post);

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="flex-1 bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mx-auto w-full max-w-3xl px-6 py-10 lg:max-w-6xl lg:px-10 lg:py-14">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link
              href="/blog"
              className={`rounded-sm text-sm font-medium ${accent.text} hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F766E]`}
            >
              ← Back to blog
            </Link>
          </nav>

          <article>
            <header className="mx-auto max-w-3xl lg:max-w-none">
              <div className="flex flex-wrap items-center gap-2">
                {post.category ? (
                  <span className={accentBadgeClass}>
                    <span className={typography.badge}>{post.category}</span>
                  </span>
                ) : null}
                <span className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:text-zinc-300">
                  {post.readingTimeMinutes} min read
                </span>
              </div>

              <h1 className={`mt-5 ${typography.sectionTitle}`}>{post.title}</h1>
              <p className={`mt-4 max-w-3xl ${typography.body}`}>
                {post.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{post.author}</span>
                <span aria-hidden="true">·</span>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                {showUpdated && post.updatedAt ? (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>
                      Updated{" "}
                      <time dateTime={post.updatedAt}>
                        {formatDate(post.updatedAt)}
                      </time>
                    </span>
                  </>
                ) : null}
              </div>

              {post.tags.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <span className="rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-8 max-w-3xl">
                <Cover post={post} />
              </div>
            </header>

            <div
              className={
                toc.length > 0
                  ? "mt-10 grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start lg:gap-10"
                  : "mt-10"
              }
            >
              <BlogTableOfContents items={toc} />
              <div className={`min-w-0 ${cardClass} ${cardPadding}`}>
                <BlogMarkdown content={markdown} headingIds={headingIds} />
              </div>
            </div>

            <aside
              className={`mx-auto mt-10 max-w-3xl ${cardClass} ${cardPadding} lg:max-w-none`}
              aria-label="Continue learning"
            >
              <p className={typography.label}>WebAIGen Academy</p>
              <h2 className={`mt-3 ${typography.cardTitle}`}>
                Practice what you just read
              </h2>
              <p className={`mt-3 ${typography.body}`}>
                Turn these ideas into muscle memory with interactive lessons and
                browser-based practice labs—no local setup required.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/learn/machine-learning"
                  className={primaryButtonClass}
                >
                  Start the ML course
                </Link>
                <Link href="/blog" className={secondaryButtonClass}>
                  More articles
                </Link>
              </div>
            </aside>
          </article>

          <div className="mx-auto max-w-3xl lg:max-w-none">
            <RelatedBlogPosts posts={relatedPosts} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
