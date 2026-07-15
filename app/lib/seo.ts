import fs from "fs";
import path from "path";

/** Prefer brand assets that exist under `public/`. Never invent paths. */
const DEFAULT_SOCIAL_IMAGE_CANDIDATES = [
  "/images/logowebaigen.png",
  "/images/webaigen_cropped.png",
] as const;

/** True when `publicPath` is a root-relative path to an existing file in `public/`. */
export function publicAssetExists(publicPath: string | undefined): boolean {
  if (!publicPath || !publicPath.startsWith("/") || publicPath.startsWith("//")) {
    return false;
  }

  if (publicPath.includes("..")) {
    return false;
  }

  const relative = publicPath.replace(/^\/+/, "");
  const absolute = path.join(process.cwd(), "public", relative);
  return fs.existsSync(absolute);
}

/** First available default WebAIGen Academy social image path, if any. */
export function getDefaultSocialImagePath(): string | undefined {
  return DEFAULT_SOCIAL_IMAGE_CANDIDATES.find((candidate) =>
    publicAssetExists(candidate)
  );
}

/**
 * Prefer a post cover when the file exists; otherwise the default brand image.
 * Returns `undefined` when neither is available (callers omit `images`).
 */
export function resolveSocialImagePath(
  coverImage: string | undefined
): string | undefined {
  if (publicAssetExists(coverImage)) {
    return coverImage;
  }
  return getDefaultSocialImagePath();
}

/**
 * Serialize JSON-LD for embedding in `<script type="application/ld+json">`.
 * Escapes characters that could break out of the script context.
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function toIsoDate(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}
