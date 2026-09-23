"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";

import {
  type QuizFormState,
} from "../../actions";

type QuizEditFormProps = {
  action: (
    previousState: QuizFormState,
    formData: FormData
  ) => Promise<QuizFormState>;

  cancelHref: string;

  quiz: {
    title: string;
    description: string | null;
    passingScore: number;
    status: "draft" | "published" | "archived";
  };
};

const initialQuizFormState: QuizFormState = {
  success: false,
  message: null,
  errors: [],
};

export default function QuizEditForm({
  action,
  cancelHref,
  quiz,
}: QuizEditFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    initialQuizFormState
  );

  return (
    <form action={formAction} className="space-y-7">
      {state.message && state.errors.length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="rounded-xl border border-red-200 bg-red-50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-4 w-4 text-red-700" />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-900">
                {state.message}
              </p>

              <p className="mt-1 text-sm leading-5 text-red-700">
                Please resolve the following before
                continuing:
              </p>

              <ul className="mt-3 space-y-2">
                {state.errors.map(
                  (error: string, index: number) => (
                    <li
                      key={`${error}-${index}`}
                      className="flex items-start gap-2 text-sm leading-5 text-red-800"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-red-500"
                      />

                      <span>{error}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {state.success && state.message && (
        <div
          role="status"
          aria-live="polite"
          className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-4 w-4 text-emerald-700" />
            </div>

            <div>
              <p className="text-sm font-semibold text-emerald-900">
                {state.message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          Quiz title
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={quiz.title}
          disabled={pending}
          autoComplete="off"
          placeholder="Enter quiz title"
          className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-medium text-zinc-700"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={quiz.description ?? ""}
          disabled={pending}
          placeholder="Describe what learners will be assessed on."
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
        />

        <p className="mt-2 text-xs leading-5 text-zinc-400">
          Give learners a concise overview of the knowledge
          covered by this assessment.
        </p>
      </div>

      <div className="grid gap-5 border-t border-zinc-100 pt-6 sm:grid-cols-2">
        <div>
          <label
            htmlFor="passingScore"
            className="mb-2 block text-sm font-medium text-zinc-700"
          >
            Passing score
          </label>

          <div className="relative">
            <input
              id="passingScore"
              name="passingScore"
              type="number"
              min={0}
              max={100}
              step={1}
              required
              defaultValue={quiz.passingScore}
              disabled={pending}
              inputMode="numeric"
              className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 pr-10 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
            />

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-zinc-400">
              %
            </span>
          </div>

          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Minimum score required for a learner to pass.
          </p>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium text-zinc-700"
          >
            Availability
          </label>

          <select
            id="status"
            name="status"
            defaultValue={quiz.status}
            disabled={pending}
            className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-500"
          >
            <option value="draft">
              Draft — hidden from learners
            </option>

            <option value="published">
              Published — available to learners
            </option>

            <option value="archived">
              Archived — unavailable to learners
            </option>
          </select>

          <p className="mt-2 text-xs leading-5 text-zinc-400">
            Publishing is allowed only after the assessment
            passes all readiness checks.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />

          <div>
            <p className="text-sm font-medium text-zinc-800">
              Publishing protection enabled
            </p>

            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Before publishing, WebAIgen Academy verifies
              that the quiz contains questions, valid answer
              options, and correctly configured answers.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href={cancelHref}
          aria-disabled={pending}
          tabIndex={pending ? -1 : undefined}
          className={`inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 ${
            pending
              ? "pointer-events-none opacity-50"
              : ""
          }`}
        >
          Cancel
        </Link>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-10 min-w-[145px] items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <>
              <Loader2
                aria-hidden="true"
                className="h-4 w-4 animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <Save
                aria-hidden="true"
                className="h-4 w-4"
              />
              Save changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}