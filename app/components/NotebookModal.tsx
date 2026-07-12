"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Notebook from "./Notebook";
import { accent, cardPadding, primaryButtonClass, typography } from "@/app/lib/typography";

type NotebookModalProps = {
  notebook: string;
  lessonTitle: string;
};

const loadingMessages = [
  "Loading Practice Lab...",
  "Preparing Python environment...",
  "Opening notebook...",
] as const;

export default function NotebookModal({
  notebook,
  lessonTitle,
}: NotebookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  const modalTitle = `${lessonTitle} Practice Lab`;

  const openLab = () => {
    setSessionKey(String(Date.now()));
    setIsLoading(true);
    setIsOpen(true);
  };

  const closeLab = () => {
    setIsOpen(false);
    setSessionKey(null);
    setIsLoading(true);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    closeButtonRef.current?.focus();

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLab();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[9999] flex h-[100vh] w-[100vw] items-center justify-center">
      <div
        className="absolute inset-0 h-full w-full bg-black/60 backdrop-blur-sm"
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex h-[min(95vh,1000px)] w-[min(96vw,1700px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <div className="min-w-0">
            <h2 id={titleId} className={typography.modalTitle}>
              {modalTitle}
            </h2>
            <p className={`mt-0.5 ${typography.caption}`}>
              Interactive Practice Lab
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLab}
            className={`shrink-0 rounded-lg border border-zinc-300 px-3 py-1.5 transition dark:border-zinc-700 dark:hover:border-[#FF6F00] dark:hover:text-[#FFB74D] ${accent.hoverBorder} ${accent.hoverText} ${typography.button}`}
          >
            ✕ Close
          </button>
        </header>

        <div className="relative min-h-0 flex-1 p-0">
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-zinc-900"
              aria-live="polite"
              aria-busy="true"
            >
              {loadingMessages.map((message, index) => (
                <p
                  key={message}
                  className={
                    index === 0
                      ? typography.body
                      : `${typography.caption} text-zinc-400 dark:text-zinc-500`
                  }
                >
                  {message}
                </p>
              ))}
            </div>
          )}

          {sessionKey ? (
            <Notebook
              notebook={notebook}
              sessionKey={sessionKey}
              onLoad={() => setIsLoading(false)}
            />
          ) : null}
        </div>
      </div>
    </div>
  ) : null;

  return (
    <div className={cardPadding}>
      <button
        type="button"
        onClick={openLab}
        className={primaryButtonClass}
      >
        Open Practice Lab
      </button>

      {typeof document !== "undefined" && modal
        ? createPortal(modal, document.body)
        : null}
    </div>
  );
}
