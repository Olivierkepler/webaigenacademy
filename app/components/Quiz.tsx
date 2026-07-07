"use client";

import { useState } from "react";
import type { QuizData } from "@/data/lessons";
import { cardPadding, typography } from "@/app/lib/typography";

type QuizProps = {
  quiz: QuizData;
};

export default function Quiz({ quiz }: QuizProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );

  return (
    <div
      className={`rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${cardPadding}`}
    >
      <p className={typography.label}>Knowledge Check</p>
      <h2 className={`mt-3 ${typography.cardTitle}`}>{quiz.title}</h2>

      <div className="mt-8 space-y-8">
        {quiz.questions.map((item, index) => {
          const selected = selectedAnswers[index];
          const isCorrect = selected === item.answer;

          return (
            <div
              key={index}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <p className={typography.quizQuestion}>{item.question}</p>

              <div className="mt-5 space-y-3">
                {item.options.map((option) => {
                  const isSelected = selected === option;
                  const isSelectedCorrect = isSelected && option === item.answer;
                  const isSelectedWrong = isSelected && option !== item.answer;

                  let buttonClass = `block w-full rounded-lg border border-zinc-200 bg-white p-4 text-left transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 ${typography.sidebarItem}`;

                  if (isSelectedCorrect) {
                    buttonClass = `block w-full rounded-lg border border-emerald-500 bg-emerald-50 p-4 text-left text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400 ${typography.sidebarItem}`;
                  } else if (isSelectedWrong) {
                    buttonClass = `block w-full rounded-lg border border-red-400 bg-red-50 p-4 text-left text-red-800 dark:border-red-500 dark:bg-red-500/10 dark:text-red-400 ${typography.sidebarItem}`;
                  }

                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() =>
                        setSelectedAnswers((prev) => ({
                          ...prev,
                          [index]: option,
                        }))
                      }
                      className={buttonClass}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {selected && (
                <p
                  className={`mt-5 ${
                    isCorrect
                      ? typography.feedbackCorrect
                      : typography.feedbackWrong
                  }`}
                >
                  {isCorrect ? "Correct!" : "Try again"}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
