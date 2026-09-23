import { sql } from "@/lib/db";

export type CourseStatus = "draft" | "published" | "archived";

export type LessonDifficulty =
  | "beginner"
  | "intermediate"
  | "advanced";

export type AdminLesson = {
  id: string;
  courseId: string;
  courseTitle?: string;
  courseSlug?: string;
  slug: string;
  title: string;
  description: string | null;

  // Learning content
  content: string | null;
  section: string | null;
  difficulty: LessonDifficulty | null;
  duration: string | null;

  position: number;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminCourse = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  status: CourseStatus;
  createdAt: Date;
  updatedAt: Date;
  lessonCount: number;
  enrolledLearners: number;
  completedLearners: number;
  completionRate: number;
  lessons: AdminLesson[];
};

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  status: CourseStatus;
  created_at: Date | string;
  updated_at: Date | string;
  lesson_count: number | string;
  enrolled_learners: number | string;
  completed_learners: number | string;
  completion_rate: number | string;
};

type LessonRow = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  section: string | null;
  difficulty: LessonDifficulty | null;
  duration: string | null;
  position: number | string;
  status: CourseStatus;
  created_at: Date | string;
  updated_at: Date | string;
};

export async function getAdminCourseById(
  id: string
): Promise<AdminCourse | null> {
  const rows = (await sql`
    SELECT
      c.id,
      c.slug,
      c.title,
      c.description,
      c.category,
      c.status,
      c.created_at,
      c.updated_at,

      COUNT(DISTINCT l.id) AS lesson_count,

      COUNT(DISTINCT e.user_id)
        FILTER (
          WHERE e.status IN ('active', 'completed')
        ) AS enrolled_learners,

      COUNT(DISTINCT e.user_id)
        FILTER (
          WHERE e.status = 'completed'
        ) AS completed_learners,

      CASE
        WHEN
          COUNT(DISTINCT e.user_id)
            FILTER (
              WHERE e.status IN ('active', 'completed')
            ) = 0
          OR
          COUNT(DISTINCT l.id)
            FILTER (
              WHERE l.status = 'published'
            ) = 0
        THEN 0
        ELSE ROUND(
          (
            SELECT COUNT(*)::numeric
            FROM lesson_progress lp
            INNER JOIN enrollments ep
              ON ep.user_id = lp.user_id
            WHERE ep.course_id = c.id
              AND ep.status IN ('active', 'completed')
              AND lp.course_slug = c.slug
              AND EXISTS (
                SELECT 1
                FROM lessons pl
                WHERE pl.course_id = c.id
                  AND pl.slug = lp.lesson_slug
                  AND pl.status = 'published'
              )
          )
          /
          (
            COUNT(DISTINCT e.user_id)
              FILTER (
                WHERE e.status IN ('active', 'completed')
              )
            *
            COUNT(DISTINCT l.id)
              FILTER (
                WHERE l.status = 'published'
              )
          )
          * 100
        )
      END AS completion_rate

    FROM courses c

    LEFT JOIN lessons l
      ON l.course_id = c.id

    LEFT JOIN enrollments e
      ON e.course_id = c.id

    WHERE c.id = ${id}

    GROUP BY
      c.id,
      c.slug,
      c.title,
      c.description,
      c.category,
      c.status,
      c.created_at,
      c.updated_at

    LIMIT 1
  `) as CourseRow[];

  const row = rows[0];

  if (!row) {
    return null;
  }

  const lessonRows = (await sql`
    SELECT
      id,
      course_id,
      slug,
      title,
      description,
      content,
      section,
      difficulty,
      duration,
      position,
      status,
      created_at,
      updated_at

    FROM lessons

    WHERE course_id = ${id}

    ORDER BY
      position ASC,
      created_at ASC
  `) as LessonRow[];

  const lessons: AdminLesson[] = lessonRows.map((lesson) => ({
    id: lesson.id,
    courseId: lesson.course_id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    content: lesson.content,
    section: lesson.section,
    difficulty: lesson.difficulty,
    duration: lesson.duration,
    position: Number(lesson.position ?? 0),
    status: lesson.status,
    createdAt: new Date(lesson.created_at),
    updatedAt: new Date(lesson.updated_at),
  }));

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    lessonCount: Number(row.lesson_count ?? 0),
    enrolledLearners: Number(row.enrolled_learners ?? 0),
    completedLearners: Number(row.completed_learners ?? 0),
    completionRate: Number(row.completion_rate ?? 0),
    lessons,
  };
}

type LessonDetailRow = {
  id: string;
  course_id: string;
  course_title: string;
  course_slug: string;
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  section: string | null;
  difficulty: LessonDifficulty | null;
  duration: string | null;
  position: number | string;
  status: CourseStatus;
  created_at: Date | string;
  updated_at: Date | string;
};

export async function getAdminLessonById(
  courseId: string,
  lessonId: string
): Promise<AdminLesson | null> {
  const rows = (await sql`
    SELECT
      l.id,
      l.course_id,
      c.title AS course_title,
      c.slug AS course_slug,
      l.slug,
      l.title,
      l.description,
      l.content,
      l.section,
      l.difficulty,
      l.duration,
      l.position,
      l.status,
      l.created_at,
      l.updated_at

    FROM lessons l

    INNER JOIN courses c
      ON c.id = l.course_id

    WHERE l.id = ${lessonId}
      AND l.course_id = ${courseId}

    LIMIT 1
  `) as LessonDetailRow[];

  const row = rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    courseId: row.course_id,
    courseTitle: row.course_title,
    courseSlug: row.course_slug,
    slug: row.slug,
    title: row.title,
    description: row.description,
    content: row.content,
    section: row.section,
    difficulty: row.difficulty,
    duration: row.duration,
    position: Number(row.position),
    status: row.status,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

async function issueCourseCertificate(
  userId: string,
  courseId: string
): Promise<void> {
  /*
   * A certificate is issued only once per learner/course.
   *
   * issued_at uses the enrollment completion timestamp so the
   * certificate reflects when the learner actually completed
   * the course rather than when this helper happened to run.
   */
  await sql`
    INSERT INTO certificates (
      user_id,
      course_id,
      certificate_number,
      issued_at
    )
    SELECT
      e.user_id,
      e.course_id,
      'WAI-' ||
        UPPER(
          SUBSTRING(
            REPLACE(gen_random_uuid()::text, '-', '')
            FROM 1 FOR 12
          )
        ),
      e.completed_at
    FROM enrollments e
    WHERE e.user_id = ${userId}
      AND e.course_id = ${courseId}
      AND e.status = 'completed'
      AND e.completed_at IS NOT NULL

    ON CONFLICT (user_id, course_id)
    DO NOTHING
  `;
}

export async function recalculateUserCourseEnrollment(
  userId: string,
  courseId: string
): Promise<void> {
  /*
   * A course is complete only when:
   *
   * 1. It has at least one published lesson.
   * 2. The learner completed every published lesson.
   * 3. The learner passed every published assessment.
   *
   * A course with no published assessments can still be completed
   * once all published lessons are complete.
   */
  const completionRows = (await sql`
    SELECT
      (
        EXISTS (
          SELECT 1
          FROM lessons l
          WHERE l.course_id = ${courseId}
            AND l.status = 'published'
        )

        AND NOT EXISTS (
          SELECT 1
          FROM lessons l
          JOIN courses c
            ON c.id = l.course_id
          WHERE l.course_id = ${courseId}
            AND l.status = 'published'
            AND NOT EXISTS (
              SELECT 1
              FROM lesson_progress lp
              WHERE lp.user_id = ${userId}
                AND lp.course_slug = c.slug
                AND lp.lesson_slug = l.slug
            )
        )

        AND NOT EXISTS (
          SELECT 1
          FROM quizzes q
          INNER JOIN lessons l
            ON l.id = q.lesson_id
           AND l.status = 'published'
          WHERE l.course_id = ${courseId}
            AND q.status = 'published'
            AND NOT EXISTS (
              SELECT 1
              FROM quiz_attempts qa
              WHERE qa.user_id = ${userId}
                AND qa.quiz_id = q.id
                AND qa.status = 'completed'
                AND qa.passed = true
            )
        )
      ) AS is_completed
  `) as Array<{
    is_completed: boolean;
  }>;

  const isCompleted =
    completionRows[0]?.is_completed === true;

  if (isCompleted) {
    await sql`
      UPDATE enrollments
      SET
        status = 'completed',
        completed_at = COALESCE(
          completed_at,
          NOW()
        ),
        updated_at = NOW()
      WHERE user_id = ${userId}
        AND course_id = ${courseId}
        AND (
          status <> 'completed'
          OR completed_at IS NULL
        )
    `;
    await issueCourseCertificate(
      userId,
      courseId
    );
    return;
  }

  await sql`
    UPDATE enrollments
    SET
      status = 'active',
      completed_at = NULL,
      updated_at = NOW()
    WHERE user_id = ${userId}
      AND course_id = ${courseId}
      AND (
        status <> 'active'
        OR completed_at IS NOT NULL
      )
  `;
}

export async function recalculateCourseEnrollments(
  courseId: string
): Promise<void> {
  /*
   * Recalculate every enrollment for this course.
   *
   * This is used when administrators change the published
   * curriculum. Publishing a new lesson or assessment can make
   * a previously completed course incomplete again.
   */
  const enrollmentRows = (await sql`
    SELECT user_id
    FROM enrollments
    WHERE course_id = ${courseId}
  `) as Array<{
    user_id: string;
  }>;

  for (const enrollment of enrollmentRows) {
    await recalculateUserCourseEnrollment(
      enrollment.user_id,
      courseId
    );
  }
}