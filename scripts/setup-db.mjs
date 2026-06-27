import fs from "node:fs";
import mysql from "mysql2/promise";
import { databaseUrl, splitSqlStatements } from "./mysql-env.mjs";

const sql = fs.readFileSync("database/schema.sql", "utf8");
const connection = await mysql.createConnection(databaseUrl());

try {
  for (const statement of splitSqlStatements(sql)) {
    await connection.query(statement);
  }
  console.log("Database schema created.");
} finally {
  await connection.end();
}
