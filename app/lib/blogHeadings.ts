/**
 * Shared heading slug helpers for blog TOC extraction and rendered Markdown IDs.
 * Both paths must call `slugifyHeading` + the same allocator order so anchors match.
 */

export type BlogTocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

/** Readable, URL-safe slug from plain heading text. */
export function slugifyHeading(text: string): string {
  const slug = text
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

/**
 * Returns an allocator that yields unique IDs in document order.
 * First "Goals" → `goals`, next → `goals-1`, then `goals-2`, …
 */
export function createHeadingIdAllocator(): (text: string) => string {
  const seen = new Map<string, number>();

  return (text: string) => {
    const base = slugifyHeading(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}

function stripMarkdownInline(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/\\([\\`*_{}[\]()#+\-.!])/g, "$1")
    .trim();
}

function isFenceToggle(line: string): boolean {
  return /^(\s{0,3})(`{3,}|~{3,})/.test(line);
}

/**
 * Collect H2/H3 headings from Markdown (ATX), skipping fenced code blocks.
 * IDs are assigned with `createHeadingIdAllocator` in source order.
 */
export function extractBlogToc(markdown: string): BlogTocItem[] {
  const allocate = createHeadingIdAllocator();
  const items: BlogTocItem[] = [];
  let inFence = false;

  for (const line of markdown.split(/\r?\n/)) {
    if (isFenceToggle(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!match) {
      continue;
    }

    const level = match[1].length as 2 | 3;
    const text = stripMarkdownInline(match[2]);
    if (!text) {
      continue;
    }

    items.push({
      id: allocate(text),
      text,
      level,
    });
  }

  return items;
}
