import Link from "next/link";
import { auth, signIn } from "@/auth";
import { sql } from "@/lib/db";
import { lessons } from "@/data/lessons";

export const dynamic = "force-dynamic";

async function googleSignIn() {
  "use server";
  await signIn("google", { redirectTo: "/dashboard" });
}

type ProgressRow = {
  course_slug: string;
  lesson_slug: string;
  completed_at: string | Date;
};

type CourseSummary = {
  slug: string;
  title: string;
  total: number;
  completed: number;
  percent: number;
  continueHref: string;
  ctaLabel: "Start course" | "Continue" | "Review course";
};

function firstName(name: string | null | undefined): string {
  if (!name?.trim()) {
    return "there";
  }

  return name.trim().split(/\s+/)[0] ?? "there";
}

function formatActivityDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  }

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

function buildCourseSummaries(
  completedByCourse: Map<string, Set<string>>
): CourseSummary[] {
  const byCourse = new Map<
    string,
    { title: string; lessons: typeof lessons }
  >();

  for (const lesson of lessons) {
    const existing = byCourse.get(lesson.course);
    if (existing) {
      existing.lessons.push(lesson);
    } else {
      byCourse.set(lesson.course, {
        title: lesson.courseTitle,
        lessons: [lesson],
      });
    }
  }

  const summaries: CourseSummary[] = [];

  for (const [slug, { title, lessons: courseLessons }] of byCourse) {
    const ordered = [...courseLessons].sort((a, b) => a.order - b.order);
    const completedSet = completedByCourse.get(slug) ?? new Set<string>();
    const completed = ordered.filter((lesson) =>
      completedSet.has(lesson.slug)
    ).length;
    const total = ordered.length;
    const percent =
      total === 0 ? 0 : Math.round((completed / total) * 100);

    const firstIncomplete = ordered.find(
      (lesson) => !completedSet.has(lesson.slug)
    );

    let continueHref: string;
    let ctaLabel: CourseSummary["ctaLabel"];

    if (completed === 0) {
      continueHref = `/learn/${slug}`;
      ctaLabel = "Start course";
    } else if (firstIncomplete) {
      continueHref = `/learn/${slug}/${firstIncomplete.slug}`;
      ctaLabel = "Continue";
    } else {
      continueHref = `/learn/${slug}`;
      ctaLabel = "Review course";
    }

    summaries.push({
      slug,
      title,
      total,
      completed,
      percent,
      continueHref,
      ctaLabel,
    });
  }

  return summaries;
}

export default async function DashboardPage() {
  let session = null;

  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-[calc(100vh-var(--navbar-height))] items-center justify-center bg-zinc-50 px-6 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
            Your learning dashboard
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Sign in to track your progress across devices
          </p>
          <form action={googleSignIn} className="mt-8">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-xl bg-[#0E5C58] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#003334] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58]"
            >
              Sign in with Google
            </button>
          </form>
        </div>
      </main>
    );
  }

  let rows: ProgressRow[] = [];
  let progressError = false;

  try {
    const result = await sql`
      SELECT course_slug, lesson_slug, completed_at
      FROM lesson_progress
      WHERE user_id = ${session.user.id}
      ORDER BY completed_at DESC
    `;

    rows = (result as ProgressRow[]).filter(
      (row) =>
        typeof row.course_slug === "string" &&
        typeof row.lesson_slug === "string"
    );
  } catch (error) {
    console.error("[dashboard] Failed to load progress:", error);
    progressError = true;
  }

  const lessonByKey = new Map(
    lessons.map((lesson) => [`${lesson.course}:${lesson.slug}`, lesson] as const)
  );

  const completedByCourse = new Map<string, Set<string>>();

  for (const row of rows) {
    if (!lessonByKey.has(`${row.course_slug}:${row.lesson_slug}`)) {
      continue;
    }

    const set = completedByCourse.get(row.course_slug) ?? new Set<string>();
    set.add(row.lesson_slug);
    completedByCourse.set(row.course_slug, set);
  }

  const courseSummaries = buildCourseSummaries(completedByCourse);

  const recentActivity = rows
    .map((row) => {
      const lesson = lessonByKey.get(`${row.course_slug}:${row.lesson_slug}`);
      if (!lesson) {
        return null;
      }

      return {
        key: `${row.course_slug}:${row.lesson_slug}:${String(row.completed_at)}`,
        title: lesson.title,
        href: `/learn/${lesson.course}/${lesson.slug}`,
        when: formatActivityDate(row.completed_at),
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .slice(0, 5);

  const { name, image } = session.user;

  return (
    <main className="min-h-[calc(100vh-var(--navbar-height))] bg-zinc-50 px-6 py-12 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 lg:px-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <header className="flex items-center gap-4">
          {image ? (
            <img
              src={image}
              alt=""
              width={56}
              height={56}
              referrerPolicy="no-referrer"
              className="h-14 w-14 rounded-full object-cover ring-2 ring-zinc-200 dark:ring-zinc-800"
            />
          ) : (
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0E5C58]/10 text-lg font-semibold text-[#0E5C58] dark:bg-[#0E5C58]/20 dark:text-[#85D7CE]">
              {firstName(name).charAt(0).toUpperCase()}
            </span>
          )}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Welcome back, {firstName(name)}
            </h1>
          </div>
        </header>

        {progressError ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
            Couldn&apos;t load progress right now. Your courses are still
            available — try refreshing in a moment.
          </p>
        ) : null}

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
            Your courses
          </h2>

          <div className="grid gap-4">
            {courseSummaries.map((course) => (
              <article
                key={course.slug}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-zinc-950 dark:text-white">
                      {course.title}
                    </h3>
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {course.completed} of {course.total} lessons
                    </p>

                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                      <div
                        className="h-full rounded-full bg-[#0E5C58] transition-[width] duration-300 dark:bg-[#85D7CE]"
                        style={{ width: `${course.percent}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs font-medium text-[#0E5C58] dark:text-[#85D7CE]">
                      {course.percent}% complete
                    </p>
                  </div>

                  <Link
                    href={course.continueHref}
                    className={`shrink-0 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] ${
                      course.ctaLabel === "Review course"
                        ? "border border-zinc-300 text-zinc-700 hover:border-[#0E5C58] hover:text-[#0E5C58] dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-[#85D7CE] dark:hover:text-[#85D7CE]"
                        : "bg-[#0E5C58] text-white hover:bg-[#003334]"
                    }`}
                  >
                    {course.ctaLabel}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {recentActivity.length > 0 ? (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-white">
              Recent activity
            </h2>

            <ul className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              {recentActivity.map((item) => (
                <li
                  key={item.key}
                  className="border-b border-zinc-100 last:border-0 dark:border-zinc-800"
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
                  >
                    <span className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </span>
                    {item.when ? (
                      <span className="shrink-0 text-xs text-zinc-500 dark:text-zinc-400">
                        {item.when}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </main>
  );
}
