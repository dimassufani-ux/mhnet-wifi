import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { customers, packages, payments, users } from "@shared/schema";
import type { Customer, InsertCustomer, Package, InsertPackage, Payment, InsertPayment, User, InsertUser } from "@shared/schema";
import type { IStorage } from "./storage";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export class DbStorage implements IStorage {
  private db = getDb();

  async getCustomer(id: string): Promise<Customer | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.select().from(customers).where(eq(customers.id, id));
    return result[0];
  }

  async getAllCustomers(): Promise<Customer[]> {
    if (!this.db) return [];
    return await this.db.select().from(customers);
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    if (!this.db) throw new Error("Database not connected");
    const result = await this.db.insert(customers).values(data).returning();
    return result[0];
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.update(customers).set(data).where(eq(customers.id, id)).returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<boolean> {
    if (!this.db) return false;
    await this.db.delete(customers).where(eq(customers.id, id));
    return true;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.select().from(packages).where(eq(packages.id, id));
    return result[0];
  }

  async getAllPackages(): Promise<Package[]> {
    if (!this.db) return [];
    return await this.db.select().from(packages);
  }

  async createPackage(data: InsertPackage): Promise<Package> {
    if (!this.db) throw new Error("Database not connected");
    const result = await this.db.insert(packages).values(data).returning();
    return result[0];
  }

  async updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.update(packages).set(data).where(eq(packages.id, id)).returning();
    return result[0];
  }

  async deletePackage(id: string): Promise<boolean> {
    if (!this.db) return false;
    await this.db.delete(packages).where(eq(packages.id, id));
    return true;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getAllPayments(): Promise<Payment[]> {
    if (!this.db) return [];
    return await this.db.select().from(payments);
  }

  async createPayment(data: InsertPayment): Promise<Payment> {
    if (!this.db) throw new Error("Database not connected");
    const result = await this.db.insert(payments).values(data).returning();
    return result[0];
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return result[0];
  }

  async deletePayment(id: string): Promise<boolean> {
    if (!this.db) return false;
    await this.db.delete(payments).where(eq(payments.id, id));
    return true;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!this.db) return undefined;
    const result = await this.db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(data: InsertUser): Promise<User> {
    if (!this.db) throw new Error("Database not connected");
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const result = await this.db.insert(users).values({
      ...data,
      password: hashedPassword,
    }).returning();
    return result[0];
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
