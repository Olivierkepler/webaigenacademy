import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getAdminQuizById } from "@/lib/quizzes";
import { createQuizQuestion } from "../../../actions";
import QuestionForm from "./QuestionForm";

export const dynamic = "force-dynamic";

type NewQuestionPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
    quizId: string;
  }>;
};

export default async function NewQuestionPage({
  params,
}: NewQuestionPageProps) {
  const { id, lessonId, quizId } = await params;

  const quiz = await getAdminQuizById(
    id,
    lessonId,
    quizId
  );

  if (!quiz) {
    notFound();
  }

  const createQuestionAction =
    createQuizQuestion.bind(
      null,
      id,
      lessonId,
      quizId
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
            Add question
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Add a question and configure its answer
            choices for{" "}
            <span className="font-medium text-zinc-700">
              {quiz.title}
            </span>
            .
          </p>
        </div>

        <QuestionForm
          action={createQuestionAction}
          cancelHref={quizHref}
          quizTitle={quiz.title}
          passingScore={quiz.passingScore}
        />
      </div>
    </main>
  );
}