import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  FolderOpen,
  Globe2,
  Info,
} from "lucide-react";

import { getAdminCourseById } from "@/lib/courses";
import { updateCourse } from "../../actions";

type EditCoursePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCoursePage({
  params,
}: EditCoursePageProps) {
  const { id } = await params;

  const course = await getAdminCourseById(id);

  if (!course) {
    notFound();
  }

  return (
    <div className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1180px] px-6 py-8 lg:px-8">
        <Link
          href={`/admin/courses/${course.id}`}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to course
        </Link>

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-teal-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Course management
            </div>

            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              Edit course
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage course information and publishing status.
            </p>
          </div>

          <Link
            href={`/admin/courses/${course.id}`}
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            View course
          </Link>
        </div>

        <form action={updateCourse}>
          <input type="hidden" name="courseId" value={course.id} />

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-6">
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
                      <BookOpen className="h-5 w-5 text-teal-700" />
                    </div>

                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        Basic information
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Update the information learners will see for this
                        course.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 p-6">
                  <div>
                    <label
                      htmlFor="title"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Course title
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      defaultValue={course.title}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="slug"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Course slug
                    </label>

                    <div className="relative">
                      <Globe2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="slug"
                        name="slug"
                        type="text"
                        defaultValue={course.slug}
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Used in the learner-facing course URL.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Category
                    </label>

                    <div className="relative">
                      <FolderOpen className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        id="category"
                        name="category"
                        type="text"
                        defaultValue={course.category ?? ""}
                        placeholder="e.g. AI & Machine Learning"
                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-medium text-slate-800"
                    >
                      Description
                    </label>

                    <div className="relative">
                      <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-400" />

                      <textarea
                        id="description"
                        name="description"
                        rows={6}
                        defaultValue={course.description ?? ""}
                        placeholder="Describe what learners will learn in this course..."
                        className="w-full resize-y rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-5">
                  <h2 className="text-base font-semibold text-slate-900">
                    Publishing
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Control whether this course is available to learners.
                  </p>
                </div>

                <div className="p-6">
                  <label
                    htmlFor="status"
                    className="mb-2 block text-sm font-medium text-slate-800"
                  >
                    Course status
                  </label>

                  <select
                    id="status"
                    name="status"
                    defaultValue={course.status}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-slate-400">
                    Draft courses remain hidden from learners. Published
                    courses can appear in the Academy.
                  </p>
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Course
                  </h2>
                </div>

                <div className="p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    {course.title}
                  </p>

                  <p className="mt-1 break-all text-xs text-slate-500">
                    {course.slug}
                  </p>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-500">
                      {course.lessonCount}{" "}
                      {course.lessonCount === 1 ? "lesson" : "lessons"}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
                <div className="flex gap-3">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Publishing
                    </p>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      Publishing the course makes it eligible for the learner
                      Academy. Individual lessons must also be published before
                      learners can access them.
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/15"
                  >
                    Save changes
                  </button>

                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Cancel
                  </Link>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
}