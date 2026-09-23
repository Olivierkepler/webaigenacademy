import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  passwordHash: string | null;
};

type UserRow = {
  id?: unknown;
  email?: unknown;
  name?: unknown;
  image?: unknown;
  password_hash?: unknown;
};

function mapUser(row: UserRow): DbUser | null {
  if (typeof row.id !== "string" || typeof row.email !== "string") {
    return null;
  }

  return {
    id: row.id,
    email: row.email,
    name: typeof row.name === "string" ? row.name : null,
    image: typeof row.image === "string" ? row.image : null,
    passwordHash:
      typeof row.password_hash === "string" ? row.password_hash : null,
  };
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const rows = (await sql`
    SELECT id, email, name, image, password_hash
    FROM users
    WHERE email = ${email.trim().toLowerCase()}
  `) as UserRow[];

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function getUserById(id: string): Promise<DbUser | null> {
  const rows = (await sql`
    SELECT id, email, name, image, password_hash
    FROM users
    WHERE id = ${id}
  `) as UserRow[];

  return rows[0] ? mapUser(rows[0]) : null;
}

export async function createUserWithPassword(input: {
  email: string;
  password: string;
  name?: string;
}): Promise<DbUser> {
  const email = input.email.trim().toLowerCase();
  const name = input.name?.trim() || null;
  const passwordHash = await hashPassword(input.password);

  const rows = (await sql`
    INSERT INTO users (email, name, password_hash)
    VALUES (${email}, ${name}, ${passwordHash})
    RETURNING id, email, name, image, password_hash
  `) as UserRow[];

  const user = rows[0] ? mapUser(rows[0]) : null;
  if (!user) {
    throw new Error("Failed to create user");
  }

  return user;
}

export async function updateUserPassword(
  userId: string,
  password: string
): Promise<void> {
  const passwordHash = await hashPassword(password);

  await sql`
    UPDATE users
    SET password_hash = ${passwordHash}
    WHERE id = ${userId}
  `;
}

export async function upsertOAuthUser(input: {
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<void> {
  await sql`
    INSERT INTO users (email, name, image)
    VALUES (${input.email}, ${input.name ?? null}, ${input.image ?? null})
    ON CONFLICT (email)
    DO UPDATE SET
      name = COALESCE(EXCLUDED.name, users.name),
      image = COALESCE(EXCLUDED.image, users.image)
  `;
}
