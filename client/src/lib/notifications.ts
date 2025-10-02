import type { Payment, Customer } from "@shared/schema";

export function checkOverduePayments(payments: Payment[], customers: Customer[]) {
  const now = new Date();
  const overduePayments = payments.filter(p => {
    if (p.status === "paid") return false;
    const paymentDate = new Date(p.paymentDate);
    const daysDiff = Math.floor((now.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff > 7;
  });

  return overduePayments.map(p => {
    const customer = customers.find(c => c.id === p.customerId);
    return {
      id: p.id,
      customerName: customer?.name || "Unknown",
      customerPhone: customer?.phone || "",
      amount: p.amount,
      month: p.month,
      daysOverdue: Math.floor((now.getTime() - new Date(p.paymentDate).getTime()) / (1000 * 60 * 60 * 24)),
    };
  });
}

export function getUpcomingPayments(customers: Customer[], packages: any[]) {
  const now = new Date();
  const currentMonth = now.toLocaleString("id-ID", { month: "long", year: "numeric" });
  
  return customers
    .filter(c => c.status === "active")
    .map(c => {
      const pkg = packages.find(p => p.id === c.packageId);
      return {
        customerId: c.id,
        customerName: c.name,
        customerPhone: c.phone,
        amount: pkg?.price || 0,
        month: currentMonth,
      };
    });
}
