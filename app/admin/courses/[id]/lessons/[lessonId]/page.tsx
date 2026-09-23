import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock3,
  FileText,
  Gauge,
  Hash,
  Layers3,
  Pencil,
} from "lucide-react";

import { getAdminLessonById } from "@/lib/courses";
import LessonContent from "@/app/components/LessonContent";

export const dynamic = "force-dynamic";

type LessonPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusClasses(
  status: "draft" | "published" | "archived"
) {
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

export default async function AdminLessonPage({
  params,
}: LessonPageProps) {
  const { id, lessonId } = await params;

  const lesson = await getAdminLessonById(id, lessonId);

  if (!lesson) {
    notFound();
  }

  const hasContent = Boolean(lesson.content?.trim());

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8 lg:px-10">
        {/* Back navigation */}
        <div className="mb-7">
          <Link
            href={`/admin/courses/${lesson.courseId}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to course
          </Link>
        </div>

        {/* Header */}
        <section className="mb-7 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Lesson management
              </div>

              <span
                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses(
                  lesson.status
                )}`}
              >
                {capitalize(lesson.status)}
              </span>
            </div>

            <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-zinc-950">
              {lesson.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-zinc-500">
              {lesson.description ||
                "No description has been added for this lesson yet."}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-zinc-500">
              <span>{lesson.courseTitle || "Academy course"}</span>

              {lesson.section && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span>{lesson.section}</span>
                </>
              )}

              {lesson.difficulty && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span>{capitalize(lesson.difficulty)}</span>
                </>
              )}

              {lesson.duration && (
                <>
                  <span className="text-zinc-300">•</span>
                  <span>{lesson.duration}</span>
                </>
              )}

              <span className="text-zinc-300">•</span>

              <span>Position {lesson.position}</span>

              <span className="text-zinc-300">•</span>

              <span>Updated {formatDate(lesson.updatedAt)}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={`/admin/courses/${lesson.courseId}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
            >
              <BookOpen className="h-4 w-4" />
              View course
            </Link>

            <Link
              href={`/admin/courses/${lesson.courseId}/lessons/${lesson.id}/edit`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
            >
              <Pencil className="h-4 w-4" />
              Edit lesson
            </Link>
          </div>
        </section>

        {/* Summary */}
        <section className="mb-7 overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="grid md:grid-cols-2 xl:grid-cols-4">
            <div className="border-b border-zinc-200 p-6 md:border-r xl:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Lesson position
                  </p>

                  <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
                    {lesson.position}
                  </p>

                  <p className="mt-3 text-sm text-zinc-400">
                    Position inside this course
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <Hash className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 p-6 xl:border-b-0 xl:border-r">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Status
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                    {capitalize(lesson.status)}
                  </p>

                  <p className="mt-3 text-sm text-zinc-400">
                    Current publishing status
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="border-b border-zinc-200 p-6 md:border-r xl:border-b-0">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Created
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    {formatDate(lesson.createdAt)}
                  </p>

                  <p className="mt-3 text-sm text-zinc-400">
                    Lesson creation date
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500">
                    Last updated
                  </p>

                  <p className="mt-2 text-lg font-semibold text-zinc-950">
                    {formatDate(lesson.updatedAt)}
                  </p>

                  <p className="mt-3 text-sm text-zinc-400">
                    Most recent modification
                  </p>
                </div>

                <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2.5 text-zinc-500">
                  <CalendarDays className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main content */}
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          {/* Lesson content */}
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 px-6 py-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-zinc-950">
                    Lesson content
                  </h2>

                  {hasContent ? (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      Configured
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      Empty
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-zinc-500">
                  Preview of the learning material for this lesson.
                </p>
              </div>

              <Link
                href={`/admin/courses/${lesson.courseId}/lessons/${lesson.id}/edit`}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-3.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit content
              </Link>
            </div>

            {hasContent ? (
              <div className="px-7 py-8 lg:px-10 lg:py-10">
                <LessonContent
                  content={lesson.content!}
                  hideTitle
                />
              </div>
            ) : (
              <div className="flex min-h-[340px] items-center justify-center px-6 py-12">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                    <FileText className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-zinc-900">
                    Lesson content is not configured yet
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500">
                    Add Markdown learning material from the lesson editor to
                    preview it here.
                  </p>

                  <Link
                    href={`/admin/courses/${lesson.courseId}/lessons/${lesson.id}/edit`}
                    className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Add content
                  </Link>
                </div>
              </div>
            )}
          </section>

          {/* Right column */}
          <div className="space-y-6">
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-5">
                <h2 className="text-base font-semibold text-zinc-950">
                  Lesson details
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Current lesson configuration.
                </p>
              </div>

              <dl className="divide-y divide-zinc-100">
                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Status
                  </dt>

                  <dd className="mt-1.5">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClasses(
                        lesson.status
                      )}`}
                    >
                      {capitalize(lesson.status)}
                    </span>
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Section
                  </dt>

                  <dd className="mt-1.5 flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <Layers3 className="h-4 w-4 text-zinc-400" />
                    {lesson.section || "Not specified"}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Difficulty
                  </dt>

                  <dd className="mt-1.5 flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <Gauge className="h-4 w-4 text-zinc-400" />
                    {lesson.difficulty
                      ? capitalize(lesson.difficulty)
                      : "Not specified"}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Duration
                  </dt>

                  <dd className="mt-1.5 flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <Clock3 className="h-4 w-4 text-zinc-400" />
                    {lesson.duration || "Not specified"}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Course
                  </dt>

                  <dd className="mt-1.5 text-sm font-medium text-zinc-800">
                    {lesson.courseTitle || "Academy course"}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Lesson slug
                  </dt>

                  <dd className="mt-1.5 break-all text-sm font-medium text-zinc-800">
                    {lesson.slug}
                  </dd>
                </div>

                <div className="px-5 py-4">
                  <dt className="text-xs font-medium text-zinc-400">
                    Position
                  </dt>

                  <dd className="mt-1.5 text-sm font-medium text-zinc-800">
                    {lesson.position}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-5">
                <h2 className="text-base font-semibold text-zinc-950">
                  Course
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Parent course for this lesson.
                </p>
              </div>

              <div className="p-5">
                <p className="text-sm font-semibold text-zinc-900">
                  {lesson.courseTitle || "Academy course"}
                </p>

                {lesson.courseSlug && (
                  <p className="mt-1 text-xs text-zinc-400">
                    {lesson.courseSlug}
                  </p>
                )}

                <Link
                  href={`/admin/courses/${lesson.courseId}`}
                  className="mt-5 inline-flex items-center text-sm font-medium text-teal-700 hover:text-teal-800"
                >
                  View course →
                </Link>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col gap-2 border-t border-zinc-200 pt-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span>Lesson management</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">Live</span>
          </div>

          <span>Connected to Academy course and lesson data.</span>
        </div>
      </div>
    </main>
  );
}