import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  Check,
  CheckCircle2,
  CircleHelp,
  ClipboardList,
  Pencil,
  Plus,
  Target,
} from "lucide-react";

import {
  getAdminQuizById,
  getAdminQuizQuestions,
} from "@/lib/quizzes";
import { deleteQuizQuestion } from "../actions";
import DeleteQuestionButton from "./questions/DeleteQuestionButton";

export const dynamic = "force-dynamic";

type QuizDetailPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
    quizId: string;
  }>;
};

function statusClasses(status: "draft" | "published" | "archived") {
  switch (status) {
    case "published":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "archived":
      return "border-zinc-200 bg-zinc-100 text-zinc-600";
    default:
      return "border-amber-200 bg-amber-50 text-amber-700";
  }
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function questionTypeLabel(value: string) {
  switch (value) {
    case "single_choice":
      return "Single choice";
    case "multiple_choice":
      return "Multiple choice";
    case "true_false":
      return "True / False";
    default:
      return value;
  }
}

export default async function QuizDetailPage({
  params,
}: QuizDetailPageProps) {
  const { id, lessonId, quizId } = await params;

  const [quiz, questions] = await Promise.all([
    getAdminQuizById(id, lessonId, quizId),
    getAdminQuizQuestions(id, lessonId, quizId),
  ]);

  if (!quiz) {
    notFound();
  }

  const hasQuestions = questions.length > 0;

  const allQuestionsHaveCorrectAnswers =
    hasQuestions &&
    questions.every((question) =>
      question.options.some((option) => option.isCorrect)
    );

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-7">
          <Link
            href={`/admin/courses/${id}/lessons/${lessonId}/quizzes`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to quizzes
          </Link>
        </div>

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                  quiz.status
                )}`}
              >
                {capitalize(quiz.status)}
              </span>

              <span className="text-sm text-zinc-400">
                Assessment
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              {quiz.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              {quiz.description || "No description provided for this quiz."}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-400">
              <span>{quiz.courseTitle}</span>
              <span aria-hidden="true">/</span>
              <span>{quiz.lessonTitle}</span>
            </div>
          </div>

          <Link
            href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/${quizId}/edit`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            <Pencil className="h-4 w-4" />
            Edit quiz
          </Link>
        </section>

        <section className="mb-7 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <div className="border-b border-zinc-200 p-6 sm:border-r xl:border-b-0">
              <p className="text-sm font-medium text-zinc-500">
                Questions
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                {questions.length}
              </p>
            </div>

            <div className="border-b border-zinc-200 p-6 xl:border-b-0 xl:border-r">
              <p className="text-sm font-medium text-zinc-500">
                Passing score
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                {quiz.passingScore}%
              </p>
            </div>

            <div className="border-b border-zinc-200 p-6 sm:border-r xl:border-b-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Attempts
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {quiz.attemptCount}
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-zinc-400" />
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm font-medium text-zinc-500">
                Status
              </p>
              <p className="mt-2 text-xl font-semibold text-zinc-950">
                {capitalize(quiz.status)}
              </p>
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="flex flex-col gap-4 border-b border-zinc-200 px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="text-base font-semibold leading-6 text-zinc-950">
                Questions
              </h2>

              <p className="mt-1 text-sm leading-5 text-zinc-500">
                Build the questions learners will answer in this assessment.
              </p>
            </div>

            <Link
              href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/${quizId}/questions/new`}
              className="inline-flex h-10 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
            >
              <Plus className="h-4 w-4 shrink-0" />
              <span>Add question</span>
            </Link>
          </div>

            {!hasQuestions ? (
              <div className="flex min-h-[360px] items-center justify-center px-6 py-12">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                    <CircleHelp className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-base font-semibold text-zinc-900">
                    No questions yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Add questions and answer choices to turn this quiz into a
                    complete learner assessment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {questions.map((question, questionIndex) => (
                  <article
                    key={question.id}
                    className="px-6 py-6"
                  >
                    <div className="flex gap-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-xs font-semibold text-zinc-600">
                        {questionIndex + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <h3 className="text-sm font-semibold leading-6 text-zinc-950">
                            {question.question}
                          </h3>

                          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                              {questionTypeLabel(question.questionType)}
                            </span>

                            <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                              {question.points}{" "}
                              {question.points === 1 ? "point" : "points"}
                            </span>

                            <Link
                              href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/${quizId}/questions/${question.id}/edit`}
                              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                              Edit
                            </Link>

                            <DeleteQuestionButton
                              action={deleteQuizQuestion.bind(
                                null,
                                id,
                                lessonId,
                                quizId,
                                question.id
                              )}
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid gap-2">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={option.id}
                              className={`flex items-center gap-3 rounded-lg border px-3.5 py-3 ${
                                option.isCorrect
                                  ? "border-emerald-200 bg-emerald-50/60"
                                  : "border-zinc-200 bg-white"
                              }`}
                            >
                              <div
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                                  option.isCorrect
                                    ? "bg-emerald-100 text-emerald-700"
                                    : "bg-zinc-100 text-zinc-500"
                                }`}
                              >
                                {option.isCorrect ? (
                                  <Check className="h-4 w-4" />
                                ) : (
                                  String.fromCharCode(65 + optionIndex)
                                )}
                              </div>

                              <span
                                className={`text-sm ${
                                  option.isCorrect
                                    ? "font-medium text-emerald-900"
                                    : "text-zinc-600"
                                }`}
                              >
                                {option.optionText}
                              </span>

                              {option.isCorrect && (
                                <span className="ml-auto text-xs font-medium text-emerald-700">
                                  Correct
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {question.explanation && (
                          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                              Explanation
                            </p>
                            <p className="mt-1.5 text-sm leading-6 text-zinc-600">
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-5">
            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                <ClipboardList className="h-4 w-4 text-zinc-400" />
                Quiz settings
              </div>

              <dl className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-sm text-zinc-500">
                    Passing score
                  </dt>
                  <dd className="text-sm font-semibold text-zinc-900">
                    {quiz.passingScore}%
                  </dd>
                </div>

                <div className="border-t border-zinc-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-zinc-500">
                      Position
                    </dt>
                    <dd className="text-sm font-semibold text-zinc-900">
                      {quiz.position}
                    </dd>
                  </div>
                </div>

                <div className="border-t border-zinc-100 pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-sm text-zinc-500">
                      Status
                    </dt>
                    <dd>
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClasses(
                          quiz.status
                        )}`}
                      >
                        {capitalize(quiz.status)}
                      </span>
                    </dd>
                  </div>
                </div>
              </dl>
            </section>

            <section className="rounded-xl border border-zinc-200 bg-white p-5">
              <h2 className="text-sm font-semibold text-zinc-900">
                Publishing checklist
              </h2>

              <div className="mt-4 space-y-3">
                <div className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                  <p className="text-sm leading-5 text-zinc-500">
                    Quiz details configured
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      hasQuestions
                        ? "text-teal-600"
                        : "text-zinc-300"
                    }`}
                  />
                  <p className="text-sm leading-5 text-zinc-500">
                    Add at least one question
                  </p>
                </div>

                <div className="flex gap-3">
                  <CheckCircle2
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      allQuestionsHaveCorrectAnswers
                        ? "text-teal-600"
                        : "text-zinc-300"
                    }`}
                  />
                  <p className="text-sm leading-5 text-zinc-500">
                    Configure correct answers
                  </p>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}