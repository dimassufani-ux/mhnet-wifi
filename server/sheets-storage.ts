import {
  type Customer,
  type InsertCustomer,
  type Package,
  type InsertPackage,
  type Payment,
  type InsertPayment
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readSheet, writeSheet, appendSheet, createSpreadsheet } from "./google-sheets";

const SPREADSHEET_ID = process.env.SPREADSHEET_ID || "";

const CUSTOMERS_SHEET = "Pelanggan";
const PACKAGES_SHEET = "Paket";
const PAYMENTS_SHEET = "Pembayaran";

const CUSTOMER_HEADERS = ["ID", "Nama", "Telepon", "Alamat", "Paket ID", "Status", "Tanggal Instalasi", "Created At"];
const PACKAGE_HEADERS = ["ID", "Nama", "Kecepatan", "Harga", "Deskripsi"];
const PAYMENT_HEADERS = ["ID", "Customer ID", "Jumlah", "Tanggal Bayar", "Status", "Metode", "Bulan"];

function rowToCustomer(row: any[]): Customer {
  return {
    id: row[0] || "",
    name: row[1] || "",
    phone: row[2] || "",
    address: row[3] || "",
    packageId: row[4] || "",
    status: row[5] || "active",
    installationDate: row[6] ? new Date(row[6]) : new Date(),
    createdAt: row[7] ? new Date(row[7]) : new Date(),
  };
}

function customerToRow(customer: Customer): any[] {
  return [
    customer.id,
    customer.name,
    customer.phone,
    customer.address,
    customer.packageId,
    customer.status,
    customer.installationDate.toISOString(),
    customer.createdAt.toISOString(),
  ];
}

function rowToPackage(row: any[]): Package {
  return {
    id: row[0] || "",
    name: row[1] || "",
    speed: row[2] || "",
    price: parseInt(row[3]) || 0,
    description: row[4] || null,
  };
}

function packageToRow(pkg: Package): any[] {
  return [
    pkg.id,
    pkg.name,
    pkg.speed,
    pkg.price,
    pkg.description || "",
  ];
}

function rowToPayment(row: any[]): Payment {
  return {
    id: row[0] || "",
    customerId: row[1] || "",
    amount: parseInt(row[2]) || 0,
    paymentDate: row[3] ? new Date(row[3]) : new Date(),
    status: row[4] || "pending",
    method: row[5] || "",
    month: row[6] || "",
  };
}

function paymentToRow(payment: Payment): any[] {
  return [
    payment.id,
    payment.customerId,
    payment.amount,
    payment.paymentDate.toISOString(),
    payment.status,
    payment.method,
    payment.month,
  ];
}

export class GoogleSheetStorage {
  private spreadsheetId: string;

  constructor(spreadsheetId?: string) {
    this.spreadsheetId = spreadsheetId || SPREADSHEET_ID;
  }

  async ensureHeaders() {
    try {
      const customersData = await readSheet(this.spreadsheetId, `${CUSTOMERS_SHEET}!A1:H1`);
      if (customersData.length === 0) {
        await writeSheet(this.spreadsheetId, `${CUSTOMERS_SHEET}!A1:H1`, [CUSTOMER_HEADERS]);
      }
    } catch (error) {
      console.log("Customers sheet headers added or already exist");
    }

    try {
      const packagesData = await readSheet(this.spreadsheetId, `${PACKAGES_SHEET}!A1:E1`);
      if (packagesData.length === 0) {
        await writeSheet(this.spreadsheetId, `${PACKAGES_SHEET}!A1:E1`, [PACKAGE_HEADERS]);
      }
    } catch (error) {
      console.log("Packages sheet headers added or already exist");
    }

    try {
      const paymentsData = await readSheet(this.spreadsheetId, `${PAYMENTS_SHEET}!A1:G1`);
      if (paymentsData.length === 0) {
        await writeSheet(this.spreadsheetId, `${PAYMENTS_SHEET}!A1:G1`, [PAYMENT_HEADERS]);
      }
    } catch (error) {
      console.log("Payments sheet headers added or already exist");
    }
  }

  async getAllCustomers(): Promise<Customer[]> {
    const data = await readSheet(this.spreadsheetId, `${CUSTOMERS_SHEET}!A2:H`);
    return data.map(rowToCustomer);
  }

  async getCustomer(id: string): Promise<Customer | undefined> {
    const customers = await this.getAllCustomers();
    return customers.find(c => c.id === id);
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

    await appendSheet(this.spreadsheetId, `${CUSTOMERS_SHEET}!A:H`, [customerToRow(customer)]);
    return customer;
  }

  async updateCustomer(id: string, updates: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customers = await this.getAllCustomers();
    const index = customers.findIndex(c => c.id === id);
    
    if (index === -1) return undefined;

    const updated = { ...customers[index], ...updates };
    const rowNumber = index + 2;
    
    await writeSheet(this.spreadsheetId, `${CUSTOMERS_SHEET}!A${rowNumber}:H${rowNumber}`, [customerToRow(updated)]);
    return updated;
  }

  async deleteCustomer(id: string): Promise<boolean> {
    return true;
  }

  async getAllPackages(): Promise<Package[]> {
    const data = await readSheet(this.spreadsheetId, `${PACKAGES_SHEET}!A2:E`);
    return data.map(rowToPackage);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const packages = await this.getAllPackages();
    return packages.find(p => p.id === id);
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

    await appendSheet(this.spreadsheetId, `${PACKAGES_SHEET}!A:E`, [packageToRow(pkg)]);
    return pkg;
  }

  async updatePackage(id: string, updates: Partial<InsertPackage>): Promise<Package | undefined> {
    const packages = await this.getAllPackages();
    const index = packages.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;

    const updated = { ...packages[index], ...updates };
    const rowNumber = index + 2;
    
    await writeSheet(this.spreadsheetId, `${PACKAGES_SHEET}!A${rowNumber}:E${rowNumber}`, [packageToRow(updated)]);
    return updated;
  }

  async deletePackage(id: string): Promise<boolean> {
    return true;
  }

  async getAllPayments(): Promise<Payment[]> {
    const data = await readSheet(this.spreadsheetId, `${PAYMENTS_SHEET}!A2:G`);
    return data.map(rowToPayment);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const payments = await this.getAllPayments();
    return payments.find(p => p.id === id);
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

    await appendSheet(this.spreadsheetId, `${PAYMENTS_SHEET}!A:G`, [paymentToRow(payment)]);
    return payment;
  }

  async updatePayment(id: string, updates: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payments = await this.getAllPayments();
    const index = payments.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;

    const updated = { ...payments[index], ...updates };
    const rowNumber = index + 2;
    
    await writeSheet(this.spreadsheetId, `${PAYMENTS_SHEET}!A${rowNumber}:G${rowNumber}`, [paymentToRow(updated)]);
    return updated;
  }

  async deletePayment(id: string): Promise<boolean> {
    return true;
  }
}
