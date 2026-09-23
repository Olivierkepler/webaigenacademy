import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Target,
} from "lucide-react";

import { getAdminLessonById } from "@/lib/courses";
import { createQuiz } from "../actions";

export const dynamic = "force-dynamic";

type NewQuizPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

export default async function NewQuizPage({
  params,
}: NewQuizPageProps) {
  const { id, lessonId } = await params;

  const lesson = await getAdminLessonById(id, lessonId);

  if (!lesson) {
    notFound();
  }

  const createQuizAction = createQuiz.bind(
    null,
    id,
    lessonId
  );

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 lg:px-10">
        <div className="mb-7">
          <Link
            href={`/admin/courses/${id}/lessons/${lessonId}/quizzes`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to quizzes
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            Assessment management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Create quiz
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Create an assessment for this lesson. After creating the quiz,
            you can add questions, answer choices, and explanations.
          </p>
        </div>

        <form action={createQuizAction}>
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                    <ClipboardList className="h-4 w-4" />
                  </div>

                  <div>
                    <h2 className="text-base font-semibold text-zinc-950">
                      Quiz details
                    </h2>
                    <p className="mt-0.5 text-sm text-zinc-500">
                      Configure the basic assessment settings.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Quiz title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Supervised Learning Knowledge Check"
                    className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Use a clear title that tells learners what knowledge is
                    being assessed.
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-zinc-700"
                  >
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={5}
                    placeholder="Describe what learners should understand before taking this quiz."
                    className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-400">
                    Optional. This can explain the purpose or scope of the
                    assessment.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="passingScore"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Passing score
                    </label>

                    <div className="relative">
                      <input
                        id="passingScore"
                        name="passingScore"
                        type="number"
                        min={0}
                        max={100}
                        step={1}
                        defaultValue={70}
                        required
                        className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 pr-10 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                      />

                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-400">
                        %
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      Learners must reach this percentage to pass.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="status"
                      className="mb-2 block text-sm font-medium text-zinc-700"
                    >
                      Status
                    </label>

                    <input
                      type="hidden"
                      name="status"
                      value="draft"
                    />

                    <div
                      id="status"
                      className="flex h-11 w-full items-center rounded-lg border border-zinc-200 bg-zinc-50 px-3.5"
                    >
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                        Draft
                      </span>
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      New quizzes start as drafts. Add questions and answer choices
                      before publishing.
                    </p>
                  </div>

                </div>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
                <Link
                  href={`/admin/courses/${id}/lessons/${lessonId}/quizzes`}
                  className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Create quiz
                </button>
              </div>
            </div>

            <aside className="space-y-5">
              <section className="rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <BookOpen className="h-4 w-4 text-zinc-400" />
                  Assessment location
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Course
                    </p>
                    <p className="mt-1.5 text-sm font-medium leading-5 text-zinc-800">
                      {lesson.courseTitle}
                    </p>
                  </div>

                  <div className="border-t border-zinc-100 pt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                      Lesson
                    </p>
                    <p className="mt-1.5 text-sm font-medium leading-5 text-zinc-800">
                      {lesson.title}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-xl border border-zinc-200 bg-white p-5">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
                  <Target className="h-4 w-4 text-zinc-400" />
                  Recommended workflow
                </div>

                <div className="mt-4 space-y-4">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-xs font-semibold text-teal-700">
                      1
                    </div>
                    <p className="text-sm leading-5 text-zinc-500">
                      Create the quiz and keep it as a draft.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                      2
                    </div>
                    <p className="text-sm leading-5 text-zinc-500">
                      Add questions and configure the correct answers.
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                      3
                    </div>
                    <p className="text-sm leading-5 text-zinc-500">
                      Review the assessment and publish it for learners.
                    </p>
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}