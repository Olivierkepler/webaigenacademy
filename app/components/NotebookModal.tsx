"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import Notebook from "./Notebook";
import {
  accent,
  cardPadding,
  primaryButtonClass,
  typography,
} from "@/app/lib/typography";
import {
  type PracticeLabData,
  resolvePracticeHints,
  resolvePracticeInstructions,
  resolvePracticeObjective,
} from "@/app/lib/practiceLab";

type NotebookModalProps = {
  notebook: string;
  lessonTitle: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  takeaways?: string[];
  practiceLab?: PracticeLabData;
};

const MIN_INSTRUCTIONS_WIDTH = 280;
const MAX_INSTRUCTIONS_WIDTH = 720;
const DEFAULT_INSTRUCTIONS_WIDTH = 420;
const RESIZE_STEP = 24;
const DESKTOP_MQ = "(min-width: 1024px)";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const headerButtonClass = [
  "rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium transition",
  "hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800",
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-[#0E5C58] dark:focus-visible:outline-[#85D7CE]",
].join(" ");

function clampInstructionsWidth(width: number, workspaceWidth: number): number {
  const maximumWidth = Math.min(
    MAX_INSTRUCTIONS_WIDTH,
    Math.max(MIN_INSTRUCTIONS_WIDTH, workspaceWidth * 0.58)
  );
  return Math.min(Math.max(width, MIN_INSTRUCTIONS_WIDTH), maximumWidth);
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  ).filter(
    (element) =>
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true" &&
      element.tabIndex !== -1
  );
}

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MQ).matches;
}

function getServerDesktopSnapshot() {
  return false;
}

function subscribeIsClient() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerClientSnapshot() {
  return false;
}

export default function NotebookModal({
  notebook,
  lessonTitle,
  description,
  difficulty,
  duration,
  takeaways = [],
  practiceLab,
}: NotebookModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [instructionsWidth, setInstructionsWidth] = useState(
    DEFAULT_INSTRUCTIONS_WIDTH
  );
  const [isResizing, setIsResizing] = useState(false);

  const mounted = useSyncExternalStore(
    subscribeIsClient,
    getClientSnapshot,
    getServerClientSnapshot
  );
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopSnapshot,
    getServerDesktopSnapshot
  );

  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  const widthRef = useRef(DEFAULT_INSTRUCTIONS_WIDTH);
  const resizeCleanupRef = useRef<(() => void) | null>(null);

  const titleId = useId();
  const descriptionId = useId();
  const instructionsPanelId = useId();
  const overviewId = useId();

  const modalTitle = `${lessonTitle} Practice Lab`;
  const objective = resolvePracticeObjective(
    practiceLab,
    description,
    lessonTitle
  );
  const instructions = resolvePracticeInstructions(practiceLab);
  const hints = resolvePracticeHints(practiceLab);

  useEffect(() => {
    widthRef.current = instructionsWidth;
  }, [instructionsWidth]);

  const stopResizing = useCallback(() => {
    resizeCleanupRef.current?.();
    resizeCleanupRef.current = null;
    setIsResizing(false);
    setInstructionsWidth(widthRef.current);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  }, []);

  const closeLab = useCallback(() => {
    stopResizing();
    setIsOpen(false);
    setSessionKey(null);
    setIsLoading(true);
    requestAnimationFrame(() => {
      openButtonRef.current?.focus();
    });
  }, [stopResizing]);

  const openLab = () => {
    setSessionKey(String(Date.now()));
    setIsLoading(true);
    setInstructionsOpen(true);
    setIsOpen(true);
  };

  const applyLiveWidth = useCallback((width: number) => {
    widthRef.current = width;
    if (asideRef.current) {
      asideRef.current.style.width = `${width}px`;
    }
  }, []);

  const beginResize = useCallback(
    (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (!isDesktop || !instructionsOpen) {
        return;
      }

      event.preventDefault();
      const handle = event.currentTarget;
      handle.setPointerCapture(event.pointerId);

      const priorCursor = document.body.style.cursor;
      const priorUserSelect = document.body.style.userSelect;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      setIsResizing(true);

      let frame = 0;

      const onPointerMove = (moveEvent: PointerEvent) => {
        const workspace = workspaceRef.current;
        if (!workspace) return;

        const bounds = workspace.getBoundingClientRect();
        const next = clampInstructionsWidth(
          moveEvent.clientX - bounds.left,
          bounds.width
        );

        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          applyLiveWidth(next);
        });
      };

      const cleanup = () => {
        cancelAnimationFrame(frame);
        if (handle.hasPointerCapture(event.pointerId)) {
          try {
            handle.releasePointerCapture(event.pointerId);
          } catch {
            // already released
          }
        }
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        window.removeEventListener("blur", onEnd);
        resizeCleanupRef.current = null;
        setIsResizing(false);
        setInstructionsWidth(widthRef.current);
        document.body.style.cursor = priorCursor;
        document.body.style.userSelect = priorUserSelect;
      };

      const onEnd = () => {
        cleanup();
      };

      resizeCleanupRef.current = cleanup;
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
      window.addEventListener("blur", onEnd);
    },
    [applyLiveWidth, instructionsOpen, isDesktop]
  );

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLab();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        dialogRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first || !dialogRef.current.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogRef.current.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = priorOverflow;
      resizeCleanupRef.current?.();
      resizeCleanupRef.current = null;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [closeLab, isOpen]);

  const onResizeKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const workspace = workspaceRef.current;
    if (!workspace || !isDesktop) return;

    const bounds = workspace.getBoundingClientRect();
    let next = widthRef.current;

    if (event.key === "ArrowLeft") {
      next = clampInstructionsWidth(next - RESIZE_STEP, bounds.width);
    } else if (event.key === "ArrowRight") {
      next = clampInstructionsWidth(next + RESIZE_STEP, bounds.width);
    } else if (event.key === "Home") {
      next = MIN_INSTRUCTIONS_WIDTH;
    } else if (event.key === "End") {
      next = clampInstructionsWidth(MAX_INSTRUCTIONS_WIDTH, bounds.width);
    } else {
      return;
    }

    event.preventDefault();
    widthRef.current = next;
    setInstructionsWidth(next);
  };

  const onNotebookLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const toggleInstructions = () => {
    setInstructionsOpen((current) => !current);
  };

  const desktopAsideStyle: CSSProperties | undefined =
    isDesktop && instructionsOpen
      ? { width: instructionsWidth }
      : undefined;

  const modal =
    mounted && isOpen ? (
      <div className="fixed inset-0 z-[9999] flex h-dvh w-screen items-center justify-center overflow-hidden p-2 sm:p-4">
        <div
          className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          aria-hidden="true"
        />

        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          tabIndex={-1}
          className="relative z-10 flex h-[96dvh] w-[min(98vw,1800px)] max-w-[1800px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 sm:h-[95dvh] sm:rounded-2xl"
        >
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 sm:px-6 sm:py-4">
            <div className="min-w-0">
              <h2 id={titleId} className={`${typography.modalTitle} truncate`}>
                {modalTitle}
              </h2>
              <p
                id={descriptionId}
                className="mt-1 text-xs text-zinc-500 dark:text-zinc-400"
              >
                Interactive Practice Lab — follow the instructions, then work
                in the notebook.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={toggleInstructions}
                className={headerButtonClass}
                aria-expanded={instructionsOpen}
                aria-controls={instructionsPanelId}
              >
                {instructionsOpen ? "Hide Instructions" : "Show Instructions"}
              </button>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeLab}
                className={`${headerButtonClass} ${accent.hoverBorder} ${accent.hoverText}`}
              >
                ✕ Close
              </button>
            </div>
          </header>

          <div
            ref={workspaceRef}
            className="relative flex min-h-0 flex-1 overflow-hidden"
          >
            {!isDesktop && instructionsOpen ? (
              <button
                type="button"
                aria-label="Close instructions"
                className="absolute inset-0 z-20 bg-black/40"
                onClick={() => setInstructionsOpen(false)}
              />
            ) : null}

            <aside
              ref={asideRef}
              id={instructionsPanelId}
              style={desktopAsideStyle}
              className={[
                "shrink-0 overflow-x-hidden overflow-y-auto border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900",
                instructionsOpen
                  ? isDesktop
                    ? "relative z-auto border-r"
                    : "absolute inset-y-0 left-0 z-30 w-[min(88vw,24rem)] border-r shadow-xl"
                  : "hidden",
              ].join(" ")}
            >
              <div className="space-y-8 p-5 sm:p-6">
                <section aria-labelledby={overviewId}>
                  <p
                    id={overviewId}
                    className={`mb-2 text-xs font-semibold uppercase tracking-[0.15em] ${accent.text}`}
                  >
                    Overview
                  </p>
                  <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">
                    {lessonTitle}
                  </h3>
                  {(difficulty || duration) && (
                    <dl className="mt-4 grid grid-cols-2 gap-3">
                      {difficulty ? (
                        <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                          <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            Difficulty
                          </dt>
                          <dd className="mt-0.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {difficulty}
                          </dd>
                        </div>
                      ) : null}
                      {duration ? (
                        <div className="rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950">
                          <dt className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                            Estimated Time
                          </dt>
                          <dd className="mt-0.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                            {duration}
                          </dd>
                        </div>
                      ) : null}
                    </dl>
                  )}
                </section>

                <section>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    Learning Objective
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                    {objective}
                  </p>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    Instructions
                  </h3>
                  <ol className="mt-4 space-y-4">
                    {instructions.map((instruction, index) => (
                      <li
                        key={`instruction-${index}`}
                        className="flex gap-3 text-sm leading-6 text-zinc-700 dark:text-zinc-300"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent.bgSubtle} ${accent.text}`}
                        >
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                    Hints
                  </h3>
                  <div className="mt-4 space-y-3">
                    {hints.map((hint, index) => (
                      <div
                        key={`hint-${index}`}
                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950"
                      >
                        <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                          {hint}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>

                {practiceLab?.expectedOutput ? (
                  <section>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      Expected Output
                    </h3>
                    <div
                      className={`mt-4 rounded-xl border p-4 ${accent.borderSubtle} ${accent.bgSubtle}`}
                    >
                      <p className={`text-sm leading-6 ${accent.text}`}>
                        {practiceLab.expectedOutput}
                      </p>
                    </div>
                  </section>
                ) : null}

                {takeaways.length > 0 ? (
                  <section>
                    <h3 className="text-base font-semibold text-zinc-950 dark:text-zinc-50">
                      Lesson Takeaways
                    </h3>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                      {takeaways.map((takeaway, index) => (
                        <li key={`takeaway-${index}`}>{takeaway}</li>
                      ))}
                    </ul>
                  </section>
                ) : null}

                <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-950">
                  <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    Your notebook runs in the browser via JupyterLite. Work is
                    available for this browser session; closing the lab unloads
                    the notebook view.
                  </p>
                </div>
              </div>
            </aside>

            {isDesktop && instructionsOpen ? (
              <button
                type="button"
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize instruction panel"
                aria-valuemin={MIN_INSTRUCTIONS_WIDTH}
                aria-valuemax={MAX_INSTRUCTIONS_WIDTH}
                aria-valuenow={Math.round(instructionsWidth)}
                aria-controls={instructionsPanelId}
                onPointerDown={beginResize}
                onKeyDown={onResizeKeyDown}
                className={`relative z-20 hidden w-1.5 shrink-0 cursor-col-resize bg-zinc-200 transition hover:bg-[#0E5C58] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E5C58] dark:bg-zinc-800 dark:hover:bg-[#85D7CE] dark:focus-visible:outline-[#85D7CE] lg:block ${
                  isResizing ? "bg-[#0E5C58] dark:bg-[#85D7CE]" : ""
                }`}
              >
                <span
                  aria-hidden
                  className="absolute top-1/2 left-1/2 h-12 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-zinc-300 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900"
                />
              </button>
            ) : null}

            <main className="relative min-w-0 flex-1 overflow-hidden bg-white dark:bg-zinc-950">
              {isLoading ? (
                <div
                  className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white px-6 text-center dark:bg-zinc-950"
                  aria-live="polite"
                  aria-busy="true"
                >
                  <div className="h-9 w-9 animate-spin rounded-full border-4 border-zinc-200 border-t-[#0E5C58] dark:border-zinc-700 dark:border-t-[#85D7CE]" />
                  <p className={typography.body}>Loading Practice Lab...</p>
                  <p
                    className={`${typography.caption} max-w-sm text-zinc-500 dark:text-zinc-400`}
                  >
                    Preparing the Python environment and opening your notebook.
                  </p>
                </div>
              ) : null}

              {sessionKey ? (
                <Notebook
                  notebook={notebook}
                  sessionKey={sessionKey}
                  onLoad={onNotebookLoad}
                />
              ) : null}

              {isResizing ? (
                <div
                  className="absolute inset-0 z-30 cursor-col-resize"
                  aria-hidden
                />
              ) : null}
            </main>
          </div>
        </div>
      </div>
    ) : null;

  return (
    <div className={cardPadding}>
      <button
        ref={openButtonRef}
        type="button"
        onClick={openLab}
        className={primaryButtonClass}
        aria-haspopup="dialog"
      >
        Open Practice Lab
      </button>

      {mounted && modal ? createPortal(modal, document.body) : null}
    </div>
  );
}
