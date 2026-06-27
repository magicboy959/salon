import mysql, { type Pool, type PoolConnection, type QueryResult } from "mysql2/promise";

const globalForMySql = globalThis as unknown as { mysqlPool?: Pool };

function databaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return url;
}

export const db =
  globalForMySql.mysqlPool ??
  mysql.createPool({
    uri: databaseUrl(),
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true
  });

if (process.env.NODE_ENV !== "production") globalForMySql.mysqlPool = db;

export async function query<T extends QueryResult>(sql: string, values?: unknown[]) {
  const [rows] = await db.query<T>(sql, values);
  return rows;
}

export async function transaction<T>(callback: (connection: PoolConnection) => Promise<T>) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
