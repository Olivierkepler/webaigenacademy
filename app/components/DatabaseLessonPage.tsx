import Link from "next/link";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import type { LearningLesson } from "@/lib/learning";
import { getPublishedQuizzesForLesson } from "@/lib/quizzes";
import { resolveSessionUserId } from "@/lib/sessionUser";

import LessonContent from "./LessonContent";
import MarkCompleteButton from "./MarkCompleteButton";

type Props = {
  lesson: LearningLesson;
  lessons: LearningLesson[];
};

type QuizHistory = {
  attemptCount: number;
  bestScore: number | null;
  latestScore: number | null;
  hasPassed: boolean;
};

type QuizHistoryRow = {
  quizId: string;
  attemptCount: number;
  bestScore: number | null;
  latestScore: number | null;
  hasPassed: boolean;
};

function formatDifficulty(value: string | null) {
  if (!value) return "Not specified";

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

export default async function DatabaseLessonPage({
  lesson,
  lessons,
}: Props) {
  const currentIndex = lessons.findIndex(
    (item) => item.id === lesson.id
  );

  const previousLesson =
    currentIndex > 0
      ? lessons[currentIndex - 1]
      : undefined;

  const nextLesson =
    currentIndex >= 0 &&
    currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : undefined;

  const publishedQuizzes =
    await getPublishedQuizzesForLesson(
      lesson.id
    );

  /*
   * Load quiz completion/history for the
   * currently signed-in learner.
   *
   * This does NOT change lesson completion.
   * It only makes the assessment UI aware
   * of existing quiz attempts.
   */
  const quizHistoryById =
    new Map<string, QuizHistory>();

  if (publishedQuizzes.length > 0) {
    const session = await auth();

    const userId =
      await resolveSessionUserId(session);

    if (userId) {
      const quizIds =
        publishedQuizzes.map(
          (quiz) => quiz.id
        );

      /*
       * Our sql helper uses tagged templates,
       * so query each published quiz separately.
       *
       * Usually a lesson only has one or a small
       * number of quizzes, keeping this simple
       * and safe.
       */
      const historyResults =
        await Promise.all(
          quizIds.map(async (quizId) => {
            const rows = (await sql`
              SELECT
                ${quizId}::text AS "quizId",

                COUNT(*)::int AS "attemptCount",

                MAX(score_percent)::int
                  AS "bestScore",

                (
                  SELECT qa_latest.score_percent
                  FROM quiz_attempts qa_latest
                  WHERE
                    qa_latest.quiz_id = ${quizId}
                    AND
                    qa_latest.user_id = ${userId}
                    AND
                    qa_latest.status = 'completed'
                  ORDER BY
                    qa_latest.attempt_number DESC
                  LIMIT 1
                )::int AS "latestScore",

                COALESCE(
                  BOOL_OR(passed),
                  false
                ) AS "hasPassed"

              FROM quiz_attempts
              WHERE
                quiz_id = ${quizId}
                AND
                user_id = ${userId}
                AND
                status = 'completed'
            `) as QuizHistoryRow[];

            return rows[0] ?? null;
          })
        );

      for (const row of historyResults) {
        if (!row) continue;

        quizHistoryById.set(
          row.quizId,
          {
            attemptCount:
              Number(row.attemptCount) || 0,

            bestScore:
              row.bestScore === null
                ? null
                : Number(row.bestScore),

            latestScore:
              row.latestScore === null
                ? null
                : Number(row.latestScore),

            hasPassed:
              Boolean(row.hasPassed),
          }
        );
      }
    }
  }

  const passedQuizCount =
    publishedQuizzes.filter(
      (quiz) =>
        quizHistoryById.get(quiz.id)
          ?.hasPassed
    ).length;

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-8 lg:py-14">
        <Link
          href={`/learn/${lesson.courseSlug}`}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
        >
          <span aria-hidden="true">
            ←
          </span>
          Back to course
        </Link>

        <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            {lesson.section && (
              <span>
                {lesson.section}
              </span>
            )}

            {lesson.section &&
              lesson.difficulty && (
                <span aria-hidden="true">
                  •
                </span>
              )}

            {lesson.difficulty && (
              <span>
                {formatDifficulty(
                  lesson.difficulty
                )}
              </span>
            )}

            {lesson.duration && (
              <>
                <span aria-hidden="true">
                  •
                </span>

                <span>
                  {lesson.duration}
                </span>
              </>
            )}
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
            {lesson.courseTitle}
          </p>

          <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">
            {lesson.title}
          </h1>

          {lesson.description && (
            <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              {lesson.description}
            </p>
          )}
        </header>

        <div className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_280px] xl:gap-16">
          <article className="min-w-0">
            {lesson.content.trim() ? (
              <LessonContent
                content={lesson.content}
                hideTitle
              />
            ) : (
              <div className="rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
                <h2 className="text-xl font-semibold">
                  Lesson content coming soon
                </h2>

                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  Learning material has not
                  been added to this lesson
                  yet.
                </p>
              </div>
            )}

            {publishedQuizzes.length > 0 && (
              <section
                aria-labelledby="knowledge-check-heading"
                className="mt-12 border-t border-zinc-200 pt-10 dark:border-zinc-800"
              >
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Assessment
                  </p>

                  <h2
                    id="knowledge-check-heading"
                    className="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white"
                  >
                    Knowledge Check
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    Check your understanding
                    of the lesson before
                    moving forward.
                  </p>
                </div>

                <div className="space-y-4">
                  {publishedQuizzes.map(
                    (quiz) => {
                      const history =
                        quizHistoryById.get(
                          quiz.id
                        );

                      const hasAttempts =
                        (history
                          ?.attemptCount ??
                          0) > 0;

                      const hasPassed =
                        history?.hasPassed ??
                        false;

                      const quizHref =
                        `/learn/${lesson.courseSlug}/${lesson.slug}/quiz/${quiz.id}`;

                      return (
                        <div
                          key={quiz.id}
                          className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                        >
                          <div className="p-6 sm:p-7">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                              <div className="min-w-0">
                                <div className="mb-3 flex flex-wrap items-center gap-2">
                                  {hasPassed ? (
                                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                      Passed
                                    </span>
                                  ) : hasAttempts ? (
                                    <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                                      In progress
                                    </span>
                                  ) : (
                                    <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                                      Not started
                                    </span>
                                  )}

                                  <span className="text-xs font-medium text-zinc-400">
                                    Knowledge check
                                  </span>
                                </div>

                                <h3 className="text-lg font-semibold leading-7 text-zinc-950 dark:text-white">
                                  {quiz.title}
                                </h3>

                                {hasPassed ? (
                                  <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                    Assessment
                                    completed
                                    successfully. You
                                    can review or
                                    retake the quiz at
                                    any time.
                                  </p>
                                ) : (
                                  quiz.description && (
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                      {
                                        quiz.description
                                      }
                                    </p>
                                  )
                                )}
                              </div>

                              <Link
                                href={quizHref}
                                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#003334] px-5 text-sm font-semibold text-white transition hover:bg-[#004849] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-900"
                              >
                                {hasPassed
                                  ? "Review / Retake"
                                  : hasAttempts
                                    ? "Try again"
                                    : "Start quiz"}

                                <span aria-hidden="true">
                                  →
                                </span>
                              </Link>
                            </div>

                            {hasAttempts ? (
                              <dl className="mt-6 grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-100 pt-5 dark:divide-zinc-800 dark:border-zinc-800">
                                <div className="pr-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Best score
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {history
                                      ?.bestScore ??
                                      0}
                                    %
                                  </dd>
                                </div>

                                <div className="px-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Attempts
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {history
                                      ?.attemptCount ??
                                      0}
                                  </dd>
                                </div>

                                <div className="pl-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Pass score
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {
                                      quiz.passingScore
                                    }
                                    %
                                  </dd>
                                </div>
                              </dl>
                            ) : (
                              <dl className="mt-6 grid grid-cols-3 divide-x divide-zinc-200 border-t border-zinc-100 pt-5 dark:divide-zinc-800 dark:border-zinc-800">
                                <div className="pr-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Questions
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {
                                      quiz.questionCount
                                    }
                                  </dd>
                                </div>

                                <div className="px-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Points
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {
                                      quiz.totalPoints
                                    }
                                  </dd>
                                </div>

                                <div className="pl-4">
                                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                                    Pass score
                                  </dt>

                                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {
                                      quiz.passingScore
                                    }
                                    %
                                  </dd>
                                </div>
                              </dl>
                            )}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </section>
            )}

            <div className="mt-12 border-t border-zinc-200 pt-8 dark:border-zinc-800">
              <MarkCompleteButton
                course={lesson.courseSlug}
                lessonSlug={lesson.slug}
              />
            </div>
          </article>

          <aside className="lg:pt-1">
            <div className="sticky top-28 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-200 px-6 py-5 dark:border-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                  Lesson overview
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-zinc-900 dark:text-white">
                  {lesson.title}
                </p>
              </div>

              <dl className="divide-y divide-zinc-100 px-6 dark:divide-zinc-800">
                {lesson.section && (
                  <div className="py-4">
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Section
                    </dt>

                    <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {lesson.section}
                    </dd>
                  </div>
                )}

                <div className="py-4">
                  <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                    Difficulty
                  </dt>

                  <dd className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {formatDifficulty(
                      lesson.difficulty
                    )}
                  </dd>
                </div>

                {lesson.duration && (
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                      Duration
                    </dt>

                    <dd className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {lesson.duration}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 py-4">
                  <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                    Lesson
                  </dt>

                  <dd className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {currentIndex >= 0
                      ? `${currentIndex + 1} of ${lessons.length}`
                      : "—"}
                  </dd>
                </div>

                {publishedQuizzes.length >
                  0 && (
                  <div className="flex items-center justify-between gap-4 py-4">
                    <dt className="text-sm text-zinc-500 dark:text-zinc-400">
                      Assessment
                    </dt>

                    <dd
                      className={`text-sm font-semibold ${
                        passedQuizCount ===
                        publishedQuizzes.length
                          ? "text-emerald-700 dark:text-emerald-400"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {passedQuizCount ===
                      publishedQuizzes.length
                        ? publishedQuizzes.length ===
                          1
                          ? "Passed"
                          : `${passedQuizCount}/${publishedQuizzes.length} passed`
                        : passedQuizCount >
                            0
                          ? `${passedQuizCount}/${publishedQuizzes.length} passed`
                          : publishedQuizzes.length ===
                              1
                            ? "1 quiz"
                            : `${publishedQuizzes.length} quizzes`}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </aside>
        </div>

        {(previousLesson ||
          nextLesson) && (
          <nav
            aria-label="Lesson navigation"
            className="flex items-center justify-between gap-4 border-t border-zinc-200 pt-8 dark:border-zinc-800"
          >
            <div>
              {previousLesson && (
                <Link
                  href={`/learn/${lesson.courseSlug}/${previousLesson.slug}`}
                  className="inline-flex rounded-lg border border-zinc-300 px-5 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
                >
                  ← Previous lesson
                </Link>
              )}
            </div>

            <div>
              {nextLesson && (
                <Link
                  href={`/learn/${lesson.courseSlug}/${nextLesson.slug}`}
                  className="inline-flex rounded-lg bg-[#003334] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#004849]"
                >
                  Next lesson →
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </main>
  );
}