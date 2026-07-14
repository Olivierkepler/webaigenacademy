import fs from "fs";
import path from "path";
import courseMetadata from "@/courses/machine-learning/metadata.json";
import type { LessonVideo } from "@/app/lib/lessonVideo";

export type { LessonVideo };

type LessonMetadata = {
  id: string;
  slug: string;
  title: string;
  order: number;
  section: string;
  difficulty: string;
  duration: string;
  description: string;
  notebook: string;
  quiz: string;
  visualizations: string[];
  takeaways: string[];
  video?: LessonVideo;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export type QuizData = {
  title: string;
  questions: QuizQuestion[];
};

export type Lesson = {
  course: string;
  courseTitle: string;
  slug: string;
  title: string;
  order: number;
  section: string;
  difficulty: string;
  duration: string;
  description: string;
  notebook: string;
  download: string;
  content: string;
  quiz: QuizData;
  takeaways: string[];
  visualizations: string[];
  video?: LessonVideo;
};

const LEGACY_NOTEBOOK_FILENAMES: Record<string, string> = {
  introduction: "ml-introduction",
};

function lessonDir(lessonId: string): string {
  return path.join(
    process.cwd(),
    "courses",
    "machine-learning",
    "lessons",
    lessonId
  );
}

function readLessonMetadata(lessonId: string): LessonMetadata {
  return JSON.parse(
    fs.readFileSync(path.join(lessonDir(lessonId), "lesson.json"), "utf-8")
  );
}

function readLessonMarkdown(lessonId: string): string {
  return fs.readFileSync(path.join(lessonDir(lessonId), "lesson.md"), "utf-8");
}

function readLessonQuiz(lessonId: string): QuizData {
  return JSON.parse(
    fs.readFileSync(path.join(lessonDir(lessonId), "quiz.json"), "utf-8")
  );
}

function getNotebookPaths(slug: string): { notebook: string; download: string } {
  const filename = LEGACY_NOTEBOOK_FILENAMES[slug] ?? slug;

  return {
    notebook: `lessons/${filename}.ipynb`,
    download: `${filename}.ipynb`,
  };
}

export const lessons: Lesson[] = courseMetadata.lessonOrder.map((lessonId) => {
  const metadata = readLessonMetadata(lessonId);
  const paths = getNotebookPaths(metadata.slug);

  return {
    course: courseMetadata.slug,
    courseTitle: courseMetadata.title,
    slug: metadata.slug,
    title: metadata.title,
    order: metadata.order,
    section: metadata.section,
    difficulty: metadata.difficulty,
    duration: metadata.duration,
    description: metadata.description,
    notebook: paths.notebook,
    download: paths.download,
    content: readLessonMarkdown(lessonId),
    quiz: readLessonQuiz(lessonId),
    takeaways: metadata.takeaways,
    visualizations: metadata.visualizations ?? [],
    video: metadata.video,
  };
});
