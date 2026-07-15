/**
 * Canonical site origin for metadata, sitemap, robots, and JSON-LD.
 *
 * Resolution order:
 * 1. `NEXT_PUBLIC_SITE_URL` when set to a valid absolute http(s) URL
 * 2. Production Vercel URL (never localhost)
 */

const PRODUCTION_SITE_URL = "https://webaigenacademy.vercel.app";

function normalizeOrigin(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.origin;
  } catch {
    return null;
  }
}

/** Absolute site origin without a trailing slash. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) {
    const origin = normalizeOrigin(fromEnv);
    if (origin) {
      return origin;
    }
  }

  return PRODUCTION_SITE_URL;
}

/** Join a site-relative path with the resolved site origin. */
export function absoluteUrl(pathname = "/"): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(path, `${base}/`).toString();
}
