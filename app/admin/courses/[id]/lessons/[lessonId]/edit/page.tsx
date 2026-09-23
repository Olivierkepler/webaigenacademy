import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  FileText,
  Save,
} from "lucide-react";

import { getAdminLessonById } from "@/lib/courses";
import { updateLesson } from "../../actions";

export const dynamic = "force-dynamic";

type EditLessonPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
  }>;
};

const inputClass =
  "h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10";

const labelClass =
  "mb-2 block text-sm font-medium text-zinc-800";

export default async function EditLessonPage({
  params,
}: EditLessonPageProps) {
  const { id: courseId, lessonId } = await params;

  const lesson = await getAdminLessonById(courseId, lessonId);

  if (!lesson) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-8 lg:px-8">
      <Link
        href={`/admin/courses/${courseId}/lessons/${lessonId}`}
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to lesson
      </Link>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-teal-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Lesson management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Edit lesson
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
            Manage lesson information, learning details and course content.
          </p>
        </div>

        <Link
          href={`/admin/courses/${courseId}/lessons/${lessonId}`}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
        >
          <BookOpen className="h-4 w-4" />
          View lesson
        </Link>
      </div>

      <form action={updateLesson}>
        <input type="hidden" name="courseId" value={courseId} />
        <input type="hidden" name="lessonId" value={lessonId} />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Basic information */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-6 py-5">
                <h2 className="text-base font-semibold text-zinc-950">
                  Lesson information
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Basic information learners will see for this lesson.
                </p>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label htmlFor="title" className={labelClass}>
                      Lesson title
                    </label>

                    <input
                      id="title"
                      name="title"
                      type="text"
                      required
                      defaultValue={lesson.title}
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="slug" className={labelClass}>
                      Lesson slug
                    </label>

                    <input
                      id="slug"
                      name="slug"
                      type="text"
                      required
                      defaultValue={lesson.slug}
                      className={`${inputClass} font-mono`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className={labelClass}>
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={lesson.description ?? ""}
                    placeholder="Describe what learners will learn in this lesson."
                    className="w-full resize-y rounded-lg border border-zinc-200 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                  />
                </div>
              </div>
            </section>

            {/* Learning details */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-6 py-5">
                <h2 className="text-base font-semibold text-zinc-950">
                  Learning details
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Organize the lesson and provide useful context for learners.
                </p>
              </div>

              <div className="grid gap-5 p-6 md:grid-cols-3">
                <div>
                  <label htmlFor="section" className={labelClass}>
                    Section
                  </label>

                  <input
                    id="section"
                    name="section"
                    type="text"
                    defaultValue={lesson.section ?? ""}
                    placeholder="Getting started"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="difficulty" className={labelClass}>
                    Difficulty
                  </label>

                  <select
                    id="difficulty"
                    name="difficulty"
                    defaultValue={lesson.difficulty ?? ""}
                    className={inputClass}
                  >
                    <option value="">Not specified</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="duration" className={labelClass}>
                    Duration
                  </label>

                  <div className="relative">
                    <Clock3 className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />

                    <input
                      id="duration"
                      name="duration"
                      type="text"
                      defaultValue={lesson.duration ?? ""}
                      placeholder="15 min"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Lesson content */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-start gap-3 border-b border-zinc-200 px-6 py-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50">
                  <FileText className="h-4 w-4 text-zinc-600" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-zinc-950">
                    Lesson content
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500">
                    Write the main learning material using Markdown.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <label htmlFor="content" className={labelClass}>
                  Markdown content
                </label>

                <textarea
                  id="content"
                  name="content"
                  rows={22}
                  spellCheck={false}
                  defaultValue={lesson.content ?? ""}
                  placeholder={`# Introduction

Explain the topic here.

## Key concept

Use Markdown to structure the lesson.

### Example

\`\`\`python
print("Hello, WebAIGen Academy")
\`\`\`
`}
                  className="min-h-[480px] w-full resize-y rounded-lg border border-zinc-200 bg-zinc-950 px-5 py-4 font-mono text-sm leading-7 text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-zinc-500">
                    Supports headings, lists, links, code blocks, tables and
                    mathematical notation.
                  </p>

                  <span className="rounded-md bg-zinc-100 px-2 py-1 font-mono text-[11px] text-zinc-500">
                    Markdown
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Settings */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-base font-semibold text-zinc-950">
                  Lesson settings
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Publishing and ordering.
                </p>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <label htmlFor="status" className={labelClass}>
                    Status
                  </label>

                  <select
                    id="status"
                    name="status"
                    defaultValue={lesson.status}
                    className={inputClass}
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Keep unfinished lessons as drafts.
                  </p>
                </div>

                <div>
                  <label htmlFor="position" className={labelClass}>
                    Position
                  </label>

                  <input
                    id="position"
                    name="position"
                    type="number"
                    min={0}
                    step={1}
                    required
                    defaultValue={lesson.position}
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs leading-5 text-zinc-500">
                    Controls where the lesson appears inside the course.
                  </p>
                </div>
              </div>
            </section>

            {/* Course */}
            <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-sm font-semibold text-zinc-950">
                  Course
                </h2>
              </div>

              <div className="p-5">
                <p className="text-sm font-medium text-zinc-900">
                  {lesson.courseTitle ?? "Course"}
                </p>

                {lesson.courseSlug && (
                  <p className="mt-1 break-all text-xs text-zinc-500">
                    {lesson.courseSlug}
                  </p>
                )}

                <Link
                  href={`/admin/courses/${courseId}`}
                  className="mt-4 inline-flex text-sm font-medium text-teal-700 transition hover:text-teal-800"
                >
                  View course →
                </Link>
              </div>
            </section>

            {/* Content guidance */}
            <section className="rounded-xl border border-zinc-200 bg-zinc-50 p-5">
              <h3 className="text-sm font-semibold text-zinc-900">
                Writing guidance
              </h3>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                Structure lessons with clear headings, short explanations,
                examples and practice-oriented material.
              </p>

              <div className="mt-4 border-t border-zinc-200 pt-4">
                <p className="font-mono text-xs leading-6 text-zinc-600">
                  # Heading
                  <br />
                  ## Section
                  <br />
                  **Bold**
                  <br />
                  `inline code`
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-200 pt-6">
          <Link
            href={`/admin/courses/${courseId}/lessons/${lessonId}`}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
          >
            <Save className="h-4 w-4" />
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}