import Link from "next/link";
import { lessons } from "@/data/lessons";
import { typography } from "@/app/lib/typography";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";

const searchableLessons = lessons.map((lesson) => ({
  course: lesson.course,
  slug: lesson.slug,
  title: lesson.title,
  order: lesson.order,
  section: lesson.section,
  description: lesson.description,
  duration: lesson.duration,
  content: lesson.content,
  quiz: lesson.quiz,
}));

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-30 flex h-[var(--navbar-height)] shrink-0 items-center border-b border-zinc-200 bg-white px-6 dark:border-zinc-800 dark:bg-zinc-950 lg:px-10">
      <div className="flex w-full items-center gap-4 lg:gap-8">
        <Link href="/" className="group shrink-0">
          <p className={typography.label}>WebAiGen</p>
          <h1
            className={`mt-1 transition group-hover:text-emerald-700 dark:group-hover:text-emerald-400 ${typography.navbarBrand}`}
          >
            WebAIGenAcademy
          </h1>
        </Link>

        <div className="flex min-w-0 flex-1 justify-center px-2">
          <NavbarSearch lessons={searchableLessons} />
        </div>

        <div className="shrink-0">
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
