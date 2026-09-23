import { sql } from "@/lib/db";
import type { LessonDifficulty } from "@/lib/courses";

export type LearningCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  lessons: LearningLesson[];
};

export type LearningLesson = {
  id: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  section: string | null;
  difficulty: LessonDifficulty | null;
  duration: string | null;
  position: number;
};

type LearningCourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
};

type LearningLessonRow = {
  id: string;
  course_id: string;
  course_slug: string;
  course_title: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  section: string | null;
  difficulty: LessonDifficulty | null;
  duration: string | null;
  position: number | string;
};

function mapLesson(row: LearningLessonRow): LearningLesson {
  return {
    id: row.id,
    courseId: row.course_id,
    courseSlug: row.course_slug,
    courseTitle: row.course_title,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content ?? "",
    section: row.section,
    difficulty: row.difficulty,
    duration: row.duration,
    position: Number(row.position ?? 0),
  };
}

export async function getPublishedLearningCourseBySlug(
  slug: string
): Promise<LearningCourse | null> {
  const courseRows = (await sql`
    SELECT
      id,
      slug,
      title,
      description,
      category
    FROM courses
    WHERE slug = ${slug}
      AND status = 'published'
    LIMIT 1
  `) as LearningCourseRow[];

  const course = courseRows[0];

  if (!course) {
    return null;
  }

  const lessonRows = (await sql`
    SELECT
      l.id,
      l.course_id,
      c.slug AS course_slug,
      c.title AS course_title,
      l.slug,
      l.title,
      l.description,
      l.content,
      l.section,
      l.difficulty,
      l.duration,
      l.position
    FROM lessons l
    INNER JOIN courses c
      ON c.id = l.course_id
    WHERE l.course_id = ${course.id}
      AND l.status = 'published'
    ORDER BY
      l.position ASC,
      l.created_at ASC
  `) as LearningLessonRow[];

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    description: course.description,
    category: course.category,
    lessons: lessonRows.map(mapLesson),
  };
}

export async function getPublishedLearningLesson(
  courseSlug: string,
  lessonSlug: string
): Promise<LearningLesson | null> {
  const rows = (await sql`
    SELECT
      l.id,
      l.course_id,
      c.slug AS course_slug,
      c.title AS course_title,
      l.slug,
      l.title,
      l.description,
      l.content,
      l.section,
      l.difficulty,
      l.duration,
      l.position
    FROM lessons l
    INNER JOIN courses c
      ON c.id = l.course_id
    WHERE c.slug = ${courseSlug}
      AND c.status = 'published'
      AND l.slug = ${lessonSlug}
      AND l.status = 'published'
    LIMIT 1
  `) as LearningLessonRow[];

  const row = rows[0];

  return row ? mapLesson(row) : null;
}

export async function getPublishedLearningLessons(
  courseSlug: string
): Promise<LearningLesson[]> {
  const rows = (await sql`
    SELECT
      l.id,
      l.course_id,
      c.slug AS course_slug,
      c.title AS course_title,
      l.slug,
      l.title,
      l.description,
      l.content,
      l.section,
      l.difficulty,
      l.duration,
      l.position
    FROM lessons l
    INNER JOIN courses c
      ON c.id = l.course_id
    WHERE c.slug = ${courseSlug}
      AND c.status = 'published'
      AND l.status = 'published'
    ORDER BY
      l.position ASC,
      l.created_at ASC
  `) as LearningLessonRow[];

  return rows.map(mapLesson);
}

export async function getPublishedLearningCourses(): Promise<LearningCourse[]> {
  const courseRows = (await sql`
    SELECT
      id,
      slug,
      title,
      description,
      category
    FROM courses
    WHERE status = 'published'
    ORDER BY created_at DESC
  `) as LearningCourseRow[];

  if (courseRows.length === 0) {
    return [];
  }

  const courses: LearningCourse[] = [];

  for (const course of courseRows) {
    const lessonRows = (await sql`
      SELECT
        l.id,
        l.course_id,
        c.slug AS course_slug,
        c.title AS course_title,
        l.slug,
        l.title,
        l.description,
        l.content,
        l.section,
        l.difficulty,
        l.duration,
        l.position
      FROM lessons l
      INNER JOIN courses c
        ON c.id = l.course_id
      WHERE l.course_id = ${course.id}
        AND l.status = 'published'
      ORDER BY
        l.position ASC,
        l.created_at ASC
    `) as LearningLessonRow[];

    courses.push({
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      category: course.category,
      lessons: lessonRows.map(mapLesson),
    });
  }

  return courses;
}

export type LearningCourseProgress = {
  courseSlug: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  status: "not-started" | "in-progress" | "completed";
  nextLessonSlug: string | null;
};

type CompletedLessonRow = {
  course_slug: string;
  lesson_slug: string;
};

export async function getLearningCourseProgress(
  userId: string,
  courses: LearningCourse[]
): Promise<Record<string, LearningCourseProgress>> {
  const rows = (await sql`
    SELECT
      course_slug,
      lesson_slug
    FROM lesson_progress
    WHERE user_id = ${userId}
  `) as CompletedLessonRow[];

  const completedByCourse = new Map<string, Set<string>>();

  for (const row of rows) {
    const existing =
      completedByCourse.get(row.course_slug) ?? new Set<string>();

    existing.add(row.lesson_slug);
    completedByCourse.set(row.course_slug, existing);
  }

  const progress: Record<string, LearningCourseProgress> = {};

  for (const course of courses) {
    const completedSlugs =
      completedByCourse.get(course.slug) ?? new Set<string>();

    const publishedLessonSlugs = new Set(
      course.lessons.map((lesson) => lesson.slug)
    );

    const completedLessons = [...completedSlugs].filter((slug) =>
      publishedLessonSlugs.has(slug)
    ).length;

    const totalLessons = course.lessons.length;

    const progressPercent =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    const nextLesson =
      course.lessons.find(
        (lesson) => !completedSlugs.has(lesson.slug)
      ) ?? null;

    let status: LearningCourseProgress["status"] = "not-started";

    if (totalLessons > 0 && completedLessons === totalLessons) {
      status = "completed";
    } else if (completedLessons > 0) {
      status = "in-progress";
    }

    progress[course.slug] = {
      courseSlug: course.slug,
      completedLessons,
      totalLessons,
      progressPercent,
      status,
      nextLessonSlug:
        nextLesson?.slug ?? course.lessons[0]?.slug ?? null,
    };
  }

  return progress;
}