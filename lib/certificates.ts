function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function getPublicAppUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim();

  if (configuredUrl) {
    return normalizeBaseUrl(configuredUrl);
  }

  if (process.env.VERCEL_URL) {
    return normalizeBaseUrl(
      `https://${process.env.VERCEL_URL}`
    );
  }

  return "http://localhost:3000";
}

export function getCertificateVerificationPath(
  certificateNumber: string
): string {
  return `/certificates/verify/${encodeURIComponent(
    certificateNumber
  )}`;
}

export function getCertificateVerificationUrl(
  certificateNumber: string
): string {
  return `${getPublicAppUrl()}${getCertificateVerificationPath(
    certificateNumber
  )}`;
}