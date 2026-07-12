import { lessons } from "@/data/lessons";
import SubNavClient, { type SubNavItem } from "./SubNavClient";

type SubNavProps = {
  course: string;
};

/**
 * edX-style tab bar: page-level sections of a course,
 * not individual lessons (the sidebar handles those).
 * Add tabs here as the corresponding routes come to life.
 */
export default function SubNav({ course }: SubNavProps) {
  const courseLessons = lessons
    .filter((lesson) => lesson.course === course)
    .sort((a, b) => a.order - b.order);

  if (courseLessons.length === 0) return null;

  const firstLessonPath = `/learn/${course}/${courseLessons[0].slug}`;

  const items: SubNavItem[] = [
    // Active on every lesson page within this course
    {
      label: "Course",
      href: firstLessonPath,
      activePrefix: `/learn/${course}/`,
    },
    { label: "Syllabus", href: `/learn/${course}#syllabus` },
    // Future tabs — uncomment as the routes exist
    // (give each its own activePrefix if it has sub-routes):
    // { label: "Progress", href: `/learn/${course}/progress` },
    // { label: "Notes", href: `/learn/${course}/notes` },
    // { label: "Discussion", href: `/learn/${course}/discussion` },
    // { label: "FAQ", href: `/learn/${course}/faq` },
  ];

  return <SubNavClient items={items} ariaLabel="Course sections" />;
}