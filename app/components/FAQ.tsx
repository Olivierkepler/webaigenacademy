"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is WebAiGen Academy?",
    answer:
      "WebAiGen Academy is a learning platform for AI, machine learning, coding, and practical technology skills through lessons, quizzes, notebooks, and hands-on projects.",
  },
  {
    question: "Do I need experience before starting?",
    answer:
      "No. The lessons are designed to help beginners build a strong foundation, while also giving more advanced learners practical projects to grow their skills.",
  },
  {
    question: "Are the lessons self-paced?",
    answer:
      "Yes. You can learn at your own pace, revisit lessons, practice with quizzes, and complete labs whenever it works for your schedule.",
  },
  {
    question: "Will there be coding exercises?",
    answer:
      "Yes. WebAiGen Academy includes browser-based lessons, runnable notebooks, guided coding exercises, and projects that help you apply what you learn.",
  },
  {
    question: "Is the roadmap available?",
    answer:
      "The full roadmap is coming soon. It will guide learners from AI foundations to machine learning projects, practical labs, and real-world workflows.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white px-6 py-24 font-[Inter,Helvetica_Neue,Arial,sans-serif] text-zinc-950">
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          {/* <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#0F766E]">
            FAQ
          </p> */}

          <h2 className="mt-4 text-4xl font-black italic tracking-[-0.04em] sm:text-5xl">
            Frequently asked questions
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-zinc-600">
            Everything you need to know before starting your AI learning journey
            with WebAiGen Academy.
          </p>
        </div>

        <div className="mt-12 divide-y divide-zinc-200 rounded-[2rem] border border-zinc-200 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.06)]">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left transition hover:bg-zinc-50 sm:px-8"
                >
                  <span className="text-lg font-semibold tracking-[-0.02em] text-zinc-950">
                    {faq.question}
                  </span>

                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xl font-medium text-zinc-700">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-8">
                    <p className="max-w-3xl text-base leading-7 text-zinc-600">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}