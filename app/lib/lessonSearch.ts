import type { QuizData } from "@/data/lessons";

export type SearchableLesson = {
  course: string;
  slug: string;
  title: string;
  order: number;
  section: string;
  description: string;
  duration: string;
  content: string;
  quiz: QuizData;
};

export function buildSearchText(lesson: SearchableLesson): string {
  const quizText = lesson.quiz.questions.flatMap((question) => [
    question.question,
    ...question.options,
    question.answer,
  ]);

  return [
    lesson.title,
    lesson.description,
    lesson.section,
    lesson.content,
    ...quizText,
  ]
    .join(" ")
    .toLowerCase();
}

export function searchLessons(
  lessons: SearchableLesson[],
  query: string
): SearchableLesson[] {
  const trimmedQuery = query.trim().toLowerCase();

  if (!trimmedQuery) {
    return [];
  }

  return lessons
    .filter((lesson) => buildSearchText(lesson).includes(trimmedQuery))
    .sort((a, b) => a.order - b.order);
}
