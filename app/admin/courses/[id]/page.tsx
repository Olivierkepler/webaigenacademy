import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Pencil,
  Plus,
  Users,
} from "lucide-react";

import { getAdminCourseById } from "@/lib/courses";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

function statusStyles(status: string) {
  switch (status) {
    case "published":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";

    case "archived":
      return "bg-zinc-100 text-zinc-600 ring-zinc-500/20";

    default:
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
  }
}

export default async function AdminCoursePage({ params }: PageProps) {
  const { id } = await params;
  const course = await getAdminCourseById(id);

  if (!course) {
    notFound();
  }

  const completionRate = course.completionRate;

  return (
    <main className="mx-auto w-full max-w-[1500px] px-6 py-8 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-zinc-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to courses
        </Link>
      </div>

      {/* Header */}
      <section className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />

            <span className="text-sm font-medium text-zinc-500">
              Course management
            </span>

            <span
              className={[
                "inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset",
                statusStyles(course.status),
              ].join(" ")}
            >
              {course.status}
            </span>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            {course.title}
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-500">
            {course.description ||
              "Manage lessons, enrollment and course publishing settings."}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
            <span>{course.category || "Uncategorized"}</span>

            <span className="hidden h-1 w-1 rounded-full bg-zinc-300 sm:block" />

            <span>Created {formatDate(course.createdAt)}</span>

            <span className="hidden h-1 w-1 rounded-full bg-zinc-300 sm:block" />

            <span>Updated {formatDate(course.updatedAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            <Pencil className="h-4 w-4" />
            Edit course
          </Link>

          <Link
            href={`/admin/courses/${course.id}/lessons/new`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800"
          >
            <Plus className="h-4 w-4" />
            Add lesson
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-7 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="grid md:grid-cols-2 xl:grid-cols-4">
          <Stat
            label="Lessons"
            value={course.lessonCount}
            description="Lessons in this course"
            icon={<BookOpen className="h-5 w-5" />}
          />

          <Stat
            label="Enrolled learners"
            value={course.enrolledLearners}
            description="Current course enrollments"
            icon={<Users className="h-5 w-5" />}
          />

          <Stat
            label="Completed"
            value={course.completedLearners}
            description="Completed enrollments"
            icon={<CheckCircle2 className="h-5 w-5" />}
          />

          <Stat
            label="Completion rate"
            value={`${completionRate}%`}
            description="Overall course completion"
            icon={<Clock3 className="h-5 w-5" />}
            last
          />
        </div>
      </section>

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* Lessons */}
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-zinc-950">Lessons</h2>

                <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  Live
                </span>
              </div>

              <p className="mt-1 text-sm text-zinc-500">
                Learning content included in this course.
              </p>
            </div>

            <Link
              href={`/admin/courses/${course.id}/lessons/new`}
              className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 hover:text-teal-800"
            >
              <Plus className="h-4 w-4" />
              Add lesson
            </Link>
          </div>

          {course.lessonCount === 0 ? (
            <div className="flex min-h-[340px] flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-400">
                <BookOpen className="h-5 w-5" />
              </div>

              <h3 className="font-semibold text-zinc-900">
                No lessons created yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                Add the first lesson to start building the learning experience
                for this course.
              </p>

              <Link
                href={`/admin/courses/${course.id}/lessons/new`}
                className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 text-sm font-medium text-white transition hover:bg-teal-800"
              >
                <Plus className="h-4 w-4" />
                Create first lesson
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {course.lessons.map((lesson, index) => (
                <div
                  key={lesson.id}
                  className="group flex items-center gap-5 px-6 py-5 transition hover:bg-zinc-50/70"
                >
                  {/* Lesson number */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-semibold text-zinc-500">
                    {String(index + 1).padStart(2, "0")}
                  </div>
          
                  {/* Lesson information */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="truncate text-sm font-semibold text-zinc-900">
                        {lesson.title}
                      </h3>
          
                      <span
                        className={`inline-flex shrink-0 rounded-md px-2 py-1 text-[11px] font-medium ${
                          lesson.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : lesson.status === "archived"
                              ? "bg-zinc-100 text-zinc-500"
                              : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {lesson.status.charAt(0).toUpperCase() +
                          lesson.status.slice(1)}
                      </span>
                    </div>
          
                    <p className="mt-1 line-clamp-1 text-sm text-zinc-500">
                      {lesson.description || "No lesson description provided."}
                    </p>
                  </div>
          
                  {/* Position */}
                  <div className="hidden shrink-0 text-right md:block">
                    <p className="text-xs uppercase tracking-wide text-zinc-400">
                      Position
                    </p>
          
                    <p className="mt-1 text-sm font-medium text-zinc-700">
                      {lesson.position + 1}
                    </p>
                  </div>
          
                  {/* Action */}
                  <Link
                    href={`/admin/courses/${course.id}/lessons/${lesson.id}`}
                    className="shrink-0 text-sm font-medium text-teal-700 transition hover:text-teal-900"
                  >
                    View lesson →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="font-semibold text-zinc-950">Course details</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Current course configuration.
              </p>
            </div>

            <div className="divide-y divide-zinc-100">
              <DetailRow label="Status">
                <span
                  className={[
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                    statusStyles(course.status),
                  ].join(" ")}
                >
                  {course.status}
                </span>
              </DetailRow>

              <DetailRow
                label="Category"
                value={course.category || "Uncategorized"}
              />

              <DetailRow label="Slug" value={course.slug} />

              <DetailRow
                label="Lessons"
                value={String(course.lessonCount)}
              />
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="font-semibold text-zinc-950">
                Learner activity
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Enrollment status for this course.
              </p>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Enrolled</span>
                <span className="text-sm font-semibold text-zinc-900">
                  {course.enrolledLearners}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-500">Completed</span>
                <span className="text-sm font-semibold text-zinc-900">
                  {course.completedLearners}
                </span>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-zinc-500">Completion</span>

                  <span className="text-sm font-semibold text-teal-700">
                    {completionRate}%
                  </span>
                </div>

                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-teal-700"
                    style={{
                      width: `${Math.min(completionRate, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>

      {/* Footer */}
      <footer className="mt-8 flex flex-col gap-2 border-t border-zinc-200 py-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span>Course management</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span className="text-emerald-700">Live</span>
        </div>

        <span>Connected to Academy course and enrollment data.</span>
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
  description,
  icon,
  last = false,
}: {
  label: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={[
        "relative min-h-[138px] p-6",
        !last ? "border-b border-zinc-200 md:border-r xl:border-b-0" : "",
      ].join(" ")}
    >
      <div className="pr-12">
        <p className="text-sm font-medium text-zinc-500">{label}</p>

        <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">
          {value}
        </p>

        <p className="mt-3 text-xs leading-5 text-zinc-400">{description}</p>
      </div>

      <div className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-400">
        {icon}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-xs text-zinc-400">{label}</p>

      <div className="mt-1 break-words text-sm font-medium text-zinc-800">
        {children ?? value}
      </div>
    </div>
  );
}