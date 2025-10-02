import { randomUUID } from "crypto";
import { readSheet, writeSheet, appendSheet } from "./google-sheets";
import type { Customer, InsertCustomer, Package, InsertPackage, Payment, InsertPayment } from "@shared/schema";
import type { IStorage } from "./storage";

const SPREADSHEET_ID_PSB = process.env.SPREADSHEET_ID_PSB || "";
const SPREADSHEET_ID_PAYMENT = process.env.SPREADSHEET_ID_PAYMENT || "";

export class CustomSheetStorage implements IStorage {
  private psbSheetId: string;
  private paymentSheetId: string;

  constructor(psbSheetId?: string, paymentSheetId?: string) {
    this.psbSheetId = psbSheetId || SPREADSHEET_ID_PSB;
    this.paymentSheetId = paymentSheetId || SPREADSHEET_ID_PAYMENT;
  }

  // Read customers from DAFTAR PSB MHNET sheet
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const data = await readSheet(this.psbSheetId, `DAFTAR PSB MHNET!A2:D`);
      
      return data.map((row, index) => ({
        id: `customer-${index + 1}`,
        name: row[1] || "",
        phone: row[2] || "",
        address: "",
        packageId: "pkg-1",
        status: "active",
        installationDate: row[3] ? this.parseDate(row[3]) : new Date(),
        createdAt: new Date(),
      }));
    } catch (error) {
      console.error("Error reading customers:", error);
      return [];
    }
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    return new Date();
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const customers = await this.getAllCustomers();
    return customers.find(c => c.id === id);
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    const customers = await this.getAllCustomers();
    const newNo = customers.length + 1;
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    
    const row = [newNo, data.name, data.phone, dateStr];
    await appendSheet(this.psbSheetId, `DAFTAR PSB MHNET!A:D`, [row]);
    
    return {
      id: `customer-${newNo}`,
      name: data.name,
      phone: data.phone,
      address: data.address,
      packageId: data.packageId,
      status: data.status || "active",
      installationDate: data.installationDate || new Date(),
      createdAt: new Date(),
    };
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customers = await this.getAllCustomers();
    const customer = customers.find(c => c.id === id);
    if (!customer) return undefined;
    return { ...customer, ...data };
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return true;
  }

  // Packages - simple in-memory for now
  private packages: Package[] = [
    { id: "pkg-1", name: "Paket Basic", speed: "10 Mbps", price: 150000, description: "Internet rumahan" },
    { id: "pkg-2", name: "Paket Standard", speed: "20 Mbps", price: 250000, description: "Untuk keluarga" },
    { id: "pkg-3", name: "Paket Premium", speed: "50 Mbps", price: 400000, description: "Super cepat" },
  ];

  async getAllPackages(): Promise<Package[]> {
    return this.packages;
  }

  async getPackage(id: string): Promise<Package | undefined> {
    return this.packages.find(p => p.id === id);
  }

  async createPackage(data: InsertPackage): Promise<Package> {
    const pkg: Package = {
      id: randomUUID(),
      name: data.name,
      speed: data.speed,
      price: data.price,
      description: data.description || null,
    };
    this.packages.push(pkg);
    return pkg;
  }

  async updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined> {
    const index = this.packages.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    this.packages[index] = { ...this.packages[index], ...data };
    return this.packages[index];
  }

  async deletePackage(id: string): Promise<boolean> {
    const index = this.packages.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.packages.splice(index, 1);
    return true;
  }

  // Payments - read from monthly sheets
  async getAllPayments(): Promise<Payment[]> {
    const customers = await this.getAllCustomers();
    const currentMonth = new Date().toLocaleString("id-ID", { month: "long" }).toUpperCase();
    const monthName = new Date().toLocaleString("id-ID", { month: "long", year: "numeric" });
    
    try {
      const paymentData = await readSheet(this.paymentSheetId, `${currentMonth}!A2:D`);
      
      return paymentData.map((row, index) => ({
        id: `payment-${index + 1}`,
        customerId: `customer-${index + 1}`,
        amount: 150000,
        paymentDate: new Date(),
        status: row[1] === "Sudah Bayar" ? "paid" : "pending",
        method: "Transfer",
        month: monthName,
      }));
    } catch (error) {
      console.error("Error reading payments:", error);
      return [];
    }
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const payments = await this.getAllPayments();
    return payments.find(p => p.id === id);
  }

  async createPayment(data: InsertPayment): Promise<Payment> {
    return {
      id: randomUUID(),
      customerId: data.customerId,
      amount: data.amount,
      paymentDate: data.paymentDate || new Date(),
      status: data.status || "pending",
      method: data.method,
      month: data.month,
    };
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = await this.getPayment(id);
    if (!payment) return undefined;
    return { ...payment, ...data };
  }

  async deletePayment(id: string): Promise<boolean> {
    return true;
  }
}
