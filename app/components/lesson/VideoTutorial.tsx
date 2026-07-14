"use client";

import { useState } from "react";
import type { LessonVideo } from "@/app/lib/lessonVideo";

export type VideoTutorialProps = {
  video: LessonVideo;
};

function getEmbedSrc(video: LessonVideo): string {
  if (video.provider === "google-drive") {
    return `https://drive.google.com/file/d/${video.id}/preview`;
  }

  return `https://www.youtube-nocookie.com/embed/${video.id}`;
}

function getThumbnailSrc(video: LessonVideo): string {
  if (video.provider === "google-drive") {
    return `https://drive.google.com/thumbnail?id=${video.id}&sz=w800`;
  }

  return `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
}

function PlayIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="ml-0.5 h-5 w-5 fill-white"
    >
      <path d="M8 5v14l11-7L8 5z" />
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

export default function VideoTutorial({ video }: VideoTutorialProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbFailed, setThumbFailed] = useState(false);

  if (!video?.id) {
    return null;
  }

  return (
    <section>
      <h3 className="mb-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">
        Video Tutorial
      </h3>

      <div className="rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
          {isPlaying ? (
            <iframe
              src={getEmbedSrc(video)}
              title={video.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="h-full w-full border-0"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label={`Play video: ${video.title}`}
              className="group relative h-full w-full cursor-pointer overflow-hidden"
            >
              {thumbFailed ? (
                <span className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
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
          )}
        </div>

        <h4 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          {video.title}
        </h4>

        {video.description ? (
          <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
            {video.description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
