import { useQuery } from "@tanstack/react-query";
import { Users, Wifi, CreditCard, TrendingUp, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { CustomerTable } from "@/components/customer-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkOverduePayments } from "@/lib/notifications";
import type { Customer, Package, Payment } from "@shared/schema";

export default function Dashboard() {
  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    refetchInterval: 30000, // Auto refresh setiap 30 detik
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    refetchInterval: 30000,
  });

  const { data: payments = [] } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    refetchInterval: 30000,
  });

  const customersWithPackageNames = customers.slice(0, 5).map(customer => {
    const pkg = packages.find(p => p.id === customer.packageId);
    return {
      ...customer,
      packageName: pkg ? `${pkg.name} ${pkg.speed}` : "Unknown",
      installationDate: new Date(customer.installationDate).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };
  });

  const activeCustomers = customers.filter(c => c.status === "active").length;
  const totalRevenue = payments
    .filter(p => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = payments.filter(p => p.status === "pending" || p.status === "overdue").length;

  const formatCurrency = (amount: number) => {
    return `Rp ${(amount / 1000000).toFixed(1)} Jt`;
  };

  const overduePayments = checkOverduePayments(payments, customers);

  if (loadingCustomers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Ringkasan data pelanggan dan pembayaran
        </p>
      </div>

      {overduePayments.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Pembayaran Terlambat</AlertTitle>
          <AlertDescription>
            Ada {overduePayments.length} pembayaran yang terlambat. Segera tindak lanjuti.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pelanggan"
          value={customers.length.toString()}
          icon={Users}
          description="Pelanggan terdaftar"
        />
        <StatsCard
          title="Koneksi Aktif"
          value={activeCustomers.toString()}
          icon={Wifi}
          description="Sedang online"
        />
        <StatsCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(totalRevenue)}
          icon={TrendingUp}
          description={`Dari ${payments.length} transaksi`}
        />
        <StatsCard
          title="Pembayaran Pending"
          value={pendingPayments.toString()}
          icon={CreditCard}
          description="Perlu ditindaklanjuti"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pelanggan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {customersWithPackageNames.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada pelanggan. Tambahkan pelanggan pertama Anda.
            </p>
          ) : (
            <CustomerTable
              customers={customersWithPackageNames}
              onEdit={(customer) => console.log("Edit customer:", customer)}
              onDelete={(customer) => console.log("Delete customer:", customer)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
