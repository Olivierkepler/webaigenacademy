import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { sql } from "@/lib/db";
import {
  getPublishedLearningLesson,
} from "@/lib/learning";
import {
  getPublishedQuizzesForLesson,
} from "@/lib/quizzes";
import {
  resolveSessionUserId,
} from "@/lib/sessionUser";

import QuizAttemptForm from "./QuizAttemptForm";

type PageProps = {
  params: Promise<{
    course: string;
    lesson: string;
    quizId: string;
  }>;
};

export type LearnerQuizHistory = {
  attemptCount: number;
  bestScore: number | null;
  latestScore: number | null;
  latestPassed: boolean;
  hasPassed: boolean;
};

type HistoryRow = {
  attemptCount: number;
  bestScore: number | null;
  latestScore: number | null;
  latestPassed: boolean | null;
  hasPassed: boolean;
};

export default async function LearnerQuizPage({
  params,
}: PageProps) {
  const {
    course,
    lesson: lessonSlug,
    quizId,
  } = await params;

  const lesson =
    await getPublishedLearningLesson(
      course,
      lessonSlug
    );

  if (!lesson) {
    notFound();
  }

  const quizzes =
    await getPublishedQuizzesForLesson(
      lesson.id
    );

  const quiz = quizzes.find(
    (item) => item.id === quizId
  );

  if (!quiz) {
    notFound();
  }

  const lessonHref =
    `/learn/${lesson.courseSlug}/${lesson.slug}`;

  const session = await auth();

  const userId =
    await resolveSessionUserId(session);

  let history: LearnerQuizHistory = {
    attemptCount: 0,
    bestScore: null,
    latestScore: null,
    latestPassed: false,
    hasPassed: false,
  };

  if (userId) {
    const rows = (await sql`
      SELECT
        COUNT(*)::int AS "attemptCount",

        MAX(score_percent)::int AS "bestScore",

        (
          SELECT qa_latest.score_percent
          FROM quiz_attempts qa_latest
          WHERE qa_latest.quiz_id = ${quiz.id}
            AND qa_latest.user_id = ${userId}
            AND qa_latest.status = 'completed'
          ORDER BY
            qa_latest.attempt_number DESC
          LIMIT 1
        )::int AS "latestScore",

        COALESCE(
          (
            SELECT qa_latest.passed
            FROM quiz_attempts qa_latest
            WHERE qa_latest.quiz_id = ${quiz.id}
              AND qa_latest.user_id = ${userId}
              AND qa_latest.status = 'completed'
            ORDER BY
              qa_latest.attempt_number DESC
            LIMIT 1
          ),
          false
        ) AS "latestPassed",

        COALESCE(
          BOOL_OR(passed),
          false
        ) AS "hasPassed"

      FROM quiz_attempts
      WHERE quiz_id = ${quiz.id}
        AND user_id = ${userId}
        AND status = 'completed'
    `) as HistoryRow[];

    const row = rows[0];

    if (row) {
      history = {
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

        latestPassed:
          Boolean(row.latestPassed),

        hasPassed:
          Boolean(row.hasPassed),
      };
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 lg:px-8 lg:py-14">
        <Link
          href={lessonHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white"
        >
          <span aria-hidden="true">
            ←
          </span>
          Back to lesson
        </Link>

        <header className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="p-7 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                    Knowledge check
                  </p>

                  {history.hasPassed && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      Previously passed
                    </span>
                  )}
                </div>

                <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
                  {quiz.title}
                </h1>

                {quiz.description && (
                  <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600 dark:text-zinc-300">
                    {quiz.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 dark:border-zinc-700 dark:bg-zinc-800/60">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Passing score
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {quiz.passingScore}%
                </p>
              </div>
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-700">
              <div className="bg-white px-5 py-4 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Questions
                </dt>

                <dd className="mt-1 text-lg font-semibold">
                  {quiz.questionCount}
                </dd>
              </div>

              <div className="bg-white px-5 py-4 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Total points
                </dt>

                <dd className="mt-1 text-lg font-semibold">
                  {quiz.totalPoints}
                </dd>
              </div>

              <div className="bg-white px-5 py-4 dark:bg-zinc-900">
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  Lesson
                </dt>

                <dd className="mt-1 truncate text-sm font-semibold">
                  {lesson.title}
                </dd>
              </div>
            </dl>

            {history.attemptCount > 0 && (
              <div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/40">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      Your quiz history
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Your completed attempts are
                      saved to your Academy
                      account.
                    </p>
                  </div>

                  {history.hasPassed && (
                    <span className="inline-flex w-fit rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                      Requirement completed
                    </span>
                  )}
                </div>

                <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Best score
                    </dt>

                    <dd className="mt-1 text-lg font-bold">
                      {history.bestScore ?? 0}%
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Latest score
                    </dt>

                    <dd className="mt-1 text-lg font-bold">
                      {history.latestScore ?? 0}%
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Attempts
                    </dt>

                    <dd className="mt-1 text-lg font-bold">
                      {history.attemptCount}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>
        </header>

        <QuizAttemptForm
          quizId={quiz.id}
          lessonHref={lessonHref}
          questions={quiz.questions}
          initialHistory={history}
        />
      </div>
    </main>
  );
}