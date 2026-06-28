import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { query, transaction } from "@/lib/db";

export type UserRoleName = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "BARBER" | "CUSTOMER";

export type AdminUserRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  roles: string;
  creditBalance: number;
  createdAt: string;
};

type UserRow = RowDataPacket & Omit<AdminUserRow, "createdAt" | "creditBalance"> & { creditBalance: string | number | null; createdAt: Date | string };
type IdRow = RowDataPacket & { id: string };

export async function createUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: UserRoleName;
}) {
  const userId = randomUUID();
  const customerId = randomUUID();
  const roleName = input.role ?? "CUSTOMER";
  const passwordHash = await bcrypt.hash(input.password, 12);

  await transaction(async (connection) => {
    const [existing] = await connection.execute<IdRow[]>("SELECT id FROM User WHERE email = ? LIMIT 1", [input.email]);
    if (existing.length) throw new Error("EMAIL_EXISTS");

    await connection.execute<ResultSetHeader>(
      "INSERT INTO User (id, name, email, phone, passwordHash, twoFactorOn, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, false, NOW(3), NOW(3))",
      [userId, input.name, input.email, input.phone ?? null, passwordHash]
    );

    const [roles] = await connection.execute<IdRow[]>("SELECT id FROM Role WHERE name = ? LIMIT 1", [roleName]);
    if (!roles[0]) throw new Error("ROLE_NOT_FOUND");

    await connection.execute<ResultSetHeader>("INSERT INTO UserRole (userId, roleId) VALUES (?, ?)", [userId, roles[0].id]);

    if (roleName === "CUSTOMER") {
      await connection.execute<ResultSetHeader>("INSERT INTO Customer (id, userId, rewardPoints) VALUES (?, ?, 0)", [customerId, userId]);
    }
  });

  return userId;
}

export async function listAdminUsers() {
  const rows = await query<UserRow[]>(
    `SELECT
      User.id,
      User.name,
      User.email,
      User.phone,
      User.createdAt,
      COALESCE(GROUP_CONCAT(Role.name ORDER BY Role.name SEPARATOR ', '), '') AS roles,
      COALESCE(StoreCreditAccount.balance, 0) AS creditBalance
    FROM User
    LEFT JOIN UserRole ON UserRole.userId = User.id
    LEFT JOIN Role ON Role.id = UserRole.roleId
    LEFT JOIN StoreCreditAccount ON StoreCreditAccount.userId = User.id
    GROUP BY User.id
    ORDER BY User.createdAt DESC
    LIMIT 200`
  );

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    roles: row.roles,
    creditBalance: Number(row.creditBalance ?? 0),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : new Date(row.createdAt).toISOString()
  }));
}

export async function addStoreCredit(input: {
  userId: string;
  amount: number;
  note?: string;
  adminUserId?: string;
}) {
  if (!Number.isFinite(input.amount) || input.amount <= 0) throw new Error("INVALID_AMOUNT");

  await transaction(async (connection) => {
    const [accounts] = await connection.execute<IdRow[]>("SELECT id FROM StoreCreditAccount WHERE userId = ? LIMIT 1", [input.userId]);
    const accountId = accounts[0]?.id ?? randomUUID();

    if (!accounts[0]) {
      await connection.execute<ResultSetHeader>(
        "INSERT INTO StoreCreditAccount (id, userId, balance, createdAt, updatedAt) VALUES (?, ?, 0, NOW(3), NOW(3))",
        [accountId, input.userId]
      );
    }

    await connection.execute<ResultSetHeader>(
      "UPDATE StoreCreditAccount SET balance = balance + ?, updatedAt = NOW(3) WHERE id = ?",
      [input.amount, accountId]
    );
    await connection.execute<ResultSetHeader>(
      "INSERT INTO StoreCreditTransaction (id, accountId, adminUserId, amount, type, note, createdAt) VALUES (?, ?, ?, ?, 'CREDIT', ?, NOW(3))",
      [randomUUID(), accountId, input.adminUserId ?? null, input.amount, input.note ?? null]
    );
  });
}

export async function updateUserRole(input: { userId: string; role: UserRoleName }) {
  await transaction(async (connection) => {
    const [users] = await connection.execute<IdRow[]>("SELECT id FROM User WHERE id = ? LIMIT 1", [input.userId]);
    if (!users[0]) throw new Error("USER_NOT_FOUND");

    const [roles] = await connection.execute<IdRow[]>("SELECT id FROM Role WHERE name = ? LIMIT 1", [input.role]);
    if (!roles[0]) throw new Error("ROLE_NOT_FOUND");

    await connection.execute<ResultSetHeader>("DELETE FROM UserRole WHERE userId = ?", [input.userId]);
    await connection.execute<ResultSetHeader>("INSERT INTO UserRole (userId, roleId) VALUES (?, ?)", [input.userId, roles[0].id]);

    if (input.role === "CUSTOMER") {
      const [customers] = await connection.execute<IdRow[]>("SELECT id FROM Customer WHERE userId = ? LIMIT 1", [input.userId]);
      if (!customers[0]) {
        await connection.execute<ResultSetHeader>("INSERT INTO Customer (id, userId, rewardPoints) VALUES (?, ?, 0)", [randomUUID(), input.userId]);
      }
    }
  });
}
