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
  quiz?: QuizData;
};

export function buildSearchText(lesson: SearchableLesson): string {
  const quizText = (lesson.quiz?.questions ?? []).flatMap((question) => [
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

  function getScore(lesson: SearchableLesson): number {
    const title = lesson.title.toLowerCase();
    const section = lesson.section.toLowerCase();
    const description = lesson.description.toLowerCase();
    const content = lesson.content.toLowerCase();

    const quizText = (lesson.quiz?.questions ?? [])
      .flatMap((question) => [
        question.question,
        ...question.options,
        question.answer,
      ])
      .join(" ")
      .toLowerCase();

    // Exact lesson title
    if (title === trimmedQuery) {
      return 100;
    }

    // Lesson title begins with the search
    if (title.startsWith(trimmedQuery)) {
      return 90;
    }

    // Search appears anywhere in lesson title
    if (title.includes(trimmedQuery)) {
      return 80;
    }

    // Section match
    if (section.includes(trimmedQuery)) {
      return 60;
    }

    // Description match
    if (description.includes(trimmedQuery)) {
      return 40;
    }

    // Lesson body/content match
    if (content.includes(trimmedQuery)) {
      return 20;
    }

    // Quiz match
    if (quizText.includes(trimmedQuery)) {
      return 10;
    }

    return 0;
  }

  return lessons
    .map((lesson) => ({
      lesson,
      score: getScore(lesson),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return a.lesson.order - b.lesson.order;
    })
    .map(({ lesson }) => lesson);
}
