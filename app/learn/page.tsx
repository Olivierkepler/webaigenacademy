import Link from "next/link";
import { auth } from "@/auth";
import { sql } from "@/lib/db";
import { resolveSessionUserId } from "@/lib/sessionUser";
import { getPublishedLearningCourses } from "@/lib/learning";

type ProgressRow = {
    course_slug: string;
    lesson_slug: string;
};

function formatDifficulty(value: string | null | undefined) {
  if (!value) {
    return "Self-paced";
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default async function LearnPage() {
    const courses = await getPublishedLearningCourses();
  
    const session = await auth();
    const userId = await resolveSessionUserId(session);
  
    let progressRows: ProgressRow[] = [];
  
    if (userId) {
      progressRows = (await sql`
        SELECT
          course_slug,
          lesson_slug
        FROM lesson_progress
        WHERE user_id = ${userId}
      `) as ProgressRow[];
    }
  
    const completedLessons = new Set(
      progressRows.map(
        (row) => `${row.course_slug}:${row.lesson_slug}`
      )
    );

  return (
    <main className="min-h-screen bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-14 lg:px-8 lg:py-20">
        {/* Hero */}
        <header className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-400">
            WebAIgen Academy
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            Learn AI and machine learning
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            Build practical skills through structured lessons,
            interactive learning and hands-on practice.
          </p>
        </header>

        {/* Course catalog */}
        <section className="mt-16">
          <div className="flex items-end justify-between gap-6 border-b border-zinc-200 pb-5 dark:border-zinc-800">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Courses
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Explore the Academy
              </h2>
            </div>

            <p className="text-sm text-zinc-500">
              {courses.length}{" "}
              {courses.length === 1 ? "course" : "courses"}
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="py-20 text-center">
              <h3 className="text-lg font-semibold">
                No courses available yet
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Published Academy courses will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {courses.map((course) => {
                const firstLesson = course.lessons[0];

                const difficulty = formatDifficulty(
                  firstLesson?.difficulty
                );
                const completedCount = course.lessons.filter((lesson) =>
                    completedLessons.has(`${course.slug}:${lesson.slug}`)
                  ).length;
                  
                  const totalLessons = course.lessons.length;
                  
                  const progressPercent =
                    totalLessons > 0
                      ? Math.round((completedCount / totalLessons) * 100)
                      : 0;
                  
                  const isCompleted =
                    totalLessons > 0 && completedCount === totalLessons;

                  const nextLesson = course.lessons.find(
                    (lesson) =>
                        !completedLessons.has(`${course.slug}:${lesson.slug}`)
                    );
                    
                  const courseHref =
                    completedCount > 0 && !isCompleted && nextLesson
                        ? `/learn/${course.slug}/${nextLesson.slug}`
                        : `/learn/${course.slug}`;
                return (
                  <article
                    key={course.id}
                    className="group flex min-h-[300px] flex-col rounded-2xl border border-zinc-200 bg-white p-7 transition duration-200 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-5">
                      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-teal-400">
                        {course.category || "Academy course"}
                      </span>

                      <span className="shrink-0 text-sm text-zinc-500">
                        {course.lessons.length}{" "}
                        {course.lessons.length === 1
                          ? "lesson"
                          : "lessons"}
                      </span>
                    </div>

                    <h3 className="mt-6 text-2xl font-semibold tracking-tight">
                      {course.title}
                    </h3>

                    {course.description ? (
                      <p className="mt-3 line-clamp-3 leading-7 text-zinc-600 dark:text-zinc-300">
                        {course.description}
                      </p>
                    ) : null}

<div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
  <span>{difficulty}</span>

  <span aria-hidden="true">•</span>

  <span>Self-paced</span>

  <span aria-hidden="true">•</span>

  <span>Free</span>
</div>

{userId && totalLessons > 0 ? (
  <div className="mt-7">
    <div className="mb-2 flex items-center justify-between gap-4">
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {completedCount} of {totalLessons} lessons completed
      </p>

      <span className="text-sm font-semibold text-teal-700 dark:text-teal-400">
        {progressPercent}%
      </span>
    </div>

    <div
      className="h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
      aria-label={`${progressPercent}% course progress`}
    >
      <div
        className="h-full rounded-full bg-teal-700 transition-all duration-300 dark:bg-teal-400"
        style={{
          width: `${Math.min(progressPercent, 100)}%`,
        }}
      />
    </div>
    </div>
    ) : null}

    <div className="mt-auto pt-8">
    <Link
        href={courseHref}
        className="inline-flex items-center justify-center rounded-lg bg-[#003334] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0B5F59] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003334]"
    >
        {!userId
        ? "View course"
        : isCompleted
            ? "Review course"
            : completedCount > 0
            ? "Continue learning"
            : "Start learning"}
    </Link>
    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}