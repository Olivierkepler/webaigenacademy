import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  Plus,
} from "lucide-react";

import { getAdminLessonById } from "@/lib/courses";
import { getAdminQuizzesForLesson } from "@/lib/quizzes";

export const dynamic = "force-dynamic";

type QuizzesPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
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

export default async function AdminLessonQuizzesPage({
  params,
}: QuizzesPageProps) {
  const { id, lessonId } = await params;

  const lesson = await getAdminLessonById(id, lessonId);

  if (!lesson) {
    notFound();
  }

  const quizzes = await getAdminQuizzesForLesson(id, lessonId);

  const publishedCount = quizzes.filter(
    (quiz) => quiz.status === "published"
  ).length;

  const totalQuestions = quizzes.reduce(
    (total, quiz) => total + quiz.questionCount,
    0
  );

  const totalAttempts = quizzes.reduce(
    (total, quiz) => total + quiz.attemptCount,
    0
  );

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-7">
          <Link
            href={`/admin/courses/${id}/lessons/${lessonId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to lesson
          </Link>
        </div>

        <section className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
              <span className="h-2 w-2 rounded-full bg-teal-600" />
              Assessment management
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
              Quizzes
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              Create and manage assessments for{" "}
              <span className="font-medium text-zinc-700">
                {lesson.title}
              </span>
              .
            </p>

            <p className="mt-2 text-sm text-zinc-400">
              {lesson.courseTitle}
            </p>
          </div>

          <Link
            href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/new`}
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" />
            Create quiz
          </Link>
        </section>

        <section className="mb-7 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="grid sm:grid-cols-2 xl:grid-cols-4">
            <div className="border-b border-zinc-200 p-6 sm:border-r xl:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Total quizzes
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {quizzes.length}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 p-6 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Published
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {publishedCount}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 p-6 sm:border-r xl:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Questions
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {totalQuestions}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <ClipboardList className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Attempts
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {totalAttempts}
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <BarChart3 className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-6 py-5">
            <h2 className="text-base font-semibold text-zinc-950">
              Lesson quizzes
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Assessments currently configured for this lesson.
            </p>
          </div>

          {quizzes.length === 0 ? (
            <div className="flex min-h-[360px] items-center justify-center px-6 py-12">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                  <ClipboardList className="h-5 w-5" />
                </div>

                <h3 className="mt-5 text-base font-semibold text-zinc-900">
                  No quizzes yet
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Create an assessment to check learner understanding after
                  completing this lesson.
                </p>

                <Link
                  href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/new`}
                  className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
                >
                  <Plus className="h-4 w-4" />
                  Create first quiz
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-zinc-950">
                        {quiz.title}
                      </h3>

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusClasses(
                          quiz.status
                        )}`}
                      >
                        {capitalize(quiz.status)}
                      </span>
                    </div>

                    <p className="mt-2 max-w-3xl text-sm text-zinc-500">
                      {quiz.description || "No description provided."}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-400">
                      <span>{quiz.questionCount} questions</span>
                      <span>{quiz.attemptCount} attempts</span>
                      <span>Passing score {quiz.passingScore}%</span>
                      <span>Position {quiz.position}</span>
                    </div>
                  </div>

                  <Link
                    href={`/admin/courses/${id}/lessons/${lessonId}/quizzes/${quiz.id}`}
                    className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Manage quiz
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}