import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rows = await sql`
      SELECT course_slug, lesson_slug, completed_at
      FROM lesson_progress
      WHERE user_id = ${userId}
    `;

    return NextResponse.json(rows);
  } catch (error) {
    console.error("[api/progress] GET failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const courseSlug =
    typeof body === "object" &&
    body !== null &&
    "courseSlug" in body &&
    typeof (body as { courseSlug: unknown }).courseSlug === "string"
      ? (body as { courseSlug: string }).courseSlug.trim()
      : "";

  const lessonSlug =
    typeof body === "object" &&
    body !== null &&
    "lessonSlug" in body &&
    typeof (body as { lessonSlug: unknown }).lessonSlug === "string"
      ? (body as { lessonSlug: string }).lessonSlug.trim()
      : "";

  const completed =
    typeof body === "object" &&
    body !== null &&
    "completed" in body &&
    typeof (body as { completed: unknown }).completed === "boolean"
      ? (body as { completed: boolean }).completed
      : undefined;

  if (!courseSlug || !lessonSlug || completed === undefined) {
    return NextResponse.json(
      { error: "courseSlug, lessonSlug, and completed are required" },
      { status: 400 }
    );
  }

  try {
    if (completed) {
      await sql`
        INSERT INTO lesson_progress (user_id, course_slug, lesson_slug)
        VALUES (${userId}, ${courseSlug}, ${lessonSlug})
        ON CONFLICT (user_id, course_slug, lesson_slug) DO NOTHING
      `;
    } else {
      await sql`
        DELETE FROM lesson_progress
        WHERE user_id = ${userId}
          AND course_slug = ${courseSlug}
          AND lesson_slug = ${lessonSlug}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[api/progress] POST failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
