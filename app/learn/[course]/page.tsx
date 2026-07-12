import Link from "next/link";
import { notFound } from "next/navigation";
import { lessons } from "@/data/lessons";
import { typography } from "@/app/lib/typography";
import { CourseCurriculum } from "@/app/components/CourseOverviewClient";
import Image from "next/image";
import Footer from "@/app/components/footer";
import SubNavClient from "@/app/components/SubNavClient";
import SubNav from "@/app/components/SubNav";

const COURSE_DESCRIPTION =
  "Learn machine learning step by step with interactive lessons, browser-based notebooks, and quizzes.";

const included = [
  {
    title: "Interactive Practice Labs",
    description:
      "Run Python notebooks in your browser with JupyterLite—no local setup required.",
  },
  {
    title: "Quick Quizzes",
    description:
      "Check your understanding with short quizzes after each lesson.",
  },
  {
    title: "Downloadable Notebooks",
    description:
      "Download starter notebooks from each lesson to practice offline.",
  },
] as const;

type PageProps = {
  params: Promise<{
    course: string;
  }>;
};

function CheckIcon() {
  return (
    <span
      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#EEF7F6] text-[#0E5C58] dark:bg-[#0E5C58]/20 dark:text-[#85D7CE]"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="h-4 w-4"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export default async function CoursePage({ params }: PageProps) {
  const { course } = await params;
  const courseLessons = lessons
    .filter((lesson) => lesson.course === course)
    .sort((a, b) => a.order - b.order);

  if (courseLessons.length === 0) {
    notFound();
  }

  const courseTitle = courseLessons[0].courseTitle;
  const difficulty = courseLessons[0].difficulty;
  const firstLessonPath = `/learn/${course}/${courseLessons[0].slug}`;

  // edX-style "at a glance" facts
  const atAGlance = [
    { label: "Lessons", value: `${courseLessons.length}` },
    { label: "Level", value: difficulty ?? "Introductory" },
    { label: "Pace", value: "Self-paced" },
    { label: "Format", value: "100% in browser" },
    { label: "Price", value: "Free" },
  ] as const;

  // "What you'll learn" bullets derived from the curriculum
  const learningOutcomes = courseLessons.map(
    (lesson) => lesson.description ?? lesson.title
  );

  return (
    <main className="min-h-screen font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
    
    
      {/* ── Hero band (full-bleed, edX-style) ─────────────────────── */}
      <header className="relative overflow-hidden  text-zinc-100 dark:border-b dark:border-zinc-800">
        <Image
          src="/images/Designer(24).png"
          alt=""
          fill
          priority
          className="object-cover object-center -z-20"
          sizes="100vw"
        />

  

        <div className="relative z-10 mx-auto max-w-5xl px-6 pb-24 pt-10 lg:px-10">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
              <li>
                <Link href="/" className="transition-colors hover:text-zinc-100">
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-zinc-600">
                /
              </li>
              <li>
                <Link
                  href="/learn"
                  className="transition-colors hover:text-zinc-100"
                >
                  Courses
                </Link>
              </li>
              <li aria-hidden="true" className="text-zinc-600">
                /
              </li>
              <li aria-current="page" className="text-zinc-200">
                {courseTitle}
              </li>
            </ol>
          </nav>

          <div className="mt-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">
              Course · WebAIGen Academy
            </p>
            <h1 className="mt-4 text-4xl font-black italic leading-[0.95] tracking-tight sm:text-5xl">
              {courseTitle}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-zinc-300">
              {COURSE_DESCRIPTION}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={firstLessonPath}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-950 transition-colors hover:bg-zinc-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Start learning — it&apos;s free
              </Link>
              <Link
                href="#syllabus"
                className="rounded-lg border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                View syllabus
              </Link>
            </div>
          </div>
        </div>
      </header>

      
      <div className="mx-auto max-w-7xl py-16 ">
      <div className=" my-8">
        <SubNav course={course} />
      </div>
  <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_380px]">

    {/* ===================================================== */}
    {/* LEFT COLUMN */}
    {/* ===================================================== */}

    <div className="space-y-16">

      {/* What you'll learn */}
      {/* <section className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-gradient-to-br from-white to-[#F5FAF9] p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:from-zinc-900 dark:to-zinc-900 lg:p-10">
        
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0E5C58] via-[#0E5C58]/60 to-transparent dark:from-[#85D7CE] dark:via-[#85D7CE]/40"
        />

        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
          Learning outcomes
        </p>

        <h2 className={`mt-3 ${typography.sectionTitle}`}>
          What you&apos;ll learn
        </h2>

        <ul className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {learningOutcomes.map((outcome) => (
            <li key={outcome} className="flex gap-3">
              <CheckIcon />
              <span className={typography.body}>{outcome}</span>
            </li>
          ))}
        </ul>
      </section> */}

      {/* Curriculum */}
      <section id="syllabus" className="scroll-mt-28">
        {/* <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0E5C58] dark:text-[#85D7CE]">
          Course curriculum
        </p>

        <h2 className={`mt-3 ${typography.sectionTitle}`}>
          Start building your machine learning skills
        </h2> */}

        {/* Short green rule anchoring the heading */}
        {/* <span
          aria-hidden="true"
          className="mt-4 block h-1 w-12 rounded-full bg-[#0E5C58] dark:bg-[#85D7CE]"
        /> */}

        <div className="">
          <CourseCurriculum
            course={course}
            lessons={courseLessons.map((lesson) => ({
              slug: lesson.slug,
              title: lesson.title,
              order: lesson.order,
              section: lesson.section,
              description: lesson.description,
              duration: lesson.duration,
              difficulty: lesson.difficulty,
            }))}
          />
        </div>
      </section>

    </div>

    {/* ===================================================== */}
    {/* RIGHT COLUMN */}
    {/* ===================================================== */}

    <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">

      {/* At a glance */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        <h3 className="text-lg font-bold">
          At a glance
        </h3>

        <dl className="mt-6 space-y-5">
          {atAGlance.map((fact) => (
            <div
              key={fact.label}
              className="flex items-center justify-between border-b border-zinc-100 pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
            >
              <dt className="text-sm text-zinc-500">
                {fact.label}
              </dt>

              <dd className="font-semibold">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Included */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

        <h3 className="text-lg font-bold">
          This course includes
        </h3>

        <div className="mt-6 space-y-5">
          {included.map((feature) => (
            <div key={feature.title}>
              <h4 className="font-semibold">
                {feature.title}
              </h4>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="overflow-hidden rounded-2xl bg-[#003334] p-8 text-white">

        <h3 className="text-2xl font-bold">
          Ready to start?
        </h3>

        <p className="mt-3 text-zinc-400">
          Learn at your own pace with interactive lessons,
          quizzes, and hands-on practice.
        </p>

        <Link
          href={firstLessonPath}
          className="mt-8 flex justify-center rounded-xl bg-white px-6 py-3 font-semibold text-zinc-950 transition hover:bg-zinc-200"
        >
          Start Learning Free
        </Link>
      </section>

    </aside>

  </div>
</div>
<Footer />
    </main>
  );
}