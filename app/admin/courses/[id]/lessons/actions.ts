"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { recalculateCourseEnrollments } from "@/lib/courses";

function normalizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createLesson(
  courseId: string,
  formData: FormData
) {
  const title = String(formData.get("title") ?? "").trim();
  const rawSlug = String(formData.get("slug") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const status = String(formData.get("status") ?? "draft").trim();

  if (!courseId) {
    throw new Error("Course ID is required.");
  }

  if (!title) {
    throw new Error("Lesson title is required.");
  }

  const slug = normalizeSlug(rawSlug || title);

  if (!slug) {
    throw new Error("A valid lesson slug is required.");
  }

  const allowedStatuses = new Set([
    "draft",
    "published",
    "archived",
  ]);

  if (!allowedStatuses.has(status)) {
    throw new Error("Invalid lesson status.");
  }

  const courses = (await sql`
    SELECT id
    FROM courses
    WHERE id = ${courseId}
    LIMIT 1
  `) as { id: string }[];

  if (!courses[0]) {
    throw new Error("Course not found.");
  }

  const positions = (await sql`
    SELECT COALESCE(MAX(position), -1) + 1 AS next_position
    FROM lessons
    WHERE course_id = ${courseId}
  `) as { next_position: number | string }[];

  const position = Number(positions[0]?.next_position ?? 0);

  await sql`
    INSERT INTO lessons (
      course_id,
      slug,
      title,
      description,
      position,
      status
    )
    VALUES (
      ${courseId},
      ${slug},
      ${title},
      ${description || null},
      ${position},
      ${status}
    )
  `;

  await recalculateCourseEnrollments(courseId);

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);

  redirect(`/admin/courses/${courseId}`);
}

export async function updateLesson(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "").trim();
  const lessonId = String(formData.get("lessonId") ?? "").trim();

  const title = String(formData.get("title") ?? "").trim();

  const rawSlug = String(formData.get("slug") ?? "").trim();
  const slug = normalizeSlug(rawSlug);

  const description =
    String(formData.get("description") ?? "").trim() || null;

  const section =
    String(formData.get("section") ?? "").trim() || null;

  const difficultyValue =
    String(formData.get("difficulty") ?? "").trim();

  const difficulty =
    difficultyValue === "" ? null : difficultyValue;

  const duration =
    String(formData.get("duration") ?? "").trim() || null;

  const content =
    String(formData.get("content") ?? "").trim() || null;

  const status =
    String(formData.get("status") ?? "draft").trim();

  const positionValue = Number(formData.get("position"));

  if (!courseId || !lessonId) {
    throw new Error("Course ID and lesson ID are required.");
  }

  if (!title) {
    throw new Error("Lesson title is required.");
  }

  if (!slug) {
    throw new Error("Lesson slug is required.");
  }

  if (!["draft", "published", "archived"].includes(status)) {
    throw new Error("Invalid lesson status.");
  }

  if (
    difficulty !== null &&
    !["beginner", "intermediate", "advanced"].includes(difficulty)
  ) {
    throw new Error("Invalid lesson difficulty.");
  }

  if (!Number.isInteger(positionValue) || positionValue < 0) {
    throw new Error("Lesson position must be 0 or greater.");
  }

  const existing = (await sql`
    SELECT id
    FROM lessons
    WHERE course_id = ${courseId}
      AND slug = ${slug}
      AND id <> ${lessonId}
    LIMIT 1
  `) as { id: string }[];

  if (existing.length > 0) {
    throw new Error(
      "Another lesson in this course already uses this slug."
    );
  }

  const updated = (await sql`
    UPDATE lessons
    SET
      title = ${title},
      slug = ${slug},
      description = ${description},
      section = ${section},
      difficulty = ${difficulty},
      duration = ${duration},
      content = ${content},
      position = ${positionValue},
      status = ${status},
      updated_at = NOW()
    WHERE id = ${lessonId}
      AND course_id = ${courseId}
    RETURNING id
  `) as { id: string }[];

  if (updated.length === 0) {
    throw new Error("Lesson not found.");
  }

  await recalculateCourseEnrollments(courseId);

  revalidatePath("/admin");
  revalidatePath("/admin/courses");
  revalidatePath(`/admin/courses/${courseId}`);
  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}`
  );
  revalidatePath(
    `/admin/courses/${courseId}/lessons/${lessonId}/edit`
  );

  redirect(
    `/admin/courses/${courseId}/lessons/${lessonId}`
  );
}