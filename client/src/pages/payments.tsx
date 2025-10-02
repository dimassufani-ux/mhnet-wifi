import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PaymentTable } from "@/components/payment-table";
import { EditPaymentDialog } from "@/components/edit-payment-dialog";
import { AddPaymentDialog } from "@/components/add-payment-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StatsCard } from "@/components/stats-card";
import { CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { exportPaymentsToCSV, exportPaymentsToPDF } from "@/lib/export-utils";
import type { Payment, Customer } from "@shared/schema";

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data: payments = [], isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/payments", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Berhasil", description: "Pembayaran berhasil dicatat" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/payments/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Berhasil", description: "Pembayaran berhasil diupdate" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/payments/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/payments"] });
      toast({ title: "Berhasil", description: "Pembayaran berhasil dihapus" });
    },
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    refetchInterval: 30000,
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

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => exportPaymentsToCSV(payments, customers)}>
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportPaymentsToPDF(payments, customers)}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddPaymentDialog customers={customers} onSubmit={(data) => createMutation.mutate(data)} />
        </div>
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

      <PaymentTable
        payments={paginatedPayments}
        onEdit={(payment) => setEditingPayment(payments.find(p => p.id === payment.id) || null)}
        onDelete={(payment) => {
          if (confirm(`Hapus pembayaran ${payment.customerName}?`)) {
            deleteMutation.mutate(payment.id);
          }
        }}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredPayments.length} pembayaran)
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {payments.length > 0 && (
        <EditPaymentDialog
          payment={editingPayment || payments[0]}
          open={!!editingPayment}
          onOpenChange={(open) => !open && setEditingPayment(null)}
          onSubmit={(data) => {
            if (editingPayment) {
              updateMutation.mutate({ id: editingPayment.id, data });
              setEditingPayment(null);
            }
          }}
        />
      )}
    </div>
  );
}
