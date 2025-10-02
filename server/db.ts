import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

let db: any = null;

export function getDb() {
  if (!db && process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    db = drizzle(sql as any, { schema });
  }
  return db;
}
