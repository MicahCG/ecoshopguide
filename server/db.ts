import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema.js";

// Make database connection optional to prevent serverless function crashes
// Routes that need the database should check if db is available
const sql = process.env.DATABASE_URL
  ? postgres(process.env.DATABASE_URL)
  : null;

export const db = sql ? drizzle(sql, { schema }) : null;

export function requireDb() {
  if (!db) {
    throw new Error("DATABASE_URL must be set. Did you forget to provision the database?");
  }
  return db;
}
