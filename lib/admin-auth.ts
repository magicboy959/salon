import type { RowDataPacket } from "mysql2";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

const adminRoles = new Set(["SUPER_ADMIN", "ADMIN", "MANAGER"]);

type RoleRow = RowDataPacket & { name: string };

export async function getUserRoles(userId: string) {
  const rows = await query<RoleRow[]>(
    `SELECT Role.name
    FROM UserRole
    INNER JOIN Role ON Role.id = UserRole.roleId
    WHERE UserRole.userId = ?`,
    [userId]
  );
  return rows.map((row) => row.name);
}

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const roles = await getUserRoles(session.user.id);
  return { ...session.user, roles, isAdmin: roles.some((role) => adminRoles.has(role)) };
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) return null;
  return user;
}
