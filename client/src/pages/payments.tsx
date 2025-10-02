import { useState } from "react";
import { PaymentTable } from "@/components/payment-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { CreditCard, TrendingUp, AlertCircle } from "lucide-react";

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockPayments = [
    {
      id: "1",
      customerName: "Ahmad Hidayat",
      amount: 300000,
      paymentDate: "15 Feb 2024",
      status: "paid" as const,
      method: "Transfer Bank",
      month: "Februari 2024",
    },
    {
      id: "2",
      customerName: "Siti Nurhaliza",
      amount: 150000,
      paymentDate: "10 Feb 2024",
      status: "paid" as const,
      method: "Tunai",
      month: "Februari 2024",
    },
    {
      id: "3",
      customerName: "Budi Santoso",
      amount: 500000,
      paymentDate: "-",
      status: "pending" as const,
      method: "-",
      month: "Februari 2024",
    },
    {
      id: "4",
      customerName: "Dewi Lestari",
      amount: 300000,
      paymentDate: "-",
      status: "overdue" as const,
      method: "-",
      month: "Januari 2024",
    },
    {
      id: "5",
      customerName: "Eko Prasetyo",
      amount: 150000,
      paymentDate: "18 Feb 2024",
      status: "paid" as const,
      method: "Transfer Bank",
      month: "Februari 2024",
    },
  ];

  const filteredPayments = mockPayments.filter((payment) =>
    payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          value="Rp 45,5 Jt"
          icon={TrendingUp}
          description="Bulan ini"
        />
        <StatsCard
          title="Pembayaran Lunas"
          value="142"
          icon={CreditCard}
          description="Dari 150 pelanggan"
        />
        <StatsCard
          title="Terlambat"
          value="8"
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
