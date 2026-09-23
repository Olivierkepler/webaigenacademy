import { sql } from "@/lib/db";
import { lessons as staticLessons } from "@/data/lessons";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type LearningActivityPoint = {
  date: string;
  label: string;
  value: number;
};

export type UserJourneyStats = {
  registered: number;
  startedLearning: number;
  reachedHalfway: number;
  completed: number;
};

export type AdminOverview = {
  totalUsers: number;
  totalCompletions: number;
  signupsLast7Days: number;
  activeLearnersLast7Days: number;

  lessonCompletionRates: LessonCompletionRate[];
  recentSignups: AdminUserRow[];

  learningActivity: LearningActivityPoint[];
  activeLearnersLast30Days: number;
  averageActiveLearnersPerDay: number;

  userJourney: UserJourneyStats;
};

export type AdminCoursePerformance = {
  id: string;
  slug: string;
  course: string;
  category: string | null;
  enrolled: number;
  active: number;
  completed: number;
  completion: number;
};

export type LessonCompletionRate = {
  courseSlug: string;
  lessonSlug: string;
  lessonTitle: string;
  completions: number;
  ratePercent: number;
};

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;

  role: string | null;

  completions: number;

  enrolledCourses: number;
  completedCourses: number;

  totalLessons: number;
  progressPercent: number;
};

export type AdminUserDirectoryStats = {
  totalUsers: number;
  activeLearnersLast30Days: number;
  newUsersThisMonth: number;
  administrators: number;
};

type CountRow = {
  count?: unknown;
};

type LessonCountRow = {
  course_slug?: unknown;
  lesson_slug?: unknown;
  completions?: unknown;
};

type UserRow = {
  id?: unknown;
  email?: unknown;
  name?: unknown;
  created_at?: unknown;

  role?: unknown;

  completions?: unknown;

  enrolled_courses?: unknown;
  completed_courses?: unknown;

  total_lessons?: unknown;
};

type ActivityRow = {
  activity_date?: unknown;
  active_learners?: unknown;
};

type JourneyRow = {
  registered?: unknown;
  started_learning?: unknown;
  reached_halfway?: unknown;
  completed?: unknown;
};

/* -------------------------------------------------------------------------- */
/* Static lesson lookup                                                       */
/* -------------------------------------------------------------------------- */

/*
 * lesson_progress currently stores course_slug + lesson_slug.
 *
 * Until lesson_progress is migrated to reference the new lessons table
 * directly, keep this lookup so the existing Academy learning system
 * continues to work.
 */

const lessonTitleByKey = new Map(
  staticLessons.map(
    (lesson) =>
      [`${lesson.course}:${lesson.slug}`, lesson.title] as const
  )
);

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function toNumber(value: unknown): number {
  if (typeof value === "number") {
    return value;
  }

  const parsed = Number(value ?? 0);

  return Number.isFinite(parsed) ? parsed : 0;
}

function toCount(rows: CountRow[]): number {
  return toNumber(rows[0]?.count);
}

function toISOString(value: unknown): string {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "string") {
    return value;
  }

  return "";
}

function formatActivityLabel(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    timeZone: "UTC",
  });
}

function mapUserRow(row: UserRow): AdminUserRow | null {
  if (typeof row.id !== "string" || typeof row.email !== "string") {
    return null;
  }

  const completions = toNumber(row.completions);
  const totalLessons = toNumber(row.total_lessons);

  const progressPercent =
    totalLessons > 0
      ? Math.min(100, Math.round((completions / totalLessons) * 100))
      : 0;

  return {
    id: row.id,
    email: row.email,
    name: typeof row.name === "string" ? row.name : null,
    createdAt: toISOString(row.created_at),

    role: typeof row.role === "string" ? row.role : null,

    completions,

    enrolledCourses: toNumber(row.enrolled_courses),
    completedCourses: toNumber(row.completed_courses),

    totalLessons,
    progressPercent,
  };
}

/* -------------------------------------------------------------------------- */
/* Dashboard overview                                                         */
/* -------------------------------------------------------------------------- */

export async function getAdminOverview(): Promise<AdminOverview> {
  const [
    userCountRows,
    completionCountRows,
    signupRows,
    activeRows,
    lessonRows,
    recentUserRows,
    activityRows,
    active30DayRows,
    journeyRows,
  ] = await Promise.all([
    /* Total users */
    sql`
      SELECT COUNT(*)::int AS count
      FROM users
    `,

    /* Total completed lessons */
    sql`
      SELECT COUNT(*)::int AS count
      FROM lesson_progress
    `,

    /* New users during last 7 days */
    sql`
      SELECT COUNT(*)::int AS count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 days'
    `,

    /* Active learners during last 7 days */
    sql`
      SELECT COUNT(DISTINCT lp.user_id)::int AS count
      FROM lesson_progress lp

      INNER JOIN user_roles ur
        ON ur.user_id = lp.user_id

      INNER JOIN roles r
        ON r.id = ur.role_id

      WHERE lp.completed_at >= NOW() - INTERVAL '7 days'
        AND r.name = 'learner'
      `,

    /* Lesson completion statistics */
    sql`
      SELECT
        course_slug,
        lesson_slug,
        COUNT(*)::int AS completions
      FROM lesson_progress
      GROUP BY course_slug, lesson_slug
      ORDER BY completions DESC, course_slug, lesson_slug
    `,

    /* Recent users */
    sql`
      SELECT
        u.id,
        u.email,
        u.name,
        u.created_at,

        COALESCE(
          STRING_AGG(DISTINCT r.name, ', ')
            FILTER (WHERE r.name IS NOT NULL),
          ''
        ) AS role,

        COUNT(DISTINCT lp.id)::int AS completions,

        COUNT(DISTINCT e.course_id)::int AS enrolled_courses,

        COUNT(DISTINCT e.course_id)
          FILTER (WHERE e.status = 'completed')::int
          AS completed_courses,

        COUNT(DISTINCT l.id)::int AS total_lessons

      FROM users u

      LEFT JOIN user_roles ur
        ON ur.user_id = u.id

      LEFT JOIN roles r
        ON r.id = ur.role_id

      LEFT JOIN lesson_progress lp
        ON lp.user_id = u.id

      LEFT JOIN enrollments e
        ON e.user_id = u.id

      LEFT JOIN lessons l
        ON l.course_id = e.course_id
       AND l.status = 'published'

      GROUP BY
        u.id,
        u.email,
        u.name,
        u.created_at

      ORDER BY u.created_at DESC

      LIMIT 8
    `,

    /* Learning activity â€” one row for every day in the last 30 days */
    sql`
      WITH days AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '29 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS activity_date
      ),

      activity AS (
        SELECT
          lp.completed_at::date AS activity_date,
          COUNT(DISTINCT lp.user_id)::int AS active_learners

        FROM lesson_progress lp

        INNER JOIN user_roles ur
          ON ur.user_id = lp.user_id

        INNER JOIN roles r
          ON r.id = ur.role_id

        WHERE lp.completed_at >= CURRENT_DATE - INTERVAL '29 days'
          AND r.name = 'learner'

        GROUP BY lp.completed_at::date
      )

      SELECT
        days.activity_date,
        COALESCE(activity.active_learners, 0)::int AS active_learners

      FROM days

      LEFT JOIN activity
        ON activity.activity_date = days.activity_date

      ORDER BY days.activity_date
    `,

    /* Unique active learners during the last 30 days */
    sql`
      SELECT COUNT(DISTINCT lp.user_id)::int AS count

      FROM lesson_progress lp

      INNER JOIN user_roles ur
        ON ur.user_id = lp.user_id

      INNER JOIN roles r
        ON r.id = ur.role_id

      WHERE lp.completed_at >= CURRENT_DATE - INTERVAL '29 days'
        AND r.name = 'learner'
    `,

    /*
     * User journey
     *
     * Registered:
     *   all users
     *
     * Started learning:
     *   learner has an enrollment OR lesson progress
     *
     * Reached halfway:
     *   learner completed at least 50% of published lessons
     *   in at least one enrolled course
     *
     * Completed:
     *   learner has at least one completed enrollment
     */
    sql`
      WITH registered_users AS (
        SELECT id
        FROM users
      ),

      started_users AS (
        SELECT DISTINCT user_id
        FROM enrollments

        UNION

        SELECT DISTINCT user_id
        FROM lesson_progress
      ),

      course_requirements AS (
        SELECT
          c.id AS course_id,
          c.slug AS course_slug,

          COUNT(
            DISTINCT l.id
          )::int AS total_lessons,

          COUNT(
            DISTINCT q.id
          )::int AS total_assessments

        FROM courses c

        LEFT JOIN lessons l
          ON l.course_id = c.id
        AND l.status = 'published'

        LEFT JOIN quizzes q
          ON q.lesson_id = l.id
        AND q.status = 'published'

        WHERE c.status = 'published'

        GROUP BY
          c.id,
          c.slug
      ),

      learner_course_progress AS (
        SELECT
          e.user_id,
          e.course_id,

          cr.total_lessons,
          cr.total_assessments,

          COUNT(
            DISTINCT CASE
              WHEN lp.id IS NOT NULL
              THEN l.id
            END
          )::int AS completed_lessons,

          COUNT(
            DISTINCT CASE
              WHEN qa.id IS NOT NULL
              THEN q.id
            END
          )::int AS passed_assessments

        FROM enrollments e

        INNER JOIN courses c
          ON c.id = e.course_id
        AND c.status = 'published'

        INNER JOIN course_requirements cr
          ON cr.course_id = e.course_id

        LEFT JOIN lessons l
          ON l.course_id = e.course_id
        AND l.status = 'published'

        LEFT JOIN lesson_progress lp
          ON lp.user_id = e.user_id
        AND lp.course_slug = c.slug
        AND lp.lesson_slug = l.slug

        LEFT JOIN quizzes q
          ON q.lesson_id = l.id
        AND q.status = 'published'

        LEFT JOIN quiz_attempts qa
          ON qa.quiz_id = q.id
        AND qa.user_id = e.user_id
        AND qa.status = 'completed'
        AND qa.passed = true

        GROUP BY
          e.user_id,
          e.course_id,
          cr.total_lessons,
          cr.total_assessments
      ),

      halfway_users AS (
        SELECT DISTINCT user_id

        FROM learner_course_progress

        WHERE total_lessons > 0

          AND (
            completed_lessons::numeric /
            total_lessons::numeric
          ) >= 0.5
      ),

      completed_users AS (
        SELECT DISTINCT user_id

        FROM learner_course_progress

        WHERE total_lessons > 0

          AND completed_lessons =
            total_lessons

          AND passed_assessments =
            total_assessments
      )

      SELECT
        (
          SELECT COUNT(*)
          FROM registered_users
        )::int AS registered,

        (
          SELECT COUNT(*)
          FROM started_users
        )::int AS started_learning,

        (
          SELECT COUNT(*)
          FROM halfway_users
        )::int AS reached_halfway,

        (
          SELECT COUNT(*)
          FROM completed_users
        )::int AS completed
    `,
  ]);

  const totalUsers = toCount(userCountRows as CountRow[]);

  /* ------------------------------------------------------------------------ */
  /* Lesson performance                                                       */
  /* ------------------------------------------------------------------------ */

  const lessonCompletionRates = (lessonRows as LessonCountRow[])
    .map((row) => {
      const courseSlug =
        typeof row.course_slug === "string" ? row.course_slug : "";

      const lessonSlug =
        typeof row.lesson_slug === "string" ? row.lesson_slug : "";

      const completions = toNumber(row.completions);

      if (!courseSlug || !lessonSlug) {
        return null;
      }

      const lessonTitle =
        lessonTitleByKey.get(`${courseSlug}:${lessonSlug}`) ??
        lessonSlug;

      return {
        courseSlug,
        lessonSlug,
        lessonTitle,
        completions,

        ratePercent:
          totalUsers > 0
            ? Math.min(
              100,
              Math.round((completions / totalUsers) * 100)
            )
            : 0,
      };
    })
    .filter(
      (row): row is LessonCompletionRate => row !== null
    );

  /* ------------------------------------------------------------------------ */
  /* Recent users                                                             */
  /* ------------------------------------------------------------------------ */

  const recentSignups = (recentUserRows as UserRow[])
    .map(mapUserRow)
    .filter(
      (row): row is AdminUserRow => row !== null
    );

  /* ------------------------------------------------------------------------ */
  /* Learning activity                                                        */
  /* ------------------------------------------------------------------------ */

  const learningActivity = (activityRows as ActivityRow[]).map((row) => {
    const rawDate = row.activity_date;

    let date: Date;

    if (rawDate instanceof Date) {
      date = rawDate;
    } else {
      date = new Date(String(rawDate));
    }

    return {
      date: Number.isNaN(date.getTime())
        ? ""
        : date.toISOString().slice(0, 10),

      label: Number.isNaN(date.getTime())
        ? ""
        : formatActivityLabel(date),

      value: toNumber(row.active_learners),
    };
  });

  const activeLearnersLast30Days = toCount(
    active30DayRows as CountRow[]
  );

  const totalDailyActiveLearners = learningActivity.reduce(
    (sum, point) => sum + point.value,
    0
  );

  const averageActiveLearnersPerDay =
    learningActivity.length > 0
      ? Math.round(
        (totalDailyActiveLearners / learningActivity.length) * 100
      ) / 100
      : 0;

  /* ------------------------------------------------------------------------ */
  /* User journey                                                             */
  /* ------------------------------------------------------------------------ */

  const journey = (journeyRows as JourneyRow[])[0];

  const userJourney: UserJourneyStats = {
    registered: toNumber(journey?.registered),
    startedLearning: toNumber(journey?.started_learning),
    reachedHalfway: toNumber(journey?.reached_halfway),
    completed: toNumber(journey?.completed),
  };

  /* ------------------------------------------------------------------------ */
  /* Result                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    totalUsers,

    totalCompletions: toCount(
      completionCountRows as CountRow[]
    ),

    signupsLast7Days: toCount(
      signupRows as CountRow[]
    ),

    activeLearnersLast7Days: toCount(
      activeRows as CountRow[]
    ),

    lessonCompletionRates,

    recentSignups,

    learningActivity,

    activeLearnersLast30Days,

    averageActiveLearnersPerDay,

    userJourney,
  };
}

/* -------------------------------------------------------------------------- */
/* Users                                                                      */
/* -------------------------------------------------------------------------- */

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const rows = await sql`
    WITH course_requirements AS (
      SELECT
        c.id AS course_id,
        c.slug AS course_slug,

        COUNT(
          DISTINCT l.id
        )::int AS total_lessons,

        COUNT(
          DISTINCT q.id
        )::int AS total_assessments

      FROM courses c

      LEFT JOIN lessons l
        ON l.course_id = c.id
       AND l.status = 'published'

      LEFT JOIN quizzes q
        ON q.lesson_id = l.id
       AND q.status = 'published'

      WHERE c.status = 'published'

      GROUP BY
        c.id,
        c.slug
    ),

    learner_course_progress AS (
      SELECT
        e.user_id,
        e.course_id,

        cr.total_lessons,
        cr.total_assessments,

        COUNT(
          DISTINCT CASE
            WHEN lp.id IS NOT NULL
            THEN l.id
          END
        )::int AS completed_lessons,

        COUNT(
          DISTINCT CASE
            WHEN qa.id IS NOT NULL
            THEN q.id
          END
        )::int AS passed_assessments

      FROM enrollments e

      INNER JOIN courses c
        ON c.id = e.course_id
       AND c.status = 'published'

      INNER JOIN course_requirements cr
        ON cr.course_id = e.course_id

      LEFT JOIN lessons l
        ON l.course_id = e.course_id
       AND l.status = 'published'

      LEFT JOIN lesson_progress lp
        ON lp.user_id = e.user_id
       AND lp.course_slug = c.slug
       AND lp.lesson_slug = l.slug

      LEFT JOIN quizzes q
        ON q.lesson_id = l.id
       AND q.status = 'published'

      LEFT JOIN quiz_attempts qa
        ON qa.quiz_id = q.id
       AND qa.user_id = e.user_id
       AND qa.status = 'completed'
       AND qa.passed = true

      GROUP BY
        e.user_id,
        e.course_id,
        cr.total_lessons,
        cr.total_assessments
    ),

    user_learning_stats AS (
      SELECT
        user_id,

        COUNT(
          DISTINCT course_id
        )::int AS enrolled_courses,

        COUNT(
          DISTINCT course_id
        ) FILTER (
          WHERE
            total_lessons > 0
            AND completed_lessons = total_lessons
            AND passed_assessments = total_assessments
        )::int AS completed_courses,

        COALESCE(
          SUM(total_lessons),
          0
        )::int AS total_lessons

      FROM learner_course_progress

      GROUP BY user_id
    ),

    user_lesson_completions AS (
      SELECT
        user_id,
        COUNT(DISTINCT id)::int AS completions

      FROM lesson_progress

      GROUP BY user_id
    )

    SELECT
      u.id,
      u.email,
      u.name,
      u.created_at,

      COALESCE(
        STRING_AGG(DISTINCT r.name, ', ')
          FILTER (
            WHERE r.name IS NOT NULL
          ),
        ''
      ) AS role,

      COALESCE(
        ulc.completions,
        0
      )::int AS completions,

      COALESCE(
        uls.enrolled_courses,
        0
      )::int AS enrolled_courses,

      COALESCE(
        uls.completed_courses,
        0
      )::int AS completed_courses,

      COALESCE(
        uls.total_lessons,
        0
      )::int AS total_lessons

    FROM users u

    LEFT JOIN user_roles ur
      ON ur.user_id = u.id

    LEFT JOIN roles r
      ON r.id = ur.role_id

    LEFT JOIN user_lesson_completions ulc
      ON ulc.user_id = u.id

    LEFT JOIN user_learning_stats uls
      ON uls.user_id = u.id

    GROUP BY
      u.id,
      u.email,
      u.name,
      u.created_at,
      ulc.completions,
      uls.enrolled_courses,
      uls.completed_courses,
      uls.total_lessons

    ORDER BY u.created_at DESC
  `;

  return (rows as UserRow[])
    .map(mapUserRow)
    .filter(
      (row): row is AdminUserRow =>
        row !== null
    );
}

/* -------------------------------------------------------------------------- */
/* User directory statistics                                                  */
/* -------------------------------------------------------------------------- */

export async function getAdminUserDirectoryStats(): Promise<AdminUserDirectoryStats> {
  const [
    totalRows,
    activeRows,
    newUserRows,
    administratorRows,
  ] = await Promise.all([
    sql`
      SELECT COUNT(*)::int AS count
      FROM users
    `,

    sql`
      SELECT COUNT(DISTINCT lp.user_id)::int AS count

      FROM lesson_progress lp

      JOIN user_roles ur
        ON ur.user_id = lp.user_id

      JOIN roles r
        ON r.id = ur.role_id

      WHERE lp.completed_at >= NOW() - INTERVAL '30 days'
        AND r.name = 'learner'
    `,

    sql`
      SELECT COUNT(*)::int AS count

      FROM users

      WHERE created_at >= DATE_TRUNC('month', NOW())
    `,

    sql`
      SELECT COUNT(DISTINCT ur.user_id)::int AS count

      FROM user_roles ur

      JOIN roles r
        ON r.id = ur.role_id

      WHERE r.name = 'administrator'
    `,
  ]);

  return {
    totalUsers: toCount(totalRows as CountRow[]),

    activeLearnersLast30Days: toCount(
      activeRows as CountRow[]
    ),

    newUsersThisMonth: toCount(
      newUserRows as CountRow[]
    ),

    administrators: toCount(
      administratorRows as CountRow[]
    ),
  };
}

export type AdminActivityEventType =
  | "Lesson"
  | "Assessment"
  | "Enrollment"
  | "Course"
  | "Account";

export type AdminActivityEvent = {
  id: string;
  userId: string;
  user: string;
  email: string;
  role: string | null;
  action: string;
  description: string;
  type: AdminActivityEventType;
  occurredAt: string;
};

export type AdminActivityBreakdownItem = {
  label: string;
  value: number;
  percentage: number;
};

export type AdminActivityStats = {
  eventsToday: number;
  activeLearnersToday: number;
  lessonCompletionsToday: number;
  assessmentsToday: number;

  eventsLast7Days: number;
  events: AdminActivityEvent[];
  breakdown: AdminActivityBreakdownItem[];

  mostActiveCourse: string | null;
  mostActiveLearner: string | null;
};

export async function getAdminCoursePerformance(): Promise<
  AdminCoursePerformance[]
> {
  const rows = (await sql`
    SELECT
      c.id,
      c.slug,
      c.title,
      c.category,

      COUNT(DISTINCT e.user_id)
        FILTER (
          WHERE e.status IN ('active', 'completed')
        )::int AS enrolled,

      COUNT(DISTINCT e.user_id)
        FILTER (
          WHERE e.status = 'active'
        )::int AS active,

      COUNT(DISTINCT e.user_id)
        FILTER (
          WHERE e.status = 'completed'
        )::int AS completed

    FROM courses c

    LEFT JOIN enrollments e
      ON e.course_id = c.id

    WHERE c.status = 'published'

    GROUP BY
      c.id,
      c.slug,
      c.title,
      c.category,
      c.created_at

    ORDER BY
      c.created_at DESC,
      c.title ASC
  `) as Array<{
    id: unknown;
    slug: unknown;
    title: unknown;
    category: unknown;
    enrolled: unknown;
    active: unknown;
    completed: unknown;
  }>;

  return rows
    .filter(
      (row) =>
        typeof row.id === "string" &&
        typeof row.slug === "string" &&
        typeof row.title === "string"
    )
    .map((row) => {
      const enrolled = toNumber(row.enrolled);
      const active = toNumber(row.active);
      const completed = toNumber(row.completed);

      const completion =
        enrolled > 0
          ? Math.round(
            (completed / enrolled) * 1000
          ) / 10
          : 0;

      return {
        id: row.id as string,
        slug: row.slug as string,
        course: row.title as string,
        category:
          typeof row.category === "string"
            ? row.category
            : null,
        enrolled,
        active,
        completed,
        completion,
      };
    });
}

export async function getAdminActivity(): Promise<AdminActivityStats> {
  const rows = (await sql`
    WITH activity_events AS (
      /* Lesson completions */
      SELECT
        'lesson:' || lp.id::text AS id,
        lp.user_id,
        COALESCE(
          NULLIF(TRIM(u.name), ''),
          u.email
        ) AS user_name,
        u.email,
        COALESCE(
          (
            SELECT STRING_AGG(DISTINCT r.name, ', ')
            FROM user_roles ur
            INNER JOIN roles r
              ON r.id = ur.role_id
            WHERE ur.user_id = u.id
          ),
          ''
        )::text AS role,
        'Completed lesson'::text AS action,
        COALESCE(
          l.title,
          lp.lesson_slug
        )::text AS description,
        'Lesson'::text AS type,
        lp.completed_at AS occurred_at,
        c.title AS course_title

      FROM lesson_progress lp

      INNER JOIN users u
        ON u.id = lp.user_id

      LEFT JOIN courses c
        ON c.slug = lp.course_slug

      LEFT JOIN lessons l
        ON l.course_id = c.id
       AND l.slug = lp.lesson_slug

      WHERE lp.completed_at IS NOT NULL

      UNION ALL

      /* Completed assessment attempts */
      SELECT
        'assessment:' || qa.id::text AS id,
        qa.user_id,
        COALESCE(
          NULLIF(TRIM(u.name), ''),
          u.email
        ) AS user_name,
        u.email,
        COALESCE(
          (
            SELECT STRING_AGG(DISTINCT r.name, ', ')
            FROM user_roles ur
            INNER JOIN roles r
              ON r.id = ur.role_id
            WHERE ur.user_id = u.id
          ),
          ''
        )::text AS role,
        CASE
          WHEN qa.passed = true
            THEN 'Passed assessment'
          ELSE 'Completed assessment'
        END::text AS action,
        q.title::text AS description,
        'Assessment'::text AS type,
        qa.completed_at AS occurred_at,
        c.title AS course_title

      FROM quiz_attempts qa

      INNER JOIN users u
        ON u.id = qa.user_id

      INNER JOIN quizzes q
        ON q.id = qa.quiz_id

      INNER JOIN lessons l
        ON l.id = q.lesson_id

      INNER JOIN courses c
        ON c.id = l.course_id

      WHERE qa.status = 'completed'
        AND qa.completed_at IS NOT NULL

      UNION ALL

      /* Course enrollments */
      SELECT
        'enrollment:' || e.id::text AS id,
        e.user_id,
        COALESCE(
          NULLIF(TRIM(u.name), ''),
          u.email
        ) AS user_name,
        u.email,
        COALESCE(
          (
            SELECT STRING_AGG(DISTINCT r.name, ', ')
            FROM user_roles ur
            INNER JOIN roles r
              ON r.id = ur.role_id
            WHERE ur.user_id = u.id
          ),
          ''
        )::text AS role,
        'Enrolled in course'::text AS action,
        c.title::text AS description,
        'Enrollment'::text AS type,
        e.enrolled_at AS occurred_at,
        c.title AS course_title

      FROM enrollments e

      INNER JOIN users u
        ON u.id = e.user_id

      INNER JOIN courses c
        ON c.id = e.course_id

      WHERE e.enrolled_at IS NOT NULL

      UNION ALL

      /* Course completions */
      SELECT
        'course:' || e.id::text AS id,
        e.user_id,
        COALESCE(
          NULLIF(TRIM(u.name), ''),
          u.email
        ) AS user_name,
        u.email,
        COALESCE(
          (
            SELECT STRING_AGG(DISTINCT r.name, ', ')
            FROM user_roles ur
            INNER JOIN roles r
              ON r.id = ur.role_id
            WHERE ur.user_id = u.id
          ),
          ''
        )::text AS role,
        'Completed course'::text AS action,
        c.title::text AS description,
        'Course'::text AS type,
        e.completed_at AS occurred_at,
        c.title AS course_title

      FROM enrollments e

      INNER JOIN users u
        ON u.id = e.user_id

      INNER JOIN courses c
        ON c.id = e.course_id

      WHERE e.status = 'completed'
        AND e.completed_at IS NOT NULL

      UNION ALL

      /* Account registrations */
      SELECT
        'account:' || u.id::text AS id,
        u.id AS user_id,
        COALESCE(
          NULLIF(TRIM(u.name), ''),
          u.email
        ) AS user_name,
        u.email,
        COALESCE(
          (
            SELECT STRING_AGG(DISTINCT r.name, ', ')
            FROM user_roles ur
            INNER JOIN roles r
              ON r.id = ur.role_id
            WHERE ur.user_id = u.id
          ),
          ''
        )::text AS role,
        'Created account'::text AS action,
        'Academy account'::text AS description,
        'Account'::text AS type,
        u.created_at AS occurred_at,
        NULL::text AS course_title

      FROM users u

      WHERE u.created_at IS NOT NULL
    )

    SELECT
      id,
      user_id,
      user_name,
      email,
      role,
      action,
      description,
      type,
      occurred_at,
      course_title

    FROM activity_events

    WHERE occurred_at >= NOW() - INTERVAL '7 days'

    ORDER BY occurred_at DESC

    LIMIT 100
  `) as Array<{
    id: unknown;
    user_id: unknown;
    user_name: unknown;
    email: unknown;
    role: unknown;
    action: unknown;
    description: unknown;
    type: unknown;
    occurred_at: unknown;
    course_title: unknown;
  }>;

  const events: AdminActivityEvent[] = rows
    .filter(
      (row) =>
        typeof row.id === "string" &&
        typeof row.user_id === "string" &&
        typeof row.email === "string" &&
        typeof row.action === "string" &&
        typeof row.description === "string" &&
        typeof row.type === "string"
    )
    .map((row) => ({
      id: row.id as string,
      userId: row.user_id as string,
      user:
        typeof row.user_name === "string"
          ? row.user_name
          : (row.email as string),
      email: row.email as string,
      role:
        typeof row.role === "string" && row.role.length > 0
          ? row.role
          : null,
      action: row.action as string,
      description: row.description as string,
      type: row.type as AdminActivityEventType,
      occurredAt: toISOString(row.occurred_at),
    }));

  const now = new Date();

  const isToday = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    return (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    );
  };

  const todayEvents = events.filter((event) =>
    isToday(event.occurredAt)
  );

  const eventsToday = todayEvents.length;

  const lessonCompletionsToday = todayEvents.filter(
    (event) => event.type === "Lesson"
  ).length;

  const assessmentsToday = todayEvents.filter(
    (event) => event.type === "Assessment"
  ).length;

  /*
   * Active learner here means a learner with recorded
   * learning activity today. Account creation alone does
   * not count as learning activity.
   */
  const activeLearnersToday = new Set(
    todayEvents
      .filter(
        (event) =>
          event.role?.split(",").map((role) => role.trim()).includes("learner") === true &&
          (
            event.type === "Lesson" ||
            event.type === "Assessment" ||
            event.type === "Enrollment" ||
            event.type === "Course"
          )
      )
      .map((event) => event.userId)
  ).size;

  const breakdownLabels: Array<{
    type: AdminActivityEventType;
    label: string;
  }> = [
      {
        type: "Lesson",
        label: "Lesson completions",
      },
      {
        type: "Assessment",
        label: "Assessment attempts",
      },
      {
        type: "Enrollment",
        label: "Course enrollments",
      },
      {
        type: "Course",
        label: "Course completions",
      },
      {
        type: "Account",
        label: "Account registrations",
      },
    ];

  const breakdownTotal = events.length;

  const breakdown: AdminActivityBreakdownItem[] =
    breakdownLabels.map(({ type, label }) => {
      const value = events.filter(
        (event) => event.type === type
      ).length;

      const percentage =
        breakdownTotal > 0
          ? Math.round(
            (value / breakdownTotal) * 1000
          ) / 10
          : 0;

      return {
        label,
        value,
        percentage,
      };
    });

  /*
   * Calculate course activity from the same 7-day event
   * rows. Account registrations have no course.
   */
  const courseCounts = new Map<string, number>();

  for (const row of rows) {
    if (
      typeof row.course_title !== "string" ||
      typeof row.role !== "string"
    ) {
      continue;
    }

    const isLearner = row.role
      .split(",")
      .map((role) => role.trim())
      .includes("learner");

    if (!isLearner) {
      continue;
    }

    courseCounts.set(
      row.course_title,
      (courseCounts.get(row.course_title) ?? 0) + 1
    );
  }

  const mostActiveCourse =
    [...courseCounts.entries()].sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? null;

  const learnerCounts = new Map<
    string,
    {
      name: string;
      count: number;
    }
  >();

  for (const event of events) {
    const isLearner =
      event.role
        ?.split(",")
        .map((role) => role.trim())
        .includes("learner") === true;

    if (
      !isLearner ||
      (
        event.type !== "Lesson" &&
        event.type !== "Assessment" &&
        event.type !== "Enrollment" &&
        event.type !== "Course"
      )
    ) {
      continue;
    }

    const current = learnerCounts.get(event.userId);

    learnerCounts.set(event.userId, {
      name: event.user,
      count: (current?.count ?? 0) + 1,
    });
  }

  const mostActiveLearner =
    [...learnerCounts.values()].sort(
      (a, b) => b.count - a.count
    )[0]?.name ?? null;

  return {
    eventsToday,
    activeLearnersToday,
    lessonCompletionsToday,
    assessmentsToday,

    eventsLast7Days: events.length,
    events,
    breakdown,

    mostActiveCourse,
    mostActiveLearner,
  };

}
