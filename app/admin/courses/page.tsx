import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Plus,
  TrendingUp,
  Users,
} from "lucide-react";

import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

type CourseRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "draft" | "published" | "archived";
  lesson_count: number | string;
  learner_count: number | string;
  completed_enrollments: number | string;
  completed_lesson_count: number | string;
};

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  status: "draft" | "published" | "archived";
  lessons: number;
  learners: number;
  completedEnrollments: number;
  completion: number;
};

function toNumber(value: number | string | null | undefined) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatStatus(status: Course["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusDot(status: Course["status"]) {
  if (status === "published") {
    return "bg-emerald-500";
  }

  if (status === "archived") {
    return "bg-slate-400";
  }

  return "bg-amber-500";
}

async function getCourses(): Promise<Course[]> {
  const rows = (await sql`
    SELECT
      c.id,
      c.slug,
      c.title,
      c.description,
      c.category,
      c.status,

      (
        SELECT COUNT(*)::int
        FROM lessons l
        WHERE l.course_id = c.id
          AND l.status = 'published'
      ) AS lesson_count,

      (
        SELECT COUNT(DISTINCT e.user_id)::int
        FROM enrollments e
        WHERE e.course_id = c.id
          AND e.status <> 'cancelled'
      ) AS learner_count,

      (
        SELECT COUNT(*)::int
        FROM enrollments e
        WHERE e.course_id = c.id
          AND e.status = 'completed'
      ) AS completed_enrollments,

      (
        SELECT COUNT(*)::int
        FROM lesson_progress lp
        INNER JOIN enrollments e
          ON e.user_id = lp.user_id
         AND e.course_id = c.id
         AND e.status <> 'cancelled'
        INNER JOIN lessons l
          ON l.course_id = c.id
         AND l.slug = lp.lesson_slug
         AND l.status = 'published'
        WHERE lp.course_slug = c.slug
      ) AS completed_lesson_count

    FROM courses c
    ORDER BY c.created_at DESC
  `) as CourseRow[];

  return rows.map((row) => {
    const lessons = toNumber(row.lesson_count);
    const learners = toNumber(row.learner_count);
    const completedEnrollments = toNumber(
      row.completed_enrollments
    );
    const completedLessonCount = toNumber(
      row.completed_lesson_count
    );

    const totalPossibleLessonCompletions =
      lessons * learners;

    const completion =
      totalPossibleLessonCompletions > 0
        ? Math.round(
            (completedLessonCount /
              totalPossibleLessonCompletions) *
              100
          )
        : 0;

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category,
      status: row.status,
      lessons,
      learners,
      completedEnrollments,
      completion,
    };
  });
}

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  const totalCourses = courses.length;

  const publishedCourses = courses.filter(
    (course) => course.status === "published"
  ).length;

  const totalLearners = courses.reduce(
    (total, course) => total + course.learners,
    0
  );

  const totalCompletedEnrollments = courses.reduce(
    (total, course) => total + course.completedEnrollments,
    0
  );

  const averageCompletion =
    courses.length > 0
      ? Math.round(
          courses.reduce(
            (total, course) => total + course.completion,
            0
          ) / courses.length
        )
      : 0;

  const totalLessons = courses.reduce(
    (total, course) => total + course.lessons,
    0
  );

  const stats = [
    {
      label: "Total courses",
      value: totalCourses.toLocaleString(),
      description: "Courses available in the Academy",
      icon: BookOpen,
    },
    {
      label: "Published",
      value: publishedCourses.toLocaleString(),
      description: "Courses currently available to learners",
      icon: CheckCircle2,
    },
    {
      label: "Enrolled learners",
      value: totalLearners.toLocaleString(),
      description: "Learner enrollments across courses",
      icon: Users,
    },
    {
      label: "Avg. completion",
      value: `${averageCompletion}%`,
      description: "Average learner progress across courses",
      icon: TrendingUp,
    },
  ];

  return (
    <main className="min-w-0">
      {/* Page heading */}
      <section className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-[12px] font-medium text-slate-500">
                Course management
              </span>
            </div>

            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-slate-950">
              Courses
            </h1>

            <p className="mt-1 text-[13px] leading-5 text-slate-500">
              Create, organize and manage Academy learning content.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="mr-1 flex items-center gap-2 text-[12px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live Academy data
            </div>

            <Link
              href="/learn"
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 text-[12px] font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              View Academy
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              href="/admin/courses/new"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-teal-700 px-3.5 text-[12px] font-medium text-white shadow-sm transition hover:bg-teal-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Create course
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="relative min-h-[126px] px-5 py-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[12px] font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-[26px] font-semibold tracking-[-0.03em] text-slate-950">
                      {stat.value}
                    </p>
                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                    <Icon className="h-4 w-4 text-slate-500" />
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-slate-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Course catalog */}
      <section className="mb-5 overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-semibold text-slate-950">
                  Course catalog
                </h2>

                <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Live
                </div>
              </div>

              <p className="mt-1 text-[12px] text-slate-500">
                Academy courses, lessons and learner enrollment.
              </p>
            </div>

            <p className="text-[11px] text-slate-400">
              {totalCourses === 1
                ? "1 course"
                : `${totalCourses.toLocaleString()} courses`}
            </p>
          </div>
        </div>

        {courses.length === 0 ? (
          <div className="flex min-h-[270px] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50">
              <BookOpen className="h-5 w-5 text-slate-400" />
            </div>

            <h3 className="mt-4 text-[14px] font-semibold text-slate-900">
              No courses created yet
            </h3>

            <p className="mt-1 max-w-[390px] text-[12px] leading-5 text-slate-500">
              Create your first Academy course. Lessons, enrollments and
              performance information will appear here as learners begin using
              the course.
            </p>

            <Link
              href="/admin/courses/new"
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-teal-700 px-4 text-[12px] font-medium text-white shadow-sm transition hover:bg-teal-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Create first course
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/60">
                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Course
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Lessons
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Learners
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Completion
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {courses.map((course) => (
                  <tr
                    key={course.id}
                    className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60"
                  >
                    <td className="px-5 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
                          <BookOpen className="h-4 w-4 text-slate-500" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-medium text-slate-900">
                            {course.title}
                          </p>

                          <p className="mt-0.5 truncate text-[11px] text-slate-400">
                            {course.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-[12px] font-medium text-slate-700">
                        {course.lessons.toLocaleString()}
                      </span>

                      <span className="ml-1 text-[11px] text-slate-400">
                        {course.lessons === 1 ? "lesson" : "lessons"}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <span className="text-[12px] font-medium text-slate-700">
                        {course.learners.toLocaleString()}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="w-[150px]">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-600">
                            {course.completion}%
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-700"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.max(0, course.completion)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                            course.status
                          )}`}
                        />

                        <span className="text-[12px] text-slate-600">
                          {formatStatus(course.status)}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-5 text-right">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-700 transition hover:text-teal-900"
                      >
                        View course
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Course performance */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold text-slate-950">
                Course performance
              </h2>

              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live
              </div>
            </div>

            <p className="mt-1 text-[12px] text-slate-500">
              Enrollment and completion across Academy courses.
            </p>
          </div>

          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-teal-700 hover:text-teal-900"
          >
            View analytics
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="flex min-h-[190px] flex-col items-center justify-center px-6 py-10 text-center">
            <TrendingUp className="h-5 w-5 text-slate-300" />

            <p className="mt-3 text-[13px] font-medium text-slate-700">
              No course performance yet
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              Performance will appear after courses are created and learners
              enroll.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {courses.map((course) => (
              <div key={course.id} className="px-5 py-5">
                <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-[220px]">
                    <p className="text-[13px] font-semibold text-slate-900">
                      {course.title}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {course.category || "Uncategorized"}
                    </p>
                  </div>

                  <div className="grid flex-1 grid-cols-2 gap-5 sm:grid-cols-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                        Lessons
                      </p>

                      <p className="mt-1.5 text-[17px] font-semibold text-slate-900">
                        {course.lessons.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                        Enrolled
                      </p>

                      <p className="mt-1.5 text-[17px] font-semibold text-slate-900">
                        {course.learners.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                        Completed
                      </p>

                      <p className="mt-1.5 text-[17px] font-semibold text-slate-900">
                        {course.completedEnrollments.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-[0.08em] text-slate-400">
                        Completion
                      </p>

                      <p className="mt-1.5 text-[17px] font-semibold text-slate-900">
                        {course.completion}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Overall completion
                    </span>

                    <span className="text-[11px] font-medium text-teal-700">
                      {course.completion}%
                    </span>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-teal-700"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(0, course.completion)
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <section className="mt-5 flex flex-col gap-2 border-t border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] font-medium text-slate-700">
              Course catalog
            </p>

            <div className="flex items-center gap-1.5 text-[9px] font-medium text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Live
            </div>
          </div>

          <p className="mt-1 text-[10px] text-slate-400">
            {totalCourses.toLocaleString()}{" "}
            {totalCourses === 1 ? "course" : "courses"} ·{" "}
            {totalLessons.toLocaleString()}{" "}
            {totalLessons === 1 ? "lesson" : "lessons"} ·{" "}
            {totalLearners.toLocaleString()} enrolled learners
          </p>
        </div>

        <p className="text-[11px] text-slate-400">
          Connected to Academy course, lesson and enrollment data.
        </p>
      </section>
    </main>
  );
}