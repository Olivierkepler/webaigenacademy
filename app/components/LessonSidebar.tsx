import { lessons } from "@/data/lessons";
import LessonSidebarClient from "./LessonSidebarClient";

type LessonSidebarProps = {
  currentCourse: string;
  currentLesson: string;
};

export default function LessonSidebar({
  currentCourse,
  currentLesson,
}: LessonSidebarProps) {
  const courseLessons = lessons
    .filter((lesson) => lesson.course === currentCourse)
    .sort((a, b) => a.order - b.order);

  const courseTitle = courseLessons[0]?.courseTitle ?? "Course";

  return (
    <LessonSidebarClient
      currentCourse={currentCourse}
      currentLesson={currentLesson}
      courseTitle={courseTitle}
      lessons={courseLessons.map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        section: lesson.section,
        course: lesson.course,
        duration: lesson.duration,
      }))}
    />
  );
}
