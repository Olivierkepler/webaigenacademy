import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { resolveSessionUserId } from "@/lib/sessionUser";

export async function POST(request: Request) {
  const session = await auth();
  const userId = await resolveSessionUserId(session);

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const courseSlug =
    typeof body === "object" &&
    body !== null &&
    "courseSlug" in body &&
    typeof (body as { courseSlug: unknown }).courseSlug === "string"
      ? (body as { courseSlug: string }).courseSlug.trim()
      : "";

  if (!courseSlug) {
    return NextResponse.json(
      { error: "courseSlug is required" },
      { status: 400 }
    );
  }

  try {
    const courses = (await sql`
      SELECT id
      FROM courses
      WHERE slug = ${courseSlug}
        AND status = 'published'
      LIMIT 1
    `) as unknown as Array<{ id: string }>;
    
    const course = courses[0];

    if (!course || typeof course.id !== "string") {
      return NextResponse.json(
        { error: "Published course not found" },
        { status: 404 }
      );
    }

    await sql`
      INSERT INTO enrollments (
        user_id,
        course_id,
        status
      )
      VALUES (
        ${userId},
        ${course.id},
        'active'
      )
      ON CONFLICT (user_id, course_id)
      DO NOTHING
    `;

    return NextResponse.json({
      ok: true,
      enrolled: true,
    });
  } catch (error) {
    console.error("[api/enrollments] POST failed:", error);

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}