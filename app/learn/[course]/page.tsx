import Link from "next/link";
import { notFound } from "next/navigation";
import StartLearningButton from "@/app/components/StartLearningButton";
import { lessons } from "@/data/lessons";
import { getPublishedLearningCourseBySlug } from "@/lib/learning";
import { typography } from "@/app/lib/typography";
import { CourseCurriculum } from "@/app/components/CourseOverviewClient";
import Image from "next/image";
import Footer from "@/app/components/footer";
import SubNav from "@/app/components/SubNav";
import VideoTutorial from "@/app/components/lesson/VideoTutorial";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { resolveSessionUserId } from "@/lib/sessionUser";

const COURSE_DESCRIPTION =
  "Learn machine learning step by step with interactive lessons, browser-based notebooks, and quizzes.";

const included = [
  {
    title: "Interactive Practice Labs",
    description:
      "Run Python notebooks in your browser with JupyterLite—no local setup required.",
  },
  {
    title: "Quick Quizzes",
    description:
      "Check your understanding with short quizzes after each lesson.",
  },
  {
    title: "Downloadable Notebooks",
    description:
      "Download starter notebooks from each lesson to practice offline.",
  },
] as const;

const pageText = "text-black dark:text-white";
const mutedText = "text-black/70 dark:text-white/70";

type PageProps = {
  params: Promise<{
    course: string;
  }>;
};

type AssessmentSummaryRow = {
  total_assessments: number;
  passed_assessments: number;
};

type AssessmentSummary = {
  total: number;
  passed: number;
};

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF7F6] text-[#0E5C58] dark:bg-[#0E5C58]/20 dark:text-[#85D7CE]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-4 w-4"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default async function CoursePage({ params }: PageProps) {
  const { course } = await params;

  /*
  * First check whether this is an admin-managed PostgreSQL course.
  *
  * Only published courses and published lessons are returned by
  * getPublishedLearningCourseBySlug().
  */
  const databaseCourse = await getPublishedLearningCourseBySlug(course);

  const databaseLessons = databaseCourse?.lessons ?? [];

  /*
  * Existing filesystem lessons remain supported.
  * This preserves the original Machine Learning course.
  */
  const filesystemLessons = lessons
    .filter((lesson) => lesson.course === course)
    .sort((a, b) => a.order - b.order);

  const isDatabaseCourse = Boolean(databaseCourse);

  if (!isDatabaseCourse && filesystemLessons.length === 0) {
    notFound();
  }

  /*
  * Normalize both lesson sources into the small shape required by
  * this course-overview page.
  */
  const courseLessons = isDatabaseCourse
    ? databaseLessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.position + 1,
      section: lesson.section ?? "Course content",
      description: lesson.description ?? "",
      duration: lesson.duration ?? "",
      difficulty: lesson.difficulty ?? "beginner",
    }))
    : filesystemLessons.map((lesson) => ({
      slug: lesson.slug,
      title: lesson.title,
      order: lesson.order,
      section: lesson.section,
      description: lesson.description,
      duration: lesson.duration,
      difficulty: lesson.difficulty,
    }));

  const courseTitle = isDatabaseCourse
    ? databaseCourse!.title
    : filesystemLessons[0].courseTitle;

  const courseDescription = isDatabaseCourse
    ? databaseCourse!.description || COURSE_DESCRIPTION
    : COURSE_DESCRIPTION;

  const rawDifficulty =
    courseLessons[0]?.difficulty ?? "Introductory";

  const difficulty =
    rawDifficulty.charAt(0).toUpperCase() +
    rawDifficulty.slice(1);

  const firstLessonPath =
    courseLessons.length > 0
      ? `/learn/${course}/${courseLessons[0].slug}`
      : null;

  const session = await auth();
  const userId = await resolveSessionUserId(session);

  let completedLessonSlugs =
    new Set<string>();

  let assessments: AssessmentSummary = {
    total: 0,
    passed: 0,
  };

  let completedAt: string | null = null;
  let certificateNumber: string | null = null;

  if (userId) {
    const progressRows = (await sql`
    SELECT lesson_slug
    FROM lesson_progress
    WHERE user_id = ${userId}
      AND course_slug = ${course}
  `) as Array<{
      lesson_slug: string;
    }>;

    completedLessonSlugs = new Set(
      progressRows.map(
        (row) => row.lesson_slug
      )
    );
    if (isDatabaseCourse && databaseCourse) {
      const enrollmentRows = (await sql`
        SELECT completed_at
        FROM enrollments
        WHERE user_id = ${userId}
          AND course_id = ${databaseCourse.id}
          AND status = 'completed'
        LIMIT 1
      `) as Array<{
        completed_at: Date | string | null;
      }>;

      const completedAtValue =
        enrollmentRows[0]?.completed_at;

      if (completedAtValue instanceof Date) {
        completedAt = completedAtValue.toISOString();
      } else if (typeof completedAtValue === "string") {
        completedAt = completedAtValue;
      }

      const certificateRows = (await sql`
        SELECT certificate_number
        FROM certificates
        WHERE user_id = ${userId}
          AND course_id = ${databaseCourse.id}
        LIMIT 1
      `) as Array<{
        certificate_number: string;
      }>;

      certificateNumber =
        certificateRows[0]?.certificate_number ?? null;
    }
  }

  if (isDatabaseCourse) {
    const assessmentRows = (await sql`
    SELECT
      COUNT(DISTINCT q.id)::int
        AS total_assessments,

      COUNT(
        DISTINCT CASE
          WHEN qa.id IS NOT NULL
          THEN q.id
        END
      )::int AS passed_assessments

    FROM courses c

    INNER JOIN lessons l
      ON l.course_id = c.id
      AND l.status = 'published'

    INNER JOIN quizzes q
      ON q.lesson_id = l.id
      AND q.status = 'published'

    LEFT JOIN quiz_attempts qa
      ON qa.quiz_id = q.id
      AND qa.user_id = ${userId}
      AND qa.status = 'completed'
      AND qa.passed = true

    WHERE c.slug = ${course}
      AND c.status = 'published'
  `) as AssessmentSummaryRow[];

    const row = assessmentRows[0];

    assessments = {
      total:
        Number(
          row?.total_assessments
        ) || 0,

      passed:
        Number(
          row?.passed_assessments
        ) || 0,
    };
  }

  const completedCount = courseLessons.filter((lesson) =>
    completedLessonSlugs.has(lesson.slug)
  ).length;

  const totalLessons = courseLessons.length;

  const progressPercent =
    totalLessons > 0
      ? Math.round((completedCount / totalLessons) * 100)
      : 0;

  const lessonsCompleted =
    totalLessons > 0 &&
    completedCount === totalLessons;

  const assessmentsCompleted =
    assessments.total === 0 ||
    assessments.passed ===
    assessments.total;

  const isCompleted =
    lessonsCompleted &&
    assessmentsCompleted;

  const formattedCompletionDate =
    isCompleted && completedAt
      ? new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(completedAt))
      : null;

  const nextLesson = courseLessons.find(
    (lesson) => !completedLessonSlugs.has(lesson.slug)
  );

  const continueLessonPath = nextLesson
    ? `/learn/${course}/${nextLesson.slug}`
    : firstLessonPath;

  let outstandingAssessmentPath:
    | string
    | null = null;

  if (
    isDatabaseCourse &&
    userId &&
    lessonsCompleted &&
    !assessmentsCompleted
  ) {
    const outstandingRows = (await sql`
    SELECT
      l.slug AS lesson_slug,
      q.id AS quiz_id
    FROM courses c

    INNER JOIN lessons l
      ON l.course_id = c.id
      AND l.status = 'published'

    INNER JOIN quizzes q
      ON q.lesson_id = l.id
      AND q.status = 'published'

    WHERE c.slug = ${course}
      AND c.status = 'published'

      AND NOT EXISTS (
        SELECT 1
        FROM quiz_attempts qa
        WHERE qa.quiz_id = q.id
          AND qa.user_id = ${userId}
          AND qa.status = 'completed'
          AND qa.passed = true
      )

    ORDER BY
      l.position ASC,
      q.position ASC,
      q.created_at ASC

    LIMIT 1
  `) as Array<{
      lesson_slug: string;
      quiz_id: string;
    }>;

    const outstanding =
      outstandingRows[0];

    if (outstanding) {
      outstandingAssessmentPath =
        `/learn/${course}/${outstanding.lesson_slug}/quiz/${outstanding.quiz_id}`;
    }
  }

  const assessmentRemaining =
    lessonsCompleted &&
    !assessmentsCompleted &&
    assessments.total > 0;

  // edX-style "at a glance" facts
  const atAGlance = [
    {
      label: "Lessons",
      value: `${completedCount} / ${totalLessons} completed`,
    },
    {
      label: "Assessments",
      value:
        assessments.total > 0
          ? `${assessments.passed} / ${assessments.total} passed`
          : "None",
    },
    {
      label: "Level",
      value:
        difficulty ?? "Introductory",
    },
    {
      label: "Pace",
      value: "Self-paced",
    },
    {
      label: "Format",
      value: "100% in browser",
    },
    {
      label: "Price",
      value: "Free",
    },
  ] as const;

  // "What you'll learn" bullets derived from the curriculum
  const learningOutcomes = courseLessons.map(
    (lesson) => lesson.description ?? lesson.title
  );

  const courseVideo = isDatabaseCourse
    ? undefined
    : filesystemLessons.find((lesson) => lesson.video)?.video;

  return (
    <main
      className={`min-h-screen bg-white font-[Inter,Helvetica_Neue,Arial,sans-serif] dark:bg-zinc-950 ${pageText}`}
    >
      {/* ── Hero band (full-bleed, edX-style) ─────────────────────── */}
      <header
        className={`relative overflow-hidden dark:border-b dark:border-zinc-800 ${pageText}`}
      >
        <Image
          src="/images/Designer(24).png"
          alt=""
          fill
          priority
          className="object-cover object-center -z-20"
          sizes="100vw"
        />

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10 lg:px-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className={`flex flex-wrap items-center gap-2 text-sm ${mutedText}`}>
              <li>
                <Link
                  href="/"
                  className={`transition-colors hover:opacity-100 ${pageText}`}
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li>
                <Link
                  href="/learn"
                  className={`transition-colors hover:opacity-100 ${pageText}`}
                >
                  Courses
                </Link>
              </li>
              <li aria-hidden="true" className="opacity-40">
                /
              </li>
              <li aria-current="page" className={pageText}>
                {courseTitle}
              </li>
            </ol>
          </nav>

          <div className="mt-10 max-w-3xl">
            <p
              className={`text-xs uppercase tracking-[0.22em] ${mutedText}`}
            >
              Course · WebAIGen Academy
            </p>
            <h1
              className={`mt-4 text-4xl font-black italic leading-[0.95] tracking-tight sm:text-5xl ${pageText}`}
            >
              {courseTitle}
            </h1>
            <p className={`mt-5 text-lg leading-relaxed ${mutedText}`}>
              {courseDescription}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {firstLessonPath ? (
                isCompleted ? (
                  <Link
                    href={firstLessonPath}
                    className="inline-flex items-center rounded-lg bg-[#003334] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B5F59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003334] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Review lessons
                  </Link>
                ) : assessmentRemaining &&
                  outstandingAssessmentPath ? (
                  <Link
                    href={outstandingAssessmentPath}
                    className="inline-flex items-center rounded-lg bg-[#003334] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B5F59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003334] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Take assessment →
                  </Link>
                ) : completedCount > 0 &&
                  continueLessonPath ? (
                  <Link
                    href={continueLessonPath}
                    className="inline-flex items-center rounded-lg bg-[#003334] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B5F59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003334] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Continue learning
                  </Link>
                ) : (
                  <StartLearningButton
                    courseSlug={course}
                    firstLessonPath={firstLessonPath}
                    isDatabaseCourse={isDatabaseCourse}
                    className="rounded-lg bg-[#003334] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B5F59] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003334] dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Start learning — it&apos;s free
                  </StartLearningButton>
                )
              ) : (
                <span className="cursor-not-allowed rounded-lg bg-zinc-200 px-6 py-3 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  Lessons coming soon
                </span>
              )}
              <Link
                href="#syllabus"
                className={`rounded-lg border border-black/25 px-6 py-3 text-sm font-semibold transition-colors hover:border-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:border-white/25 dark:hover:border-white/50 dark:focus-visible:outline-white ${pageText}`}
              >
                View syllabus
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div id="syllabus" className="mx-auto max-w-7xl py-16">
        <div className="my-8">
          <SubNav
            course={course}
            firstLessonSlug={courseLessons[0]?.slug}
          />
        </div>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_380px]">
          {/* ===================================================== */}
          {/* LEFT COLUMN */}
          {/* ===================================================== */}

          <div className="space-y-16">
            {/* What you'll learn */}
            {/* <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-[#F5FAF9] p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:from-zinc-900 dark:to-zinc-900 lg:p-10">
        
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0E5C58] via-[#0E5C58]/60 to-transparent dark:from-[#85D7CE] dark:via-[#85D7CE]/40"
        />

        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
          Learning outcomes
        </p>

        <h2 className={`mt-3 ${typography.sectionTitle}`}>
          What you&apos;ll learn
        </h2>

        <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {learningOutcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3">
              <CheckIcon />
              <span className={typography.body}>{outcome}</span>
            </li>
          ))}
        </ul>
      </section> */}

            {/* Curriculum */}
            <section className="scroll-mt-28">
              <div>
                <CourseCurriculum
                  course={course}
                  lessons={courseLessons.map((lesson) => ({
                    slug: lesson.slug,
                    title: lesson.title,
                    order: lesson.order,
                    section: lesson.section,
                    description: lesson.description,
                    duration: lesson.duration,
                    difficulty: lesson.difficulty,
                  }))}
                />
              </div>
            </section>
          </div>

          {/* ===================================================== */}
          {/* RIGHT COLUMN */}
          {/* ===================================================== */}

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {/* Video Tutorial */}
            {courseVideo ? <VideoTutorial video={courseVideo} /> : null}

            {/* At a glance */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className={`text-lg font-bold ${pageText}`}>At a glance</h3>

              <dl className="mt-6 space-y-5">
                {atAGlance.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
                  >
                    <dt className={`text-sm ${mutedText}`}>{fact.label}</dt>

                    <dd className={`font-semibold ${pageText}`}>{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Included */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h3 className={`text-lg font-bold ${pageText}`}>
                This course includes
              </h3>

              <div className="mt-6 space-y-5">
                {included.map((feature) => (
                  <div key={feature.title}>
                    <h4 className={`font-semibold ${pageText}`}>
                      {feature.title}
                    </h4>

                    <p className={`mt-1 text-sm ${mutedText}`}>
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA — solid dark panel keeps high-contrast white text */}
            {/* Course action */}
            <section className="overflow-hidden rounded-2xl bg-[#003334] p-8 text-white">
              {isCompleted ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-white">
                    Course completed
                  </h3>

                  <p className="mt-3 text-white/70">
                    You&apos;ve successfully completed all course
                    requirements.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white/70">
                        Lessons
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {completedCount} / {totalLessons} completed
                      </span>
                    </div>

                    {assessments.total > 0 ? (
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="text-sm text-white/70">
                          Assessments
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {assessments.passed} / {assessments.total} passed
                        </span>
                      </div>
                    ) : null}

                    {formattedCompletionDate ? (
                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="text-sm text-white/70">
                          Completed
                        </span>

                        <span className="text-sm font-semibold text-white">
                          {formattedCompletionDate}
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {certificateNumber ? (
                    <Link
                      href={`/certificates/${certificateNumber}`}
                      className="mt-8 flex w-full items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                    >
                      View certificate
                    </Link>
                  ) : null}
                  
                  {firstLessonPath ? (
                    <Link
                      href={firstLessonPath}
                      className="mt-3 flex w-full items-center justify-center rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                    >
                      Review course
                    </Link>
                  ) : null}
                </>
              ) : assessmentRemaining &&
                outstandingAssessmentPath ? (
                <>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 6v6l4 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                      />
                    </svg>
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">
                    Final requirement
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Assessment remaining
                  </h3>

                  <p className="mt-3 text-white/70">
                    You&apos;ve completed all{" "}
                    {totalLessons}{" "}
                    {totalLessons === 1
                      ? "lesson"
                      : "lessons"}
                    . Pass the remaining knowledge
                    check to complete this course.
                  </p>

                  <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-white/70">
                        Lessons
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {completedCount} / {totalLessons}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <span className="text-sm text-white/70">
                        Assessments
                      </span>

                      <span className="text-sm font-semibold text-white">
                        {assessments.passed} /{" "}
                        {assessments.total} passed
                      </span>
                    </div>
                  </div>

                  <Link
                    href={outstandingAssessmentPath}
                    className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Take assessment
                    <span aria-hidden="true">
                      →
                    </span>
                  </Link>
                </>
              ) : completedCount > 0 &&
                continueLessonPath ? (
                <>
                  <h3 className="text-2xl font-bold text-white">
                    Continue learning
                  </h3>

                  <p className="mt-3 text-white/70">
                    You&apos;ve completed {completedCount} of {totalLessons} lessons.
                    Pick up where you left off.
                  </p>

                  <div className="mt-6">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-white/70">Course progress</span>
                      <span className="font-semibold text-white">
                        {progressPercent}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white"
                        style={{ width: `${Math.min(progressPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  <Link
                    href={continueLessonPath}
                    className="mt-8 flex w-full justify-center rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200"
                  >
                    Continue learning
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white">
                    Ready to start?
                  </h3>

                  <p className="mt-3 text-white/70">
                    Learn at your own pace with interactive lessons, quizzes, and
                    hands-on practice.
                  </p>

                  {firstLessonPath ? (
                    <StartLearningButton
                      courseSlug={course}
                      firstLessonPath={firstLessonPath}
                      isDatabaseCourse={isDatabaseCourse}
                      className="mt-8 flex w-full justify-center rounded-xl bg-white px-6 py-3 font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Start Learning Free
                    </StartLearningButton>
                  ) : (
                    <div className="mt-8 flex cursor-not-allowed justify-center rounded-xl bg-white/20 px-6 py-3 font-semibold text-white/60">
                      Lessons coming soon
                    </div>
                  )}
                </>
              )}
            </section>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
