import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import {
  getAdminQuizById,
  getAdminQuizQuestions,
} from "@/lib/quizzes";

import { updateQuizQuestion } from "../../../../actions";

import QuestionForm from "../../new/QuestionForm";

export const dynamic = "force-dynamic";

type EditQuestionPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
    quizId: string;
    questionId: string;
  }>;
};

export default async function EditQuestionPage({
  params,
}: EditQuestionPageProps) {
  const {
    id,
    lessonId,
    quizId,
    questionId,
  } = await params;

  const [quiz, questions] = await Promise.all([
    getAdminQuizById(id, lessonId, quizId),
    getAdminQuizQuestions(id, lessonId, quizId),
  ]);

  if (!quiz) {
    notFound();
  }

  const question = questions.find(
    (item) => item.id === questionId
  );

  if (!question) {
    notFound();
  }

  const updateQuestionAction =
    updateQuizQuestion.bind(
      null,
      id,
      lessonId,
      quizId,
      questionId
    );

  const quizHref =
    `/admin/courses/${id}/lessons/${lessonId}` +
    `/quizzes/${quizId}`;

  return (
    <main className="min-h-full bg-[#f7f9fb]">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-8 lg:px-10">
        <div className="mb-7">
          <Link
            href={quizHref}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to quiz
          </Link>
        </div>

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            Question management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Edit question
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Update this question, its answer choices,
            correct answers, and scoring.
          </p>
        </div>

        <QuestionForm
          action={updateQuestionAction}
          cancelHref={quizHref}
          quizTitle={quiz.title}
          passingScore={quiz.passingScore}
          mode="edit"
          initialValues={{
            question: question.question,
            questionType: question.questionType,
            explanation: question.explanation ?? "",
            points: question.points,
            options: question.options.map((option) => ({
              optionText: option.optionText,
              isCorrect: option.isCorrect,
            })),
          }}
        />
      </div>
    </main>
  );
}