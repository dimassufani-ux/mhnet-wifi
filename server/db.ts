import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

let db: any = null;

export function getDb() {
  if (!db && process.env.DATABASE_URL) {
    try {
      const sql = neon(process.env.DATABASE_URL);
      db = drizzle(sql as any, { schema });
    } catch (error) {
      console.error('Database connection failed:', error);
      throw new Error('Database connection failed');
    }
  }
  return db;
}
