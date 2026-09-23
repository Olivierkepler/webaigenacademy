"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CircleHelp,
  ListChecks,
  Target,
} from "lucide-react";

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false";

export type QuestionFormInitialValues = {
  question: string;
  questionType: QuestionType;
  explanation: string;
  points: number;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

type QuestionFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  cancelHref: string;
  quizTitle: string;
  passingScore: number;
  mode?: "create" | "edit";
  initialValues?: QuestionFormInitialValues;
};

const DEFAULT_OPTIONS = ["", "", "", ""];

export default function QuestionForm({
  action,
  cancelHref,
  quizTitle,
  passingScore,
  mode = "create",
  initialValues,
}: QuestionFormProps) {
  const initialType =
    initialValues?.questionType ?? "single_choice";

  const initialOptions =
    initialType === "true_false"
      ? ["True", "False"]
      : initialValues?.options.length
        ? initialValues.options.map(
            (option) => option.optionText
          )
        : DEFAULT_OPTIONS;

  const initialCorrectIndexes =
    initialValues?.options
      .map((option, index) =>
        option.isCorrect ? index : -1
      )
      .filter((index) => index >= 0) ?? [];

  const [questionType, setQuestionType] =
    useState<QuestionType>(initialType);

  const [options, setOptions] =
    useState<string[]>(
      initialType === "true_false"
        ? DEFAULT_OPTIONS
        : initialOptions
    );

  const [singleCorrect, setSingleCorrect] =
    useState<number | null>(
      initialType === "single_choice"
        ? initialCorrectIndexes[0] ?? null
        : null
    );

  const [multipleCorrect, setMultipleCorrect] =
    useState<number[]>(
      initialType === "multiple_choice"
        ? initialCorrectIndexes
        : []
    );

  const [trueFalseCorrect, setTrueFalseCorrect] =
    useState<number | null>(
      initialType === "true_false"
        ? initialCorrectIndexes[0] ?? null
        : null
    );

  function handleTypeChange(
    nextType: QuestionType
  ) {
    setQuestionType(nextType);
    setSingleCorrect(null);
    setMultipleCorrect([]);
    setTrueFalseCorrect(null);
  }

  function updateOption(
    index: number,
    value: string
  ) {
    setOptions((current) =>
      current.map((option, optionIndex) =>
        optionIndex === index ? value : option
      )
    );
  }

  function toggleMultipleCorrect(index: number) {
    setMultipleCorrect((current) =>
      current.includes(index)
        ? current.filter((value) => value !== index)
        : [...current, index]
    );
  }

  const visibleOptions =
    questionType === "true_false"
      ? ["True", "False"]
      : options;

  return (
    <form action={action}>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500">
                <CircleHelp className="h-4 w-4" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-zinc-950">
                  Question details
                </h2>

                <p className="mt-0.5 text-sm text-zinc-500">
                  Define the question, answers, and scoring.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-7 p-6">
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Question
              </label>

              <textarea
                id="question"
                name="question"
                rows={4}
                required
                autoFocus
                defaultValue={initialValues?.question ?? ""}
                placeholder="e.g. What is the primary purpose of supervised learning?"
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="questionType"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Question type
                </label>

                <select
                  id="questionType"
                  name="questionType"
                  value={questionType}
                  onChange={(event) =>
                    handleTypeChange(
                      event.target.value as QuestionType
                    )
                  }
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                >
                  <option value="single_choice">
                    Single choice
                  </option>

                  <option value="multiple_choice">
                    Multiple choice
                  </option>

                  <option value="true_false">
                    True / False
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="points"
                  className="mb-2 block text-sm font-medium text-zinc-700"
                >
                  Points
                </label>

                <input
                  id="points"
                  name="points"
                  type="number"
                  min={1}
                  step={1}
                  defaultValue={initialValues?.points ?? 1}
                  required
                  className="h-11 w-full rounded-lg border border-zinc-300 bg-white px-3.5 text-sm text-zinc-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
                />
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-6">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-zinc-900">
                  Answer choices
                </h3>

                <p className="mt-1 text-xs leading-5 text-zinc-400">
                  {questionType === "multiple_choice"
                    ? "Select every answer that should be considered correct."
                    : questionType === "true_false"
                      ? "Choose whether the statement is True or False."
                      : "Select exactly one correct answer."}
                </p>
              </div>

              <div className="space-y-3">
                {visibleOptions.map((option, index) => {
                  const checked =
                    questionType === "multiple_choice"
                      ? multipleCorrect.includes(index)
                      : questionType === "true_false"
                        ? trueFalseCorrect === index
                        : singleCorrect === index;

                  return (
                    <label
                      key={index}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition ${
                        checked
                          ? "border-teal-300 bg-teal-50/60"
                          : "border-zinc-200 bg-white hover:border-zinc-300"
                      }`}
                    >
                      <input
                        type={
                          questionType === "multiple_choice"
                            ? "checkbox"
                            : "radio"
                        }
                        name="correctOption"
                        value={index}
                        checked={checked}
                        onChange={() => {
                          if (
                            questionType === "multiple_choice"
                          ) {
                            toggleMultipleCorrect(index);
                          } else if (
                            questionType === "true_false"
                          ) {
                            setTrueFalseCorrect(index);
                          } else {
                            setSingleCorrect(index);
                          }
                        }}
                        className="h-4 w-4 shrink-0 border-zinc-300 text-teal-700 focus:ring-teal-600"
                      />

                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-semibold ${
                          checked
                            ? "bg-teal-100 text-teal-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>

                      {questionType === "true_false" ? (
                        <>
                          <input
                            type="hidden"
                            name="optionText"
                            value={option}
                          />

                          <span className="text-sm font-medium text-zinc-700">
                            {option}
                          </span>
                        </>
                      ) : (
                        <input
                          name="optionText"
                          type="text"
                          required
                          value={option}
                          onChange={(event) =>
                            updateOption(
                              index,
                              event.target.value
                            )
                          }
                          onClick={(event) =>
                            event.stopPropagation()
                          }
                          placeholder={`Answer option ${index + 1}`}
                          className="h-9 min-w-0 flex-1 border-0 bg-transparent px-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:ring-0"
                        />
                      )}

                      {checked && (
                        <span className="ml-auto text-xs font-medium text-teal-700">
                          Correct
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-zinc-100 pt-6">
              <label
                htmlFor="explanation"
                className="mb-2 block text-sm font-medium text-zinc-700"
              >
                Answer explanation
              </label>

              <textarea
                id="explanation"
                name="explanation"
                rows={4}
                defaultValue={initialValues?.explanation ?? ""}
                placeholder="Explain why the correct answer is correct."
                className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3.5 py-3 text-sm leading-6 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-teal-600 focus:ring-2 focus:ring-teal-600/10"
              />

              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Optional. This can be shown to learners after they
                submit their answer.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-200 bg-zinc-50/60 px-6 py-4 sm:flex-row sm:items-center sm:justify-end">
            <Link
              href={cancelHref}
              className="inline-flex h-10 items-center justify-center rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-teal-700 px-5 text-sm font-medium text-white shadow-sm transition hover:bg-teal-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20"
            >
              <ListChecks className="h-4 w-4" />
              {mode === "edit"
                ? "Save changes"
                : "Save question"}
            </button>
          </div>
        </section>

        <aside className="space-y-5">
          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
              <Target className="h-4 w-4 text-zinc-400" />
              Quiz
            </div>

            <div className="mt-4">
              <p className="text-sm font-medium leading-5 text-zinc-800">
                {quizTitle}
              </p>

              <p className="mt-2 text-xs leading-5 text-zinc-400">
                Passing score: {passingScore}%
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-zinc-200 bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-900">
              Question types
            </h2>

            <div className="mt-4 space-y-4 text-sm leading-5 text-zinc-500">
              <div>
                <p className="font-medium text-zinc-700">
                  Single choice
                </p>
                <p className="mt-1">
                  Exactly one answer can be correct.
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <p className="font-medium text-zinc-700">
                  Multiple choice
                </p>
                <p className="mt-1">
                  One or more answers can be correct.
                </p>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <p className="font-medium text-zinc-700">
                  True / False
                </p>
                <p className="mt-1">
                  Only True and False are displayed.
                </p>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </form>
  );
}