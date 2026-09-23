"use client";

import Link from "next/link";
import {
  FormEvent,
  useMemo,
  useState,
} from "react";

import type {
  LearnerQuizQuestion,
} from "@/lib/quizzes";

export type LearnerQuizHistory = {
  attemptCount: number;
  bestScore: number | null;
  latestScore: number | null;
  latestPassed: boolean;
  hasPassed: boolean;
};

type QuizAttemptFormProps = {
  quizId: string;
  lessonHref: string;
  questions: LearnerQuizQuestion[];
  initialHistory: LearnerQuizHistory;
};

type SelectedAnswers = Record<
  string,
  string[]
>;

type SubmissionResult = {
  ok: true;
  attemptId: string;
  attemptNumber: number;
  scorePercent: number;
  earnedPoints: number;
  totalPoints: number;
  passingScore: number;
  passed: boolean;
};

function formatQuestionType(value: string) {
  if (value === "multiple_choice") {
    return "Multiple choice";
  }

  if (value === "true_false") {
    return "True / False";
  }

  return "Single choice";
}

export default function QuizAttemptForm({
  quizId,
  lessonHref,
  questions,
  initialHistory,
}: QuizAttemptFormProps) {
  const [answers, setAnswers] =
    useState<SelectedAnswers>({});

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<SubmissionResult | null>(null);

  const [history, setHistory] =
    useState<LearnerQuizHistory>(
      initialHistory
    );

  const answeredCount = useMemo(
    () =>
      questions.filter(
        (question) =>
          (answers[question.id]?.length ?? 0) > 0
      ).length,
    [answers, questions]
  );

  const allAnswered =
    answeredCount === questions.length;

  function selectOption(
    question: LearnerQuizQuestion,
    optionId: string
  ) {
    if (result || submitting) {
      return;
    }

    setError(null);

    setAnswers((current) => {
      const existing =
        current[question.id] ?? [];

      if (
        question.questionType ===
        "multiple_choice"
      ) {
        const selected =
          existing.includes(optionId);

        return {
          ...current,
          [question.id]: selected
            ? existing.filter(
                (id) => id !== optionId
              )
            : [...existing, optionId],
        };
      }

      return {
        ...current,
        [question.id]: [optionId],
      };
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (submitting || result) {
      return;
    }

    if (!allAnswered) {
      setError(
        "Please answer every question before submitting."
      );
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/quizzes/${quizId}/submit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answers: questions.map(
              (question) => ({
                questionId: question.id,
                optionIds:
                  answers[question.id] ?? [],
              })
            ),
          }),
        }
      );

      const data: unknown =
        await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof (
            data as { error?: unknown }
          ).error === "string"
            ? (
                data as { error: string }
              ).error
            : "Unable to submit the quiz.";

        throw new Error(message);
      }

      const submission =
        data as SubmissionResult;

      setResult(submission);

      setHistory((current) => ({
        attemptCount: Math.max(
          current.attemptCount + 1,
          submission.attemptNumber
        ),

        bestScore:
          current.bestScore === null
            ? submission.scorePercent
            : Math.max(
                current.bestScore,
                submission.scorePercent
              ),

        latestScore:
          submission.scorePercent,

        latestPassed:
          submission.passed,

        hasPassed:
          current.hasPassed ||
          submission.passed,
      }));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Unable to submit the quiz. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <section
        aria-live="polite"
        className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="p-7 sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  result.passed
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                {result.passed
                  ? "Passed"
                  : "Try again"}
              </div>

              <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {result.passed
                  ? "Knowledge check completed"
                  : "Keep learning"}
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                {result.passed
                  ? "You reached the required passing score for this assessment."
                  : `You need ${result.passingScore}% to pass. Review the lesson and try the assessment again.`}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-zinc-50 px-6 py-4 text-center dark:border-zinc-700 dark:bg-zinc-800/60">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Your score
              </p>

              <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-white">
                {result.scorePercent}%
              </p>
            </div>
          </div>

          <dl className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-700">
            <div className="bg-white px-5 py-4 dark:bg-zinc-900">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Points earned
              </dt>

              <dd className="mt-1 text-lg font-semibold">
                {result.earnedPoints} /{" "}
                {result.totalPoints}
              </dd>
            </div>

            <div className="bg-white px-5 py-4 dark:bg-zinc-900">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Passing score
              </dt>

              <dd className="mt-1 text-lg font-semibold">
                {result.passingScore}%
              </dd>
            </div>

            <div className="bg-white px-5 py-4 dark:bg-zinc-900">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Attempt
              </dt>

              <dd className="mt-1 text-lg font-semibold">
                #{result.attemptNumber}
              </dd>
            </div>
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            {!result.passed && (
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setAnswers({});
                  setError(null);

                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
                className="inline-flex h-10 items-center justify-center rounded-lg bg-[#003334] px-5 text-sm font-semibold text-white transition hover:bg-[#004849]"
              >
                Try again
              </button>
            )}

            <Link
              href={lessonHref}
              className={`inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold transition ${
                result.passed
                  ? "bg-[#003334] text-white hover:bg-[#004849]"
                  : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              }`}
            >
              Back to lesson
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="quiz-questions-heading"
      className="mt-8"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2
            id="quiz-questions-heading"
            className="text-xl font-semibold"
          >
            Quiz questions
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Answer every question before submitting
            your assessment.
          </p>
        </div>

        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {answeredCount} of {questions.length}{" "}
          answered
        </p>
      </div>

      {history.attemptCount > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          {history.hasPassed && (
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              Passed
            </span>
          )}

          <span>
            Best score:{" "}
            <strong>
              {history.bestScore ?? 0}%
            </strong>
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            {history.attemptCount}{" "}
            {history.attemptCount === 1
              ? "attempt"
              : "attempts"}
          </span>

          <span aria-hidden="true">
            •
          </span>

          <span>
            You can retake this quiz.
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {questions.map(
          (question, questionIndex) => (
            <fieldset
              key={question.id}
              disabled={submitting}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm disabled:opacity-70 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md bg-zinc-100 px-2 font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {questionIndex + 1}
                  </span>

                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                    {formatQuestionType(
                      question.questionType
                    )}
                  </span>

                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300">
                    {question.points}{" "}
                    {question.points === 1
                      ? "point"
                      : "points"}
                  </span>
                </div>

                <legend className="mt-4 text-base font-semibold leading-7 text-zinc-950 dark:text-white">
                  {question.question}
                </legend>
              </div>

              <div className="space-y-3 p-6">
                {question.options.map(
                  (option, optionIndex) => {
                    const selected = (
                      answers[
                        question.id
                      ] ?? []
                    ).includes(option.id);

                    const multiple =
                      question.questionType ===
                      "multiple_choice";

                    return (
                      <label
                        key={option.id}
                        className={`group flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3.5 transition ${
                          selected
                            ? "border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600/10 dark:border-emerald-700 dark:bg-emerald-950/20"
                            : "border-zinc-200 hover:border-emerald-300 hover:bg-emerald-50/40 dark:border-zinc-700 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/20"
                        }`}
                      >
                        <input
                          type={
                            multiple
                              ? "checkbox"
                              : "radio"
                          }
                          name={`question-${question.id}`}
                          value={option.id}
                          checked={selected}
                          onChange={() =>
                            selectOption(
                              question,
                              option.id
                            )
                          }
                          className="mt-1 h-4 w-4 accent-emerald-700"
                        />

                        <span className="flex min-w-0 gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                              selected
                                ? "bg-emerald-700 text-white"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-300"
                            }`}
                          >
                            {String.fromCharCode(
                              65 + optionIndex
                            )}
                          </span>

                          <span className="text-sm leading-6 text-zinc-700 dark:text-zinc-200">
                            {option.optionText}
                          </span>
                        </span>
                      </label>
                    );
                  }
                )}
              </div>
            </fieldset>
          )
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
              Ready to submit?
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              {allAnswered
                ? "All questions are answered. Review your selections before submitting."
                : `${answeredCount} of ${questions.length} questions answered.`}
            </p>
          </div>

          <button
            type="submit"
            disabled={
              submitting || !allAnswered
            }
            className="inline-flex h-10 min-w-[130px] shrink-0 items-center justify-center rounded-lg bg-[#003334] px-6 text-sm font-semibold text-white transition hover:bg-[#004849] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Submitting..."
              : "Submit quiz"}
          </button>
        </div>
      </form>
    </section>
  );
}