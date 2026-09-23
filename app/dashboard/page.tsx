import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminRole } from "@/lib/admin";
import { sql } from "@/lib/db";
import {
  isSignedIn,
  resolveSessionUserId,
} from "@/lib/sessionUser";
import { lessons } from "@/data/lessons";
import {
  getPublishedLearningCourses,
} from "@/lib/learning";

export const dynamic = "force-dynamic";

type ProgressRow = {
  course_slug: string;
  lesson_slug: string;
  completed_at: string | Date;
};

type EnrollmentRow = {
  course_slug: string;
  status:
  | "active"
  | "completed"
  | "cancelled";
};

type AssessmentRow = {
  course_slug: string;
  total_assessments: number;
  passed_assessments: number;
};

type OutstandingAssessmentRow = {
  course_slug: string;
  lesson_slug: string;
  quiz_id: string;
};

type CertificateRow = {
  course_slug: string;
  certificate_number: string;
};

type AssessmentSummary = {
  total: number;
  passed: number;
  outstandingHref: string | null;
};

type CourseSummary = {
  slug: string;
  title: string;

  total: number;
  completed: number;
  percent: number;

  assessmentTotal: number;
  assessmentPassed: number;

  lessonsCompleted: boolean;
  assessmentsCompleted: boolean;
  isCompleted: boolean;
  assessmentRemaining: boolean;

  certificateNumber: string | null;

  continueHref: string;

  ctaLabel:
  | "Start course"
  | "Continue"
  | "Take assessment"
  | "Review course";
};

type DashboardLesson = {
  course: string;
  courseTitle: string;
  slug: string;
  title: string;
  order: number;
};

function firstName(
  name: string | null | undefined
): string {
  if (!name?.trim()) {
    return "there";
  }

  return (
    name.trim().split(/\s+/)[0] ??
    "there"
  );
}

function greetingName(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  if (name?.trim()) {
    return firstName(name);
  }

  const localPart =
    email?.split("@")[0]?.trim();

  return localPart || "there";
}

function formatActivityDate(
  value: string | Date
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = Date.now();

  const diffMs =
    now - date.getTime();

  const diffDays = Math.floor(
    diffMs /
    (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) {
    return date.toLocaleDateString(
      undefined,
      {
        month: "short",
        day: "numeric",
      }
    );
  }

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString(
    undefined,
    {
      month: "short",
      day: "numeric",
      year:
        date.getFullYear() !==
          new Date().getFullYear()
          ? "numeric"
          : undefined,
    }
  );
}

function buildCourseSummaries(
  dashboardLessons: DashboardLesson[],
  completedByCourse: Map<
    string,
    Set<string>
  >,
  assessmentsByCourse: Map<
    string,
    AssessmentSummary
  >,
  certificatesByCourse: Map<
    string,
    string
  >
): CourseSummary[] {
  const byCourse = new Map<
    string,
    {
      title: string;
      lessons: DashboardLesson[];
    }
  >();

  for (const lesson of dashboardLessons) {
    const existing =
      byCourse.get(lesson.course);

    if (existing) {
      existing.lessons.push(lesson);
    } else {
      byCourse.set(lesson.course, {
        title: lesson.courseTitle,
        lessons: [lesson],
      });
    }
  }

  const summaries: CourseSummary[] = [];

  for (
    const [
      slug,
      {
        title,
        lessons: courseLessons,
      },
    ] of byCourse
  ) {
    const ordered = [
      ...courseLessons,
    ].sort(
      (a, b) => a.order - b.order
    );

    const completedSet =
      completedByCourse.get(slug) ??
      new Set<string>();

    const completed =
      ordered.filter((lesson) =>
        completedSet.has(lesson.slug)
      ).length;

    const total = ordered.length;

    /*
     * This percentage intentionally
     * represents LESSON progress.
     *
     * Assessments are shown separately
     * and participate in course
     * completion below.
     */
    const percent =
      total === 0
        ? 0
        : Math.round(
          (completed / total) * 100
        );

    const firstIncomplete =
      ordered.find(
        (lesson) =>
          !completedSet.has(lesson.slug)
      );

    const assessment =
      assessmentsByCourse.get(slug) ?? {
        total: 0,
        passed: 0,
        outstandingHref: null,
      };

    const lessonsCompleted =
      total > 0 &&
      completed === total;

    const assessmentsCompleted =
      assessment.total === 0 ||
      assessment.passed ===
      assessment.total;

    const isCompleted =
      lessonsCompleted &&
      assessmentsCompleted;

    const certificateNumber =
      certificatesByCourse.get(slug) ?? null;

    const assessmentRemaining =
      lessonsCompleted &&
      assessment.total > 0 &&
      !assessmentsCompleted;

    let continueHref: string;

    let ctaLabel:
      CourseSummary["ctaLabel"];

    if (isCompleted) {
      continueHref =
        `/learn/${slug}`;

      ctaLabel = "Review course";
    } else if (
      assessmentRemaining &&
      assessment.outstandingHref
    ) {
      continueHref =
        assessment.outstandingHref;

      ctaLabel = "Take assessment";
    } else if (completed === 0) {
      continueHref =
        `/learn/${slug}`;

      ctaLabel = "Start course";
    } else if (firstIncomplete) {
      continueHref =
        `/learn/${slug}/${firstIncomplete.slug}`;

      ctaLabel = "Continue";
    } else {
      /*
       * Defensive fallback.
       *
       * If lessons are finished and an
       * assessment is required but an
       * assessment URL could not be
       * resolved, send the learner to
       * the course rather than lesson 1.
       */
      continueHref =
        `/learn/${slug}`;

      ctaLabel = "Continue";
    }

    summaries.push({
      slug,
      title,

      total,
      completed,
      percent,

      assessmentTotal:
        assessment.total,

      assessmentPassed:
        assessment.passed,

      lessonsCompleted,
      assessmentsCompleted,
      isCompleted,
      assessmentRemaining,

      certificateNumber,

      continueHref,
      ctaLabel,
    });
  }

  return summaries;
}

export default async function DashboardPage() {
  let session = null;

  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!isSignedIn(session)) {
    return (
      <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Your learning dashboard
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Sign in to track your
            progress across devices
          </p>

          <Link
            href="/signin"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[#0E5C58] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003334] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58]"
          >
            Sign in or create account
          </Link>
        </div>
      </main>
    );
  }

  if (
    isAdminRole(session.user.role)
  ) {
    redirect("/admin");
  }

  const userId =
    await resolveSessionUserId(
      session
    );

  if (!userId) {
    return (
      <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm dark:border-amber-900/50 dark:bg-amber-950/40">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Account setup incomplete
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            You are signed in, but your
            learner profile could not be
            loaded. Check the database
            connection, then sign out and
            sign in again.
          </p>
        </div>
      </main>
    );
  }

  const databaseCourses =
    await getPublishedLearningCourses();

  const databaseCourseSlugs =
    new Set(
      databaseCourses.map(
        (course) => course.slug
      )
    );

  const databaseLessons =
    databaseCourses.flatMap(
      (course) =>
        course.lessons.map(
          (lesson) => ({
            course: course.slug,
            courseTitle:
              course.title,
            slug: lesson.slug,
            title: lesson.title,
            order: lesson.position,
          })
        )
    );

  const dashboardLessons = [
    ...lessons.map((lesson) => ({
      course: lesson.course,
      courseTitle:
        lesson.courseTitle,
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.order,
    })),

    ...databaseLessons,
  ];

  let rows: ProgressRow[] = [];

  let enrollmentRows:
    EnrollmentRow[] = [];

  let assessmentRows:
    AssessmentRow[] = [];

  let outstandingAssessmentRows:
    OutstandingAssessmentRow[] = [];

  let certificateRows:
    CertificateRow[] = [];

  let progressError = false;

  try {
    const result = await sql`
      SELECT
        course_slug,
        lesson_slug,
        completed_at
      FROM lesson_progress
      WHERE user_id = ${userId}
      ORDER BY completed_at DESC
    `;

    const enrollmentResult =
      await sql`
        SELECT
          c.slug AS course_slug,
          e.status
        FROM enrollments e

        INNER JOIN courses c
          ON c.id = e.course_id

        WHERE e.user_id = ${userId}
          AND e.status IN (
            'active',
            'completed'
          )
          AND c.status = 'published'

        ORDER BY e.enrolled_at DESC
      `;

    /*
     * Assessment totals and passed
     * requirements for every published
     * database course.
     */
    const assessmentResult =
      await sql`
        SELECT
          c.slug AS course_slug,

          COUNT(
            DISTINCT q.id
          )::int
            AS total_assessments,

          COUNT(
            DISTINCT CASE
              WHEN qa.id IS NOT NULL
              THEN q.id
            END
          )::int
            AS passed_assessments

        FROM courses c

        LEFT JOIN lessons l
          ON l.course_id = c.id
          AND l.status = 'published'

        LEFT JOIN quizzes q
          ON q.lesson_id = l.id
          AND q.status = 'published'

        LEFT JOIN quiz_attempts qa
          ON qa.quiz_id = q.id
          AND qa.user_id = ${userId}
          AND qa.status = 'completed'
          AND qa.passed = true

        WHERE c.status = 'published'

        GROUP BY c.id, c.slug
      `;

    /*
     * Find the first outstanding
     * assessment for each course.
     *
     * This lets the dashboard CTA go
     * directly to the quiz when all
     * lessons are already complete.
     */
    const outstandingResult =
      await sql`
        SELECT DISTINCT ON (c.slug)
          c.slug AS course_slug,
          l.slug AS lesson_slug,
          q.id AS quiz_id

        FROM courses c

        INNER JOIN lessons l
          ON l.course_id = c.id
          AND l.status = 'published'

        INNER JOIN quizzes q
          ON q.lesson_id = l.id
          AND q.status = 'published'

        WHERE c.status = 'published'

          AND NOT EXISTS (
            SELECT 1
            FROM quiz_attempts qa

            WHERE
              qa.quiz_id = q.id
              AND
              qa.user_id = ${userId}
              AND
              qa.status = 'completed'
              AND
              qa.passed = true
          )

        ORDER BY
          c.slug,
          l.position ASC,
          q.position ASC,
          q.created_at ASC
      `;

    const certificateResult =
      await sql`
        SELECT
          c.slug AS course_slug,
          cert.certificate_number
        FROM certificates cert
    
        INNER JOIN courses c
          ON c.id = cert.course_id
    
        WHERE cert.user_id = ${userId}
          AND c.status = 'published'
      `;

    rows = (
      result as ProgressRow[]
    ).filter(
      (row) =>
        typeof row.course_slug ===
        "string" &&
        typeof row.lesson_slug ===
        "string"
    );

    enrollmentRows = (
      enrollmentResult as
      EnrollmentRow[]
    ).filter(
      (row) =>
        typeof row.course_slug ===
        "string" &&
        (row.status === "active" ||
          row.status ===
          "completed")
    );

    assessmentRows = (
      assessmentResult as
      AssessmentRow[]
    ).filter(
      (row) =>
        typeof row.course_slug ===
        "string"
    );

    outstandingAssessmentRows = (
      outstandingResult as
      OutstandingAssessmentRow[]
    ).filter(
      (row) =>
        typeof row.course_slug ===
        "string" &&
        typeof row.lesson_slug ===
        "string" &&
        typeof row.quiz_id ===
        "string"
    );
    certificateRows = (
      certificateResult as CertificateRow[]
    ).filter(
      (row) =>
        typeof row.course_slug === "string" &&
        typeof row.certificate_number ===
        "string"
    );
  } catch (error) {
    console.error(
      "[dashboard] Failed to load progress:",
      error
    );

    progressError = true;
  }

  const lessonByKey = new Map(
    dashboardLessons.map(
      (lesson) =>
        [
          `${lesson.course}:${lesson.slug}`,
          lesson,
        ] as const
    )
  );

  const completedByCourse =
    new Map<
      string,
      Set<string>
    >();

  for (const row of rows) {
    if (
      !lessonByKey.has(
        `${row.course_slug}:${row.lesson_slug}`
      )
    ) {
      continue;
    }

    const set =
      completedByCourse.get(
        row.course_slug
      ) ?? new Set<string>();

    set.add(row.lesson_slug);

    completedByCourse.set(
      row.course_slug,
      set
    );
  }

  const outstandingByCourse =
    new Map<
      string,
      OutstandingAssessmentRow
    >();

  for (
    const row of
    outstandingAssessmentRows
  ) {
    if (
      !outstandingByCourse.has(
        row.course_slug
      )
    ) {
      outstandingByCourse.set(
        row.course_slug,
        row
      );
    }
  }

  const assessmentsByCourse =
    new Map<
      string,
      AssessmentSummary
    >();

  for (const row of assessmentRows) {
    /*
     * Assessment tables currently
     * belong to database-managed
     * courses. Static Academy courses
     * retain their existing behavior.
     */
    if (
      !databaseCourseSlugs.has(
        row.course_slug
      )
    ) {
      continue;
    }

    const outstanding =
      outstandingByCourse.get(
        row.course_slug
      );

    assessmentsByCourse.set(
      row.course_slug,
      {
        total:
          Number(
            row.total_assessments
          ) || 0,

        passed:
          Number(
            row.passed_assessments
          ) || 0,

        outstandingHref:
          outstanding
            ? `/learn/${row.course_slug}/${outstanding.lesson_slug}/quiz/${outstanding.quiz_id}`
            : null,
      }
    );
  }

  const certificatesByCourse =
    new Map<string, string>();

  for (const row of certificateRows) {
    certificatesByCourse.set(
      row.course_slug,
      row.certificate_number
    );
  }

  const enrolledCourseSlugs =
    new Set(
      enrollmentRows.map(
        (row) => row.course_slug
      )
    );

  const enrolledDashboardLessons =
    dashboardLessons.filter(
      (lesson) =>
        enrolledCourseSlugs.has(
          lesson.course
        )
    );

  const courseSummaries =
    buildCourseSummaries(
      enrolledDashboardLessons,
      completedByCourse,
      assessmentsByCourse,
      certificatesByCourse
    );

  const enrolledCoursesCount =
    courseSummaries.length;

  const completedLessonsCount =
    courseSummaries.reduce(
      (total, course) =>
        total + course.completed,
      0
    );

  /*
   * A course is now complete only when:
   *
   * 1. all lessons are complete
   * 2. all published assessments are
   *    passed
   */
  const completedCoursesCount =
    courseSummaries.filter(
      (course) =>
        course.isCompleted
    ).length;

  const recentActivity = rows
    .map((row) => {
      const lesson =
        lessonByKey.get(
          `${row.course_slug}:${row.lesson_slug}`
        );

      if (!lesson) {
        return null;
      }

      return {
        key:
          `${row.course_slug}:` +
          `${row.lesson_slug}:` +
          `${String(
            row.completed_at
          )}`,

        title: lesson.title,

        href:
          `/learn/${lesson.course}/${lesson.slug}`,

        when:
          formatActivityDate(
            row.completed_at
          ),
      };
    })
    .filter(
      (
        item
      ): item is NonNullable<
        typeof item
      > => item !== null
    )
    .slice(0, 5);

  const {
    name,
    email,
    image,
  } = session.user;

  const displayName =
    greetingName(name, email);

  const greeting =
    rows.length === 0
      ? "Welcome"
      : "Welcome back";

  return (
    <main className="min-h-[calc(100vh-var(--navbar-height))] bg-zinc-50 px-6 py-12 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="flex items-center gap-4">
          {image ? (
            <img
              src={image}
              alt=""
              width={56}
              height={56}
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0E5C58]/10 text-lg font-semibold text-[#0E5C58] dark:bg-[#0E5C58]/20 dark:text-[#85D7CE]">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </span>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
              Dashboard
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              {greeting},{" "}
              {displayName}
            </h1>
          </div>
        </header>

        <section className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
              Learning overview
            </p>

            <h2 className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
              Your progress at a glance
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                Enrolled courses
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {enrolledCoursesCount}
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Courses in your learning
                plan
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                Lessons completed
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {completedLessonsCount}
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Lessons completed across
                your courses
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                Courses completed
              </p>

              <p className="mt-3 text-3xl font-bold tracking-tight text-[#0E5C58] dark:text-[#85D7CE]">
                {completedCoursesCount}
              </p>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Courses you&apos;ve
                finished
              </p>
            </div>
          </div>
        </section>

        {progressError ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            Couldn&apos;t load progress
            right now. Your courses are
            still available — try
            refreshing in a moment.
          </p>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Your courses
          </h2>

          {courseSummaries.length >
            0 ? (
            <div className="grid gap-4">
              {courseSummaries.map(
                (course) => (
                  <article
                    key={course.slug}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold">
                            <Link
                              href={`/learn/${course.slug}`}
                              className="text-zinc-950 transition-colors hover:text-teal-700 hover:underline hover:underline-offset-4 dark:text-white dark:hover:text-teal-300"
                            >
                              {course.title}
                            </Link>
                          </h3>

                          {course.isCompleted ? (
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                              Completed
                            </span>
                          ) : course.assessmentRemaining ? (
                            <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                              Assessment
                              remaining
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                          {
                            course.completed
                          }{" "}
                          of {course.total}{" "}
                          lessons completed
                        </p>

                        {course.assessmentTotal >
                          0 && (
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                              {
                                course.assessmentPassed
                              }{" "}
                              of{" "}
                              {
                                course.assessmentTotal
                              }{" "}
                              assessments
                              passed
                            </p>
                          )}

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                          <div
                            className="h-full rounded-full bg-[#0E5C58] transition-[width] duration-300 dark:bg-[#85D7CE]"
                            style={{
                              width:
                                `${course.percent}%`,
                            }}
                          />
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                          <p className="text-xs font-medium text-[#0E5C58] dark:text-[#85D7CE]">
                            {
                              course.percent
                            }
                            % lesson progress
                          </p>

                          {course.assessmentRemaining && (
                            <p className="text-xs font-medium text-amber-700 dark:text-amber-300">
                              Pass the
                              remaining
                              assessment to
                              complete this
                              course
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {course.isCompleted &&
                          course.certificateNumber ? (
                          <Link
                            href={`/certificates/${course.certificateNumber}`}
                            className="rounded-xl bg-[#0E5C58] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003334] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58]"
                          >
                            View certificate
                          </Link>
                        ) : null}

                        <Link
                          href={course.continueHref}
                          className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] ${course.isCompleted &&
                              course.certificateNumber
                              ? "border border-zinc-300 text-zinc-700 hover:border-[#0E5C58] hover:text-[#0E5C58] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
                              : course.ctaLabel ===
                                "Review course"
                                ? "border border-zinc-300 text-zinc-700 hover:border-[#0E5C58] hover:text-[#0E5C58] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
                                : "bg-[#0E5C58] text-white hover:bg-[#003334]"
                            }`}
                        >
                          {course.ctaLabel}
                          {course.ctaLabel ===
                            "Take assessment"
                            ? " →"
                            : ""}
                        </Link>
                      </div>
                    </div>
                  </article>
                )
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                You haven&apos;t started a
                course yet
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Explore the Academy and
                choose a course to begin
                your learning journey.
                Your progress will appear
                here once you get started.
              </p>

              <Link
                href="/learn"
                className="mt-5 inline-flex items-center justify-center rounded-xl bg-[#0E5C58] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#003334] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58]"
              >
                Browse courses
              </Link>
            </div>
          )}
        </section>

        {recentActivity.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
              Recent activity
            </h2>

            <ul className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {recentActivity.map(
                (item) => (
                  <li
                    key={item.key}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                  >
                    <Link
                      href={item.href}
                      className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                    >
                      <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {item.title}
                      </span>

                      {item.when ? (
                        <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                          {item.when}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}