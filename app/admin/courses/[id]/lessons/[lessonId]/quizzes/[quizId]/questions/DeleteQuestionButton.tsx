"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import { useState } from "react";

type DeleteQuestionButtonProps = {
  action: (formData: FormData) => void | Promise<void>;
};

export default function DeleteQuestionButton({
  action,
}: DeleteQuestionButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Delete
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 px-4 backdrop-blur-[2px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setConfirming(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-question-title"
            className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl"
          >
            <div className="flex items-start gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2
                      id="delete-question-title"
                      className="text-base font-semibold text-zinc-950"
                    >
                      Delete question?
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-zinc-500">
                      This question and its answer choices will be
                      permanently removed from the quiz.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setConfirming(false)}
                    aria-label="Close"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-200 bg-zinc-50/70 px-6 py-4">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Cancel
              </button>

              <form action={action}>
                <input
                  type="hidden"
                  name="confirmDelete"
                  value="DELETE_QUESTION"
                />

                <button
                  type="submit"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/20"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete question
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}