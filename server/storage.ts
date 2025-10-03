import { 
  type Customer, 
  type InsertCustomer,
  type Package,
  type InsertPackage,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  getAllPSB(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  getPackage(id: string): Promise<Package | undefined>;
  getAllPackages(): Promise<Package[]>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, pkg: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;

  getPayment(id: string): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private packages: Map<string, Package>;
  private payments: Map<string, Payment>;

  constructor() {
    this.customers = new Map();
    this.packages = new Map();
    this.payments = new Map();
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getAllPSB(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      id,
      name: insertCustomer.name,
      phone: insertCustomer.phone,
      address: insertCustomer.address,
      packageId: insertCustomer.packageId,
      status: insertCustomer.status || "active",
      createdAt: new Date(),
      installationDate: insertCustomer.installationDate || new Date()
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    try {
      const customer = this.customers.get(id);
      if (!customer) return undefined;
      const updated = { ...customer, ...updates };
      this.customers.set(id, updated);
      return updated;
    } catch (error) {
      return undefined;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return this.customers.delete(id);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async getAllPackages(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  async createPackage(insertPackage: InsertPackage): Promise<Package> {
    const id = randomUUID();
    const pkg: Package = { 
      id,
      name: insertPackage.name,
      speed: insertPackage.speed,
      price: insertPackage.price,
      description: insertPackage.description || null
    };
    this.packages.set(id, pkg);
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    try {
      const pkg = this.packages.get(id);
      if (!pkg) return undefined;
      const updated = { ...pkg, ...updates };
      this.packages.set(id, updated);
      return updated;
    } catch (error) {
      return undefined;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    return this.packages.delete(id);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getAllPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = randomUUID();
    const payment: Payment = { 
      id,
      customerId: insertPayment.customerId,
      amount: insertPayment.amount,
      paymentDate: insertPayment.paymentDate || new Date(),
      status: insertPayment.status || "pending",
      method: insertPayment.method,
      month: insertPayment.month
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    try {
      const payment = this.payments.get(id);
      if (!payment) return undefined;
      const updated = { ...payment, ...updates };
      this.payments.set(id, updated);
      return updated;
    } catch (error) {
      return undefined;
    }
  }

  async deletePayment(id: string): Promise<boolean> {
    return this.payments.delete(id);
  }
}

import { GoogleSheetStorage } from "./sheets-storage";
import { CustomSheetStorage } from "./custom-sheets-storage";
import { DbStorage } from "./db-storage";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID_PAYMENT;
const USE_GOOGLE_SHEETS = !!SPREADSHEET_ID;

export const storage: IStorage = USE_GOOGLE_SHEETS && SPREADSHEET_ID
  ? new CustomSheetStorage(SPREADSHEET_ID)
  : new MemStorage();

console.log("Storage:", USE_GOOGLE_SHEETS ? "Google Sheets" : "Memory");
