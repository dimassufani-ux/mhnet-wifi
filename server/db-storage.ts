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
    try {
      if (!this.db) return undefined;
      const result = await this.db.select().from(customers).where(eq(customers.id, id));
      return result[0];
    } catch (error) {
      console.error('Failed to get customer:', error);
      return undefined;
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    try {
      if (!this.db) return [];
      return await this.db.select().from(customers);
    } catch (error) {
      console.error('Failed to get all customers:', error);
      return [];
    }
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    try {
      if (!this.db) throw new Error("Database not connected");
      const result = await this.db.insert(customers).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.update(customers).set(data).where(eq(customers.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to update customer:', error);
      return undefined;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.delete(customers).where(eq(customers.id, id));
      return true;
    } catch (error) {
      console.error('Failed to delete customer:', error);
      return false;
    }
  }

  async getPackage(id: string): Promise<Package | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.select().from(packages).where(eq(packages.id, id));
      return result[0];
    } catch (error) {
      console.error('Failed to get package:', error);
      return undefined;
    }
  }

  async getAllPackages(): Promise<Package[]> {
    try {
      if (!this.db) return [];
      return await this.db.select().from(packages);
    } catch (error) {
      console.error('Failed to get all packages:', error);
      return [];
    }
  }

  async createPackage(data: InsertPackage): Promise<Package> {
    try {
      if (!this.db) throw new Error("Database not connected");
      const result = await this.db.insert(packages).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create package:', error);
      throw new Error('Failed to create package');
    }
  }

  async updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.update(packages).set(data).where(eq(packages.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to update package:', error);
      return undefined;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.delete(packages).where(eq(packages.id, id));
      return true;
    } catch (error) {
      console.error('Failed to delete package:', error);
      return false;
    }
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.select().from(payments).where(eq(payments.id, id));
      return result[0];
    } catch (error: unknown) {
      console.error('Failed to get payment:', error);
      return undefined;
    }
  }

  async getAllPayments(): Promise<Payment[]> {
    try {
      if (!this.db) return [];
      return await this.db.select().from(payments);
    } catch (error: unknown) {
      console.error('Failed to get all payments:', error);
      return [];
    }
  }

  async createPayment(data: InsertPayment): Promise<Payment> {
    try {
      if (!this.db) throw new Error("Database not connected");
      const result = await this.db.insert(payments).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create payment:', error);
      throw new Error('Failed to create payment');
    }
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.update(payments).set(data).where(eq(payments.id, id)).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to update payment:', error);
      return undefined;
    }
  }

  async deletePayment(id: string): Promise<boolean> {
    try {
      if (!this.db) return false;
      await this.db.delete(payments).where(eq(payments.id, id));
      return true;
    } catch (error) {
      console.error('Failed to delete payment:', error);
      return false;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      if (!this.db) return undefined;
      const result = await this.db.select().from(users).where(eq(users.username, username));
      return result[0];
    } catch (error) {
      console.error('Failed to get user by username:', error);
      return undefined;
    }
  }

  async createUser(data: InsertUser): Promise<User> {
    try {
      if (!this.db) throw new Error("Database not connected");
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const result = await this.db.insert(users).values({
        ...data,
        password: hashedPassword,
      }).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Failed to verify password:', error);
      return false;
    }
  }
}
