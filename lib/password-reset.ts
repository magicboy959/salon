import { createHash, randomBytes, randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { query, transaction } from "@/lib/db";

type UserRow = RowDataPacket & { id: string; name: string | null; email: string | null };
type TokenRow = RowDataPacket & { id: string; userId: string; expiresAt: Date | string; usedAt: Date | string | null };

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createPasswordReset(email: string) {
  const [user] = await query<UserRow[]>("SELECT id, name, email FROM User WHERE email = ? LIMIT 1", [email]);
  if (!user?.email) return null;

  const token = randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

  await query<ResultSetHeader>(
    "INSERT INTO PasswordResetToken (id, userId, tokenHash, expiresAt, createdAt) VALUES (?, ?, ?, ?, NOW(3))",
    [randomUUID(), user.id, tokenHash, expiresAt]
  );

  return { token, user };
}

export async function resetPassword(token: string, password: string) {
  const tokenHash = hashToken(token);
  return transaction(async (connection) => {
    const [tokens] = await connection.execute<TokenRow[]>(
      "SELECT id, userId, expiresAt, usedAt FROM PasswordResetToken WHERE tokenHash = ? LIMIT 1",
      [tokenHash]
    );
    const row = tokens[0];
    if (!row || row.usedAt || new Date(row.expiresAt).getTime() < Date.now()) throw new Error("INVALID_TOKEN");

    const passwordHash = await bcrypt.hash(password, 12);
    await connection.execute<ResultSetHeader>("UPDATE User SET passwordHash = ?, updatedAt = NOW(3) WHERE id = ?", [passwordHash, row.userId]);
    await connection.execute<ResultSetHeader>("UPDATE PasswordResetToken SET usedAt = NOW(3) WHERE id = ?", [row.id]);
  });
}
