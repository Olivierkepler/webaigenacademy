"use client";

import { useEffect, useState } from "react";
import Notebook from "./Notebook";
import { accent, primaryButtonClass, typography } from "@/app/lib/typography";

type NotebookModalProps = {
  notebook: string;
};

export default function NotebookModal({ notebook }: NotebookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);

  const openLab = () => {
    setSessionKey(String(Date.now()));
    setIsOpen(true);
  };

  const closeLab = () => {
    setIsOpen(false);
    setSessionKey(null);
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLab();
      }
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={openLab}
        className={primaryButtonClass}
      >
        Open Practice Lab
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Practice Lab"
        >
          <button
            type="button"
            className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
            onClick={closeLab}
            aria-label="Close practice lab"
          />

          <div className="relative z-10 flex h-[min(92vh,900px)] w-[min(96vw,1200px)] flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-200 px-0 py-3 dark:border-zinc-800">
              <h3 className={typography.modalTitle}>Practice Lab</h3>
              <button
                type="button"
                onClick={closeLab}
                className={`rounded-lg border border-zinc-300 px-3 py-1.5 transition dark:border-zinc-700 dark:hover:border-[#FF6F00] dark:hover:text-[#FFB74D] ${accent.hoverBorder} ${accent.hoverText} ${typography.button}`}
              >
                Close
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-hidden  [&_iframe]:h-full [&_iframe]:min-h-[82vh]">
              {sessionKey ? (
                <Notebook notebook={notebook} sessionKey={sessionKey} />
              ) : null}
            </div>
       
          </div>
        </div>
      )}
    </>
  );
}
