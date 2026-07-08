import Link from "next/link";
import { lessons } from "@/data/lessons";
import { accent, typography } from "@/app/lib/typography";
import NavbarSearch from "./NavbarSearch";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

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
        <div className="flex items-center gap-2">
        <Image src="/images/favicon_32_black.png" alt="WebAIGen Academy" width={32} height={32} className="w-8 h-8"    />
         
         <div>    <h3
            className={`mt-1 text-20px] transition font-medium leading-tight `}
          >
            WebAIGenAcademy
          </h3>
          
          <p className={typography.navbarSmall}>WebAiGen</p>
          </div>
        </div>
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
