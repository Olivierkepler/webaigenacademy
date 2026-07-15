import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Frontmatter metadata for a blog post under `content/blog`.
 * The canonical slug always comes from the filename (not frontmatter).
 */
export type BlogPostMeta = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category?: string;
  tags: string[];
  coverImage?: string;
  featured: boolean;
  draft: boolean;
};

export type BlogPost = BlogPostMeta & {
  slug: string;
  content: string;
  readingTimeMinutes: number;
};

export type BlogQueryOptions = {
  /** When true, include posts with `draft: true`. Defaults to false. */
  includeDrafts?: boolean;
};

const BLOG_DIRECTORY = path.join(process.cwd(), "content", "blog");
const WORDS_PER_MINUTE = 200;

const REQUIRED_FIELDS = [
  "title",
  "description",
  "publishedAt",
  "author",
] as const;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDateString(value: string): boolean {
  const timestamp = Date.parse(value);
  return !Number.isNaN(timestamp);
}

function normalizeTags(value: unknown): string[] | null {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    return null;
  }

  if (!value.every((tag) => typeof tag === "string")) {
    return null;
  }

  return value.map((tag) => tag.trim()).filter(Boolean);
}

function normalizeBoolean(value: unknown, fallback: boolean): boolean | null {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return null;
}

/**
 * Rough reading-time estimate from markdown body text.
 * Strips common markdown noise, then assumes ~200 words/minute.
 */
export function estimateReadingTimeMinutes(markdown: string): number {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!plain) {
    return 1;
  }

  const words = plain.split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

function validateAndNormalizeMeta(
  data: Record<string, unknown>,
  filename: string
): BlogPostMeta | null {
  for (const field of REQUIRED_FIELDS) {
    if (!isNonEmptyString(data[field])) {
      console.warn(
        `[blog] Skipping "${filename}": missing or invalid required field "${field}".`
      );
      return null;
    }
  }

  const title = (data.title as string).trim();
  const description = (data.description as string).trim();
  const publishedAt = (data.publishedAt as string).trim();
  const author = (data.author as string).trim();

  if (!isValidDateString(publishedAt)) {
    console.warn(
      `[blog] Skipping "${filename}": "publishedAt" is not a valid date ("${publishedAt}").`
    );
    return null;
  }

  let updatedAt: string | undefined;
  if (data.updatedAt !== undefined && data.updatedAt !== null) {
    if (!isNonEmptyString(data.updatedAt) || !isValidDateString(data.updatedAt)) {
      console.warn(
        `[blog] Skipping "${filename}": "updatedAt" is not a valid date.`
      );
      return null;
    }
    updatedAt = data.updatedAt.trim();
  }

  let category: string | undefined;
  if (data.category !== undefined && data.category !== null) {
    if (!isNonEmptyString(data.category)) {
      console.warn(
        `[blog] Skipping "${filename}": "category" must be a non-empty string when provided.`
      );
      return null;
    }
    category = data.category.trim();
  }

  const tags = normalizeTags(data.tags);
  if (tags === null) {
    console.warn(
      `[blog] Skipping "${filename}": "tags" must be an array of strings when provided.`
    );
    return null;
  }

  let coverImage: string | undefined;
  if (data.coverImage !== undefined && data.coverImage !== null) {
    if (!isNonEmptyString(data.coverImage)) {
      console.warn(
        `[blog] Skipping "${filename}": "coverImage" must be a non-empty string when provided.`
      );
      return null;
    }
    coverImage = data.coverImage.trim();
  }

  const featured = normalizeBoolean(data.featured, false);
  if (featured === null) {
    console.warn(
      `[blog] Skipping "${filename}": "featured" must be a boolean when provided.`
    );
    return null;
  }

  const draft = normalizeBoolean(data.draft, false);
  if (draft === null) {
    console.warn(
      `[blog] Skipping "${filename}": "draft" must be a boolean when provided.`
    );
    return null;
  }

  return {
    title,
    description,
    publishedAt,
    updatedAt,
    author,
    category,
    tags,
    coverImage,
    featured,
    draft,
  };
}

function ensureBlogDirectory(): void {
  if (!fs.existsSync(BLOG_DIRECTORY)) {
    fs.mkdirSync(BLOG_DIRECTORY, { recursive: true });
  }
}

function listMarkdownFilenames(): string[] {
  ensureBlogDirectory();

  try {
    return fs
      .readdirSync(BLOG_DIRECTORY)
      .filter((name) => name.endsWith(".md") && !name.startsWith("."));
  } catch (error) {
    console.warn("[blog] Failed to read blog directory:", error);
    return [];
  }
}

function parseBlogFile(filename: string): BlogPost | null {
  const fullPath = path.join(BLOG_DIRECTORY, filename);

  try {
    const raw = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(raw);
    const meta = validateAndNormalizeMeta(
      data as Record<string, unknown>,
      filename
    );

    if (!meta) {
      return null;
    }

    const slug = filename.replace(/\.md$/i, "");

    if (!slug) {
      console.warn(`[blog] Skipping "${filename}": empty slug.`);
      return null;
    }

    return {
      ...meta,
      slug,
      content: content.trim(),
      readingTimeMinutes: estimateReadingTimeMinutes(content),
    };
  } catch (error) {
    console.warn(`[blog] Skipping "${filename}": failed to parse file.`, error);
    return null;
  }
}

function loadAllPosts(): BlogPost[] {
  const posts = listMarkdownFilenames()
    .map(parseBlogFile)
    .filter((post): post is BlogPost => post !== null);

  return posts.sort((a, b) => {
    const aTime = Date.parse(a.publishedAt);
    const bTime = Date.parse(b.publishedAt);
    return bTime - aTime;
  });
}

function filterDrafts(
  posts: BlogPost[],
  includeDrafts: boolean | undefined
): BlogPost[] {
  if (includeDrafts) {
    return posts;
  }
  return posts.filter((post) => !post.draft);
}

/**
 * Returns published blog posts sorted by `publishedAt` (newest first).
 * Pass `{ includeDrafts: true }` to include draft posts for internal use.
 */
export function getAllBlogPosts(options: BlogQueryOptions = {}): BlogPost[] {
  return filterDrafts(loadAllPosts(), options.includeDrafts);
}

/**
 * Returns a single post by filename slug, or `null` when missing/invalid/draft
 * (unless `includeDrafts` is enabled).
 */
export function getBlogPostBySlug(
  slug: string,
  options: BlogQueryOptions = {}
): BlogPost | null {
  if (!slug || slug.includes("/") || slug.includes("\\") || slug.includes("..")) {
    return null;
  }

  const filename = `${slug}.md`;
  const post = parseBlogFile(filename);

  if (!post) {
    return null;
  }

  if (post.draft && !options.includeDrafts) {
    return null;
  }

  return post;
}

/**
 * Returns slugs for posts visible under the given draft policy,
 * sorted the same way as `getAllBlogPosts`.
 */
export function getAllBlogSlugs(options: BlogQueryOptions = {}): string[] {
  return getAllBlogPosts(options).map((post) => post.slug);
}
