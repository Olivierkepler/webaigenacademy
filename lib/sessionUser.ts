import type { Session } from "next-auth";
import { sql } from "@/lib/db";

type UserIdRow = { id?: unknown };

export async function resolveSessionUserId(
  session: Session | null
): Promise<string | null> {
  if (session?.user?.id) {
    return session.user.id;
  }

  const email = session?.user?.email?.trim();
  if (!email) {
    return null;
  }

  try {
    const rows = (await sql`
      SELECT id FROM users WHERE email = ${email}
    `) as UserIdRow[];
    const id = rows[0]?.id;
    return typeof id === "string" ? id : null;
  } catch (error) {
    console.error("[sessionUser] Failed to resolve user id:", error);
    return null;
  }
}

export function isSignedIn(
  session: Session | null
): session is Session & { user: NonNullable<Session["user"]> } {
  return Boolean(session?.user?.email || session?.user?.id);
}
