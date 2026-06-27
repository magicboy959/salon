import fs from "node:fs";

export function databaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (!fs.existsSync(".env")) throw new Error("DATABASE_URL is not configured and .env was not found");

  const text = fs.readFileSync(".env", "utf8");
  const match = text.match(/^DATABASE_URL=(.*)$/m);
  if (!match) throw new Error("DATABASE_URL is missing from .env");

  return match[1].trim().replace(/^"|"$/g, "");
}

export function splitSqlStatements(sql) {
  return sql
    .split(/;\s*(?:\r?\n|$)/)
    .map((statement) => statement.trim())
    .filter(Boolean);
}
