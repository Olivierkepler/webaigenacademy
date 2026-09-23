import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";

import { getAdminCourseById } from "@/lib/courses";
import { createLesson } from "../actions";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewLessonPage({ params }: PageProps) {
  const { id } = await params;

  const course = await getAdminCourseById(id);

  if (!course) {
    notFound();
  }

  const createLessonForCourse = createLesson.bind(null, course.id);

  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-8 lg:px-8">
      <Link
        href={`/admin/courses/${course.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to course
      </Link>

      <div className="mt-7">
        <div className="mb-3 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />

          <span className="text-sm font-medium text-zinc-500">
            Lesson management
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
          Create lesson
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Add learning content to{" "}
          <span className="font-medium text-zinc-700">
            {course.title}
          </span>
          .
        </p>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h2 className="font-semibold text-zinc-950">
                Lesson details
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Configure the lesson information and publishing status.
              </p>
            </div>
          </div>
        </div>

        <form action={createLessonForCourse} className="p-6">
          <div className="grid gap-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Lesson title
              </label>

              <input
                id="title"
                name="title"
                required
                placeholder="Introduction to Machine Learning"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Slug
              </label>

              <input
                id="slug"
                name="slug"
                placeholder="introduction-to-machine-learning"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />

              <p className="mt-2 text-xs text-zinc-400">
                Leave blank to generate automatically from the lesson title.
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
                placeholder="Describe what learners will learn in this lesson..."
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="draft"
                className="h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3 border-t border-zinc-100 pt-6">
            <Link
              href={`/admin/courses/${course.id}`}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-teal-700 px-5 text-sm font-medium text-white transition hover:bg-teal-800"
            >
              Create lesson
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}