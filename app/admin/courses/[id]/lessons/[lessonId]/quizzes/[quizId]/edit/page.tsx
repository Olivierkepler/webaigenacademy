import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Save,
  Target,
} from "lucide-react";

import { getAdminQuizById } from "@/lib/quizzes";
import { updateQuiz } from "../../actions";
import QuizEditForm from "./QuizEditForm";

export const dynamic = "force-dynamic";

type EditQuizPageProps = {
  params: Promise<{
    id: string;
    lessonId: string;
    quizId: string;
  }>;
};

export default async function EditQuizPage({
  params,
}: EditQuizPageProps) {
  const { id, lessonId, quizId } = await params;

  const quiz = await getAdminQuizById(
    id,
    lessonId,
    quizId
  );

  if (!quiz) {
    notFound();
  }

  const updateQuizAction = updateQuiz.bind(
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
            Assessment management
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
            Edit quiz
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Update the assessment details, passing
            requirement, and availability status.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
            <div className="border-b border-zinc-200 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                  <ClipboardCheck className="h-4 w-4" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-zinc-950">
                    Quiz details
                  </h2>

                  <p className="mt-0.5 text-sm text-zinc-500">
                    Configure assessment details and learner
                    availability.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <QuizEditForm
                action={updateQuizAction}
                cancelHref={quizHref}
                quiz={{
                  title: quiz.title,
                  description: quiz.description,
                  passingScore: quiz.passingScore,
                  status: quiz.status,
                }}
              />
            </div>
          </section>

          <aside className="space-y-5">
            {/* KEEP YOUR EXISTING RIGHT-SIDE ASSESSMENT,
                PUBLISHING AND VALIDATION CARDS HERE */}
          </aside>
        </div>
      </div>
    </main>
  );
}