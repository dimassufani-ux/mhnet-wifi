import { randomUUID } from "crypto";
import { readSheet, writeSheet, appendSheet } from "./google-sheets";
import type { Customer, InsertCustomer, Package, InsertPackage, Payment, InsertPayment } from "@shared/schema";
import type { IStorage } from "./storage";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID_PAYMENT || "";

export class CustomSheetStorage implements IStorage {
  private sheetId: string;

  constructor(sheetId?: string) {
    this.sheetId = sheetId || SPREADSHEET_ID;
  }

  // Read customers from payment sheet
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const data = await readSheet(this.sheetId, `OKTOBER!A2:C`);
      
      return data.map((row) => ({
        id: `customer-${row[0]}`,
        name: row[2] || "",
        phone: "",
        address: "",
        packageId: "pkg-1",
        status: "active",
        installationDate: new Date(),
        createdAt: new Date(),
      }));
    } catch (error) {
      console.error("Error reading customers:", error);
      return [];
    }
  }

  // Read PSB from DAFTAR PSB MHNET sheet
  async getAllPSB(): Promise<Customer[]> {
    try {
      const psbSheetId = process.env.SPREADSHEET_ID_PSB || "";
      if (!psbSheetId) return [];
      
      const data = await readSheet(psbSheetId, `OKTOBER!A2:D`);
      
      return data.map((row) => ({
        id: `psb-${row[0]}`,
        name: row[1] || "",
        phone: row[2] || "",
        address: "",
        packageId: "pkg-1",
        status: "active",
        installationDate: row[3] ? this.parseDate(row[3]) : new Date(),
        createdAt: new Date(),
      }));
    } catch (error) {
      console.error("Error reading PSB:", error);
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
    try {
      const customers = await this.getAllCustomers();
      return customers.find(c => c.id === id);
    } catch (error) {
      return undefined;
    }
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    try {
      const customers = await this.getAllCustomers();
      const newNo = customers.length + 1;
      const today = new Date();
      const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
      
      const row = [newNo, "-", data.name];
      await appendSheet(this.sheetId, `OKTOBER!A:C`, [row]);
      
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
    } catch (error) {
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    try {
      const customers = await this.getAllCustomers();
      const customer = customers.find(c => c.id === id);
      if (!customer) return undefined;
      return { ...customer, ...data };
    } catch (error) {
      return undefined;
    }
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
    try {
      return this.packages.find(p => p.id === id);
    } catch (error) {
      return undefined;
    }
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
    try {
      const index = this.packages.findIndex(p => p.id === id);
      if (index === -1) return undefined;
      this.packages[index] = { ...this.packages[index], ...data };
      return this.packages[index];
    } catch (error) {
      return undefined;
    }
  }

  async deletePackage(id: string): Promise<boolean> {
    const index = this.packages.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.packages.splice(index, 1);
    return true;
  }

  // Payments - read from monthly sheets
  async getAllPayments(): Promise<Payment[]> {
    try {
      const paymentData = await readSheet(this.sheetId, `OKTOBER!A2:C`);
      
      return paymentData.map((row) => {
        const customerNo = row[0];
        const customerName = row[2] || "";
        const paymentStatus = row[1];
        
        return {
          id: `payment-${customerNo}-OKTOBER`,
          customerId: `customer-${customerNo}`,
          amount: 150000,
          paymentDate: new Date(),
          status: paymentStatus === "Sudah Bayar" ? "paid" : "pending",
          method: "Transfer",
          month: "Oktober 2025",
        };
      });
    } catch (error) {
      console.error("Error reading payments:", error);
      return [];
    }
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    try {
      const payments = await this.getAllPayments();
      return payments.find(p => p.id === id);
    } catch (error) {
      return undefined;
    }
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
    try {
      const payment = await this.getPayment(id);
      if (!payment) return undefined;
      return { ...payment, ...data };
    } catch (error) {
      return undefined;
    }
  }

  async deletePayment(id: string): Promise<boolean> {
    return true;
  }
}
