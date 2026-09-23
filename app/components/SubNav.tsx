import SubNavClient, { type SubNavItem } from "./SubNavClient";

type SubNavProps = {
  course: string;
  firstLessonSlug?: string | null;
};

export default function SubNav({
  course,
  firstLessonSlug,
}: SubNavProps) {
  if (!firstLessonSlug) {
    return null;
  }

  const firstLessonPath = `/learn/${course}/${firstLessonSlug}`;

  const items: SubNavItem[] = [
    {
      label: "Course",
      href: firstLessonPath,
      activePrefix: `/learn/${course}/`,
    },
    {
      label: "Syllabus",
      href: `/learn/${course}#syllabus`,
    },
  ];

  return (
    <SubNavClient
      items={items}
      ariaLabel="Course sections"
    />
  );
}