import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Customer, Package, Payment } from "@shared/schema";

export function exportCustomersToCSV(customers: Customer[], packages: Package[]) {
  const headers = ["Nama", "Telepon", "Alamat", "Paket", "Status", "Tanggal Instalasi"];
  const rows = customers.map(c => {
    const pkg = packages.find(p => p.id === c.packageId);
    return [
      c.name,
      c.phone,
      c.address,
      pkg ? `${pkg.name} ${pkg.speed}` : "Unknown",
      c.status,
      new Date(c.installationDate).toLocaleDateString("id-ID"),
    ];
  });

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  downloadFile(csv, "pelanggan.csv", "text/csv");
}

export function exportCustomersToPDF(customers: Customer[], packages: Package[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Data Pelanggan MHNET WiFi", 14, 15);
  
  const tableData = customers.map(c => {
    const pkg = packages.find(p => p.id === c.packageId);
    return [
      c.name,
      c.phone,
      pkg ? `${pkg.name} ${pkg.speed}` : "Unknown",
      c.status,
      new Date(c.installationDate).toLocaleDateString("id-ID"),
    ];
  });

  autoTable(doc, {
    head: [["Nama", "Telepon", "Paket", "Status", "Tgl Instalasi"]],
    body: tableData,
    startY: 25,
  });

  doc.save("pelanggan.pdf");
}

export function exportPaymentsToCSV(payments: Payment[], customers: Customer[]) {
  const headers = ["Pelanggan", "Bulan", "Jumlah", "Tanggal Bayar", "Metode", "Status"];
  const rows = payments.map(p => {
    const customer = customers.find(c => c.id === p.customerId);
    return [
      customer?.name || "Unknown",
      p.month,
      p.amount,
      new Date(p.paymentDate).toLocaleDateString("id-ID"),
      p.method,
      p.status,
    ];
  });

  const csv = [headers, ...rows].map(row => row.join(",")).join("\n");
  downloadFile(csv, "pembayaran.csv", "text/csv");
}

export function exportPaymentsToPDF(payments: Payment[], customers: Customer[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text("Data Pembayaran MHNET WiFi", 14, 15);
  
  const tableData = payments.map(p => {
    const customer = customers.find(c => c.id === p.customerId);
    return [
      customer?.name || "Unknown",
      p.month,
      `Rp ${p.amount.toLocaleString("id-ID")}`,
      new Date(p.paymentDate).toLocaleDateString("id-ID"),
      p.status,
    ];
  });

  autoTable(doc, {
    head: [["Pelanggan", "Bulan", "Jumlah", "Tgl Bayar", "Status"]],
    body: tableData,
    startY: 25,
  });

  doc.save("pembayaran.pdf");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
