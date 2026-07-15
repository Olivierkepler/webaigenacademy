import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/app/lib/blog";
import { absoluteUrl } from "@/app/lib/siteUrl";
import { lessons } from "@/data/lessons";

function lastModifiedFromBlogDates(
  publishedAt: string,
  updatedAt?: string
): Date | undefined {
  const raw = updatedAt ?? publishedAt;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/try"),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const courses = [...new Set(lessons.map((lesson) => lesson.course))];
  for (const course of courses) {
    entries.push({
      url: absoluteUrl(`/learn/${course}`),
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const lesson of lessons) {
    entries.push({
      url: absoluteUrl(`/learn/${lesson.course}/${lesson.slug}`),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  for (const post of getAllBlogPosts()) {
    entries.push({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: lastModifiedFromBlogDates(post.publishedAt, post.updatedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return entries;
}
