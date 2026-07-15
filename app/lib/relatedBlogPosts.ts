import { getAllBlogPosts, type BlogPost } from "@/app/lib/blog";

type ScoredPost = {
  post: BlogPost;
  categoryMatch: number;
  sharedTags: number;
};

/**
 * Rank published posts related to `current`:
 * 1. Same category wins
 * 2. Then more shared tags
 * 3. Then newer `publishedAt`
 *
 * Excludes the current post. Caps at `limit` (default 3).
 * Only includes posts that share category or at least one tag.
 */
export function getRelatedBlogPosts(
  current: BlogPost,
  limit = 3
): BlogPost[] {
  const currentTagSet = new Set(
    current.tags.map((tag) => tag.toLowerCase())
  );
  const currentCategory = current.category?.trim().toLowerCase() ?? "";

  const scored: ScoredPost[] = getAllBlogPosts()
    .filter((post) => post.slug !== current.slug)
    .map((post) => {
      const categoryMatch =
        currentCategory &&
        post.category?.trim().toLowerCase() === currentCategory
          ? 1
          : 0;
      const sharedTags = post.tags.reduce((count, tag) => {
        return currentTagSet.has(tag.toLowerCase()) ? count + 1 : count;
      }, 0);

      return { post, categoryMatch, sharedTags };
    })
    .filter((item) => item.categoryMatch === 1 || item.sharedTags > 0);

  scored.sort((a, b) => {
    if (b.categoryMatch !== a.categoryMatch) {
      return b.categoryMatch - a.categoryMatch;
    }
    if (b.sharedTags !== a.sharedTags) {
      return b.sharedTags - a.sharedTags;
    }
    return Date.parse(b.post.publishedAt) - Date.parse(a.post.publishedAt);
  });

  return scored.slice(0, limit).map((item) => item.post);
}
