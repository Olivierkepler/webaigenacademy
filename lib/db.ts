import { neon } from "@neondatabase/serverless";
import { Pool } from "pg";

type SqlTag = ReturnType<typeof neon>;

function createNoopSql(): SqlTag {
  const noop = () => Promise.resolve([]);
  return noop as unknown as SqlTag;
}

function isLocalDatabaseUrl(url: string): boolean {
  try {
    const parsed = new URL(url.replace(/^postgres(ql)?:/, "http:"));
    const host = parsed.hostname.toLowerCase();
    return host === "localhost" || host === "127.0.0.1";
  } catch {
    return false;
  }
}

function createPgSql(connectionString: string): SqlTag {
  const globalForPg = globalThis as typeof globalThis & {
    pgPool?: Pool;
  };

  if (!globalForPg.pgPool) {
    globalForPg.pgPool = new Pool({ connectionString });
  }

  const pool = globalForPg.pgPool;

  const sql = (async (
    strings: TemplateStringsArray,
    ...values: unknown[]
  ) => {
    let text = strings[0] ?? "";
    for (let i = 0; i < values.length; i++) {
      text += `$${i + 1}${strings[i + 1] ?? ""}`;
    }

    const result = await pool.query(text, values);
    return result.rows;
  }) as unknown as SqlTag;

  return sql;
}

function createSql(databaseUrl: string): SqlTag {
  if (isLocalDatabaseUrl(databaseUrl)) {
    return createPgSql(databaseUrl);
  }

  return neon(databaseUrl);
}

const databaseUrl = process.env.DATABASE_URL?.trim();

export const sql: SqlTag = databaseUrl ? createSql(databaseUrl) : createNoopSql();

export const isDatabaseConfigured = Boolean(databaseUrl);

export const isLocalDatabase = Boolean(
  databaseUrl && isLocalDatabaseUrl(databaseUrl)
);
