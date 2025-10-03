import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentStatus: text("payment_status").notNull().default("Belum Lunas"),
  name: text("name").notNull(),
  nickname: text("nickname"),
});

export const psb = pgTable("psb", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  joinDate: timestamp("join_date").notNull().defaultNow(),
});



export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerId: varchar("customer_id").notNull(),
  amount: integer("amount").notNull(),
  paymentDate: timestamp("payment_date").notNull().defaultNow(),
  status: text("status").notNull().default("pending"),
  method: text("method").notNull(),
  month: text("month").notNull(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
});

export const insertPSBSchema = createInsertSchema(psb).omit({
  id: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type PSB = typeof psb.$inferSelect;
export type InsertPSB = z.infer<typeof insertPSBSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
