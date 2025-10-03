import { 
  type Customer, 
  type InsertCustomer,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getCustomer(id: string): Promise<Customer | undefined>;
  getAllCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<boolean>;

  getAllPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private customers: Map<string, Customer>;
  private payments: Map<string, Payment>;

  constructor() {
    this.customers = new Map();
    this.payments = new Map();
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getAllCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }



  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const customer: Customer = { 
      id,
      paymentStatus: insertCustomer.paymentStatus || "Belum Lunas",
      name: insertCustomer.name,
      nickname: insertCustomer.nickname || null,
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
