import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PaymentTable } from "@/components/payment-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import type { Payment, Customer } from "@shared/schema";

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const paymentsWithCustomerNames = payments.map(payment => {
    const customer = customers.find(c => c.id === payment.customerId);
    return {
      ...payment,
      customerName: customer?.name || "Unknown",
      paymentDate: new Date(payment.paymentDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });

  const filteredPayments = paymentsWithCustomerNames.filter((payment) =>
    payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRevenue = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const paidCount = payments.filter(p => p.status === "paid").length;
  const overdueCount = payments.filter(p => p.status === "overdue").length;

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Pembayaran</h1>
            <p className="text-muted-foreground mt-1">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Pembayaran</h1>
          <p className="text-muted-foreground mt-1">
            Kelola pembayaran dan tagihan pelanggan
          </p>
        </div>
        <Button data-testid="button-add-payment">
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Pendapatan"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          description="Bulan ini"
        />
        <StatsCard
          title="Pembayaran Lunas"
          value={paidCount.toString()}
          icon={CreditCard}
          description={`Dari ${payments.length} pembayaran`}
        />
        <StatsCard
          title="Terlambat"
          value={overdueCount.toString()}
          icon={AlertCircle}
          description="Perlu ditindaklanjuti"
        />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pembayaran..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-payment"
        />
      </div>

      <PaymentTable payments={filteredPayments} />
    </div>
  );
}
