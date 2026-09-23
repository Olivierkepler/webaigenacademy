"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createCourse(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!title) {
    throw new Error("Course title is required.");
  }

  const slug = normalizeSlug(rawSlug || title);

  if (!slug) {
    throw new Error("A valid course slug is required.");
  }

  const allowedStatuses = new Set(["draft", "published", "archived"]);

  if (!allowedStatuses.has(status)) {
    throw new Error("Invalid course status.");
  }

  await sql`
    INSERT INTO courses (
      slug,
      title,
      description,
      category,
      status
    )
    VALUES (
      ${slug},
      ${title},
      ${description || null},
      ${category || null},
      ${status}
    )
  `;

  revalidatePath("/admin");
  revalidatePath("/admin/courses");

  redirect("/admin/courses");
}

export async function updateCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  if (!title) {
    throw new Error("Course title is required.");
  }

  const slug = normalizeSlug(rawSlug || title);

  if (!slug) {
    throw new Error("A valid course slug is required.");
  }

  const allowedStatuses = new Set([
    "draft",
    "published",
    "archived",
  ]);

  if (!allowedStatuses.has(status)) {
    throw new Error("Invalid course status.");
  }

  const duplicate = (await sql`
    SELECT id
    FROM courses
    WHERE slug = ${slug}
      AND id <> ${courseId}
    LIMIT 1
  `) as { id: string }[];

  if (duplicate.length > 0) {
    throw new Error("Another course already uses this slug.");
  }

  const updated = (await sql`
    UPDATE courses
    SET
      slug = ${slug},
      title = ${title},
      description = ${description || null},
      category = ${category || null},
      status = ${status},
      updated_at = NOW()
    WHERE id = ${courseId}
    RETURNING id
  `) as { id: string }[];

  if (updated.length === 0) {
    throw new Error("Course not found.");
  }

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);

  /*
   * The learner URL may change when the slug or publishing
   * status changes, so refresh the learner route as well.
   */
  revalidatePath(`/learn/${slug}`);

  redirect(`/admin/courses/${courseId}`);
}