"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { createPortal } from "react-dom";
import type { LessonVideo } from "@/app/lib/lessonVideo";

export type VideoTutorialProps = {
  video: LessonVideo;
};

const DOCK_WIDTH_KEY = "webaigenacademy-dock-width";
const DOCK_WIDTH_MIN = 360;
const DOCK_WIDTH_MAX = 960;
const DOCK_WIDTH_DEFAULT = 600;
const DOCK_RESIZE_STEP = 40;

function getEmbedSrc(video: LessonVideo): string {
  if (video.provider === "google-drive") {
    return `https://drive.google.com/file/d/${video.id}/preview`;
  }
  return `https://www.youtube-nocookie.com/embed/${video.id}`;
}

function getThumbnailSrc(video: LessonVideo): string {
  if (video.thumbnail) {
    return video.thumbnail;
  }
  if (video.provider === "google-drive") {
    return `https://drive.google.com/thumbnail?id=${video.id}&sz=w800`;
  }
  return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
}

function clampDockWidth(width: number): number {
  const viewportMax =
    typeof window !== "undefined"
      ? Math.min(window.innerWidth - 32, DOCK_WIDTH_MAX)
      : DOCK_WIDTH_MAX;
  return Math.min(Math.max(width, DOCK_WIDTH_MIN), viewportMax);
}

function PlayIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-white">
      <path d="M8 5v14l11-7L8 5z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-4 w-4"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ResizeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      className="h-3.5 w-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
      />
    </svg>
  );
}

function FilmIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="h-8 w-8 text-zinc-400 dark:text-zinc-500"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M7 4v16M17 4v16M2 12h20M2 8h5M2 16h5M17 8h5M17 16h5" />
      <path d="M10 10l5 2.5-5 2.5V10z" fill="currentColor" stroke="none" />
    </svg>
  );
}

const dockButtonClass =
  "cursor-pointer rounded p-1 text-zinc-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#85D7CE]";

export default function VideoTutorial({ video }: VideoTutorialProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dockWidth, setDockWidth] = useState(DOCK_WIDTH_DEFAULT);
  const [isSmUp, setIsSmUp] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    setMounted(true);

    const mq = window.matchMedia("(min-width: 640px)");
    const syncSm = () => setIsSmUp(mq.matches);
    syncSm();
    mq.addEventListener("change", syncSm);

    try {
      const stored = localStorage.getItem(DOCK_WIDTH_KEY);
      if (stored != null) {
        const parsed = Number(stored);
        if (Number.isFinite(parsed)) {
          setDockWidth(clampDockWidth(parsed));
        }
      }
    } catch {
      // ignore storage failures
    }

    return () => {
      mq.removeEventListener("change", syncSm);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => {
          playButtonRef.current?.focus();
        });
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  const persistDockWidth = (width: number) => {
    try {
      localStorage.setItem(DOCK_WIDTH_KEY, String(width));
    } catch {
      // ignore storage failures
    }
  };

  const closeDock = () => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      playButtonRef.current?.focus();
    });
  };

  const onResizePointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { startX: event.clientX, startWidth: dockWidth };
    setIsResizing(true);
  };

  const onResizePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragRef.current || !event.currentTarget.hasPointerCapture(event.pointerId)) {
      return;
    }

    const { startX, startWidth } = dragRef.current;
    setDockWidth(clampDockWidth(startWidth + (startX - event.clientX)));
  };

  const endResize = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragRef.current = null;
    setIsResizing(false);
    setDockWidth((current) => {
      const clamped = clampDockWidth(current);
      persistDockWidth(clamped);
      return clamped;
    });
  };

  const onResizeKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let delta = 0;

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      delta = DOCK_RESIZE_STEP;
    } else if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      delta = -DOCK_RESIZE_STEP;
    } else {
      return;
    }

    event.preventDefault();
    setDockWidth((current) => {
      const next = clampDockWidth(current + delta);
      persistDockWidth(next);
      return next;
    });
  };

  if (!video?.id) {
    return null;
  }

  const dockStyle: CSSProperties | undefined = isSmUp
    ? { width: dockWidth }
    : undefined;

  const dock =
    mounted && isOpen
      ? createPortal(
          <aside
            role="complementary"
            aria-label={`Video player: ${video.title}`}
            className="fixed right-4 bottom-4 left-4 z-50 overflow-hidden rounded-2xl border border-zinc-200 bg-black shadow-2xl sm:left-auto sm:max-w-[calc(100vw-2rem)] dark:border-zinc-800"
            style={dockStyle}
          >
            <div className="flex h-9 items-center justify-between gap-2 bg-zinc-900 px-3">
              <div className="flex min-w-0 flex-1 items-center gap-1.5">
                <button
                  type="button"
                  onPointerDown={onResizePointerDown}
                  onPointerMove={onResizePointerMove}
                  onPointerUp={endResize}
                  onPointerCancel={endResize}
                  onKeyDown={onResizeKeyDown}
                  aria-label="Resize video player"
                  className={`hidden shrink-0 cursor-nwse-resize sm:inline-flex ${dockButtonClass}`}
                >
                  <ResizeIcon />
                </button>
                <p className="min-w-0 flex-1 truncate text-xs text-zinc-200">
                  {video.title}
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeDock}
                aria-label="Close video"
                className={`inline-flex shrink-0 ${dockButtonClass}`}
              >
                <CloseIcon />
              </button>
            </div>

            <div
              className={
                video.aspect === "16/10"
                  ? "relative aspect-[16/10] w-full"
                  : "relative aspect-video w-full"
              }
            >
              <iframe
                src={getEmbedSrc(video)}
                title={video.title}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="absolute inset-0 h-full w-full border-0"
              />
              {isResizing ? (
                <div className="absolute inset-0 z-10" aria-hidden />
              ) : null}
            </div>
          </aside>,
          document.body
        )
      : null;

  return (
    <section>
      <h3 className="mb-3 text-lg font-bold text-black dark:text-white">
        Video Tutorial
      </h3>

      {/* Media frame: one box, media fills it edge-to-edge */}
      <div
        className={
          video.aspect === "16/10"
            ? "relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
            : "relative aspect-video w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
        }
      >
        <button
          ref={playButtonRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={`Play video: ${video.title}`}
          className="group absolute inset-0 cursor-pointer"
        >
          {thumbFailed ? (
            <span className="flex h-full w-full items-center justify-center">
              <FilmIcon />
            </span>
          ) : (
            <img
              src={getThumbnailSrc(video)}
              alt=""
              loading="lazy"
              onError={() => setThumbFailed(true)}
              className="h-full w-full object-cover transition group-hover:brightness-90"
            />
          )}

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-black/0 transition group-hover:bg-black/10"
          />

          <span className="pointer-events-none absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0E5C58] shadow-md transition group-hover:scale-105">
            <PlayIcon />
          </span>
        </button>
      </div>

      {/* Text below the frame, no card wrapper */}
      <h4 className="mt-3 text-sm font-semibold text-black dark:text-white">
        {video.title}
      </h4>

      {video.description ? (
        <p className="mt-1 line-clamp-2 text-xs text-black/70 dark:text-white/70">
          {video.description}
        </p>
      ) : null}

      {dock}
    </section>
  );
}
