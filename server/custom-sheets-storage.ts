import { randomUUID } from "crypto";
import { readSheet, writeSheet, appendSheet, deleteRows } from "./google-sheets";
import type { Customer, InsertCustomer, PSB, InsertPSB, Payment, InsertPayment } from "@shared/schema";
import type { IStorage } from "./storage";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID_PAYMENT || "";
const PSB_SPREADSHEET_ID = process.env.SPREADSHEET_ID_PSB || "";

export class CustomSheetStorage implements IStorage {
  private sheetId: string;
  private psbSheetId: string;
  public currentMonth: string;

  constructor(sheetId?: string, month?: string) {
    this.sheetId = sheetId || SPREADSHEET_ID;
    this.psbSheetId = PSB_SPREADSHEET_ID;
    this.currentMonth = month || new Date().toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();
  }

  setMonth(month: string) {
    this.currentMonth = month;
  }

  // ===== CUSTOMERS (Sheet "Pelanggan") =====
  // Format: Status Pembayaran | Nama Pelanggan | Nama Panggilan
  
  async getAllCustomers(): Promise<Customer[]> {
    try {
      const data = await readSheet(this.sheetId, `${this.currentMonth}!A2:C`);
      
      return data.map((row, index) => ({
        id: `customer-${index + 1}`,
        paymentStatus: row[0] || "Belum Lunas",
        name: row[1] || "",
        nickname: row[2] || null,
      }));
    } catch (error) {
      console.error("Error reading customers:", error);
      return [];
    }
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    try {
      const customers = await this.getAllCustomers();
      return customers.find(c => c.id === id);
    } catch (error) {
      console.error("Error getting customer:", error);
      return undefined;
    }
  }

  async createCustomer(data: InsertCustomer): Promise<Customer> {
    try {
      const row = [
        data.paymentStatus || "Belum Lunas",
        data.name,
        data.nickname || ""
      ];
      
      await appendSheet(this.sheetId, `${this.currentMonth}!A:C`, [row]);
      
      const customers = await this.getAllCustomers();
      return customers[customers.length - 1];
    } catch (error) {
      console.error("Error creating customer:", error);
      throw new Error('Failed to create customer');
    }
  }

  async updateCustomer(id: string, data: Partial<InsertCustomer>): Promise<Customer | undefined> {
    try {
      const customers = await this.getAllCustomers();
      const index = customers.findIndex(c => c.id === id);
      
      if (index === -1) return undefined;

      const updated = { ...customers[index], ...data };
      const rowNumber = index + 2;
      
      const row = [
        updated.paymentStatus,
        updated.name,
        updated.nickname || ""
      ];
      
      await writeSheet(this.sheetId, `${this.currentMonth}!A${rowNumber}:C${rowNumber}`, [row]);
      return updated;
    } catch (error) {
      console.error("Error updating customer:", error);
      return undefined;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const customers = await this.getAllCustomers();
      const index = customers.findIndex(c => c.id === id);
      
      if (index === -1) return false;

      const startIndex = index + 1;
      const endIndex = startIndex + 1;
      await deleteRows(this.sheetId, this.currentMonth, startIndex, endIndex);
      
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  }

  // ===== PSB (Sheet "PSB") =====
  // Format: Nama | No HP | Tanggal Bergabung
  
  async getAllPSB(): Promise<PSB[]> {
    try {
      if (!this.psbSheetId) {
        console.warn("PSB Spreadsheet ID not configured");
        return [];
      }
      
      const data = await readSheet(this.psbSheetId, `${this.currentMonth}!A2:C`);
      
      return data.map((row, index) => ({
        id: `psb-${index + 1}`,
        name: row[0] || "",
        phone: row[1] || "",
        joinDate: row[2] ? this.parseDate(row[2]) : new Date(),
      }));
    } catch (error) {
      console.error("Error reading PSB:", error);
      return [];
    }
  }

  async getPSB(id: string): Promise<PSB | undefined> {
    try {
      const psbList = await this.getAllPSB();
      return psbList.find(p => p.id === id);
    } catch (error) {
      console.error("Error getting PSB:", error);
      return undefined;
    }
  }

  async createPSB(data: InsertPSB): Promise<PSB> {
    try {
      if (!this.psbSheetId) {
        throw new Error("PSB Spreadsheet ID not configured");
      }

      const joinDate = data.joinDate || new Date();
      const dateStr = this.formatDate(joinDate);
      
      const row = [
        data.name,
        data.phone,
        dateStr
      ];
      
      await appendSheet(this.psbSheetId, `${this.currentMonth}!A:C`, [row]);
      
      const psbList = await this.getAllPSB();
      return psbList[psbList.length - 1];
    } catch (error) {
      console.error("Error creating PSB:", error);
      throw new Error('Failed to create PSB');
    }
  }

  async updatePSB(id: string, data: Partial<InsertPSB>): Promise<PSB | undefined> {
    try {
      if (!this.psbSheetId) return undefined;

      const psbList = await this.getAllPSB();
      const index = psbList.findIndex(p => p.id === id);
      
      if (index === -1) return undefined;

      const updated = { ...psbList[index], ...data };
      const rowNumber = index + 2;
      
      const row = [
        updated.name,
        updated.phone,
        this.formatDate(updated.joinDate)
      ];
      
      await writeSheet(this.psbSheetId, `${this.currentMonth}!A${rowNumber}:C${rowNumber}`, [row]);
      return updated;
    } catch (error) {
      console.error("Error updating PSB:", error);
      return undefined;
    }
  }

  async deletePSB(id: string): Promise<boolean> {
    try {
      if (!this.psbSheetId) return false;

      const psbList = await this.getAllPSB();
      const index = psbList.findIndex(p => p.id === id);
      
      if (index === -1) return false;

      const startIndex = index + 1;
      const endIndex = startIndex + 1;
      await deleteRows(this.psbSheetId, this.currentMonth, startIndex, endIndex);
      
      return true;
    } catch (error) {
      console.error("Error deleting PSB:", error);
      return false;
    }
  }

  // ===== PAYMENTS =====
  async getAllPayments(): Promise<Payment[]> {
    // Payments bisa dibaca dari status pembayaran di sheet Pelanggan
    try {
      const customers = await this.getAllCustomers();
      
      return customers.map(customer => ({
        id: `payment-${customer.id}`,
        customerId: customer.id,
        amount: 0,
        paymentDate: new Date(),
        status: customer.paymentStatus === "Lunas" ? "paid" : "pending",
        method: "Transfer",
        month: new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
      }));
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

  // ===== HELPER FUNCTIONS =====
  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    
    // Try parsing DD/MM/YYYY format
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }
    
    // Fallback to default Date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  }

  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
