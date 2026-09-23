export type UserRole = "admin" | "learner";

export function getAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS?.trim();
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function resolveUserRole(
  email: string | null | undefined
): UserRole {
  if (!email) {
    return "learner";
  }

  const normalized = email.trim().toLowerCase();
  return getAdminEmails().includes(normalized) ? "admin" : "learner";
}

export function isAdminRole(role: string | undefined): boolean {
  return role === "admin";
}
