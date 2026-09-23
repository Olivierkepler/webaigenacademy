import { createHash, randomBytes } from "crypto";
import { sql } from "@/lib/db";

const RESET_TOKEN_TTL_MINUTES = 30;

type ResetTokenRow = {
  user_id?: unknown;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordResetToken(
  userId: string
): Promise<string> {
  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);

  const expiresAt = new Date(
    Date.now() + RESET_TOKEN_TTL_MINUTES * 60 * 1000
  );

  // Invalidate any previous reset links for this user.
  await sql`
    DELETE FROM password_reset_tokens
    WHERE user_id = ${userId}
  `;

  await sql`
    INSERT INTO password_reset_tokens (
      user_id,
      token_hash,
      expires_at
    )
    VALUES (
      ${userId},
      ${tokenHash},
      ${expiresAt}
    )
  `;

  return token;
}

export async function getUserIdForValidResetToken(
  token: string
): Promise<string | null> {
  const tokenHash = hashToken(token);

  const rows = (await sql`
    SELECT user_id
    FROM password_reset_tokens
    WHERE token_hash = ${tokenHash}
      AND expires_at > NOW()
    LIMIT 1
  `) as ResetTokenRow[];

  const userId = rows[0]?.user_id;

  return typeof userId === "string" ? userId : null;
}

export async function deletePasswordResetToken(
  token: string
): Promise<void> {
  const tokenHash = hashToken(token);

  await sql`
    DELETE FROM password_reset_tokens
    WHERE token_hash = ${tokenHash}
  `;
}

export async function deletePasswordResetTokensForUser(
  userId: string
): Promise<void> {
  await sql`
    DELETE FROM password_reset_tokens
    WHERE user_id = ${userId}
  `;
}