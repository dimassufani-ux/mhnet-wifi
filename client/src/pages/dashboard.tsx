import { Users, Wifi, CreditCard, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { CustomerTable } from "@/components/customer-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const mockCustomers = [
    {
      id: "1",
      name: "Ahmad Hidayat",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, Jakarta",
      packageName: "Premium 50 Mbps",
      status: "active" as const,
      installationDate: "15 Jan 2024",
    },
    {
      id: "2",
      name: "Siti Nurhaliza",
      phone: "082345678901",
      address: "Jl. Sudirman No. 456, Bandung",
      packageName: "Basic 20 Mbps",
      status: "active" as const,
      installationDate: "20 Jan 2024",
    },
    {
      id: "3",
      name: "Budi Santoso",
      phone: "083456789012",
      address: "Jl. Gatot Subroto No. 789",
      packageName: "Ultra 100 Mbps",
      status: "suspended" as const,
      installationDate: "10 Feb 2024",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Ringkasan data pelanggan dan pembayaran
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pelanggan"
          value="150"
          icon={Users}
          description="Pelanggan aktif"
          trend={{ value: "12%", positive: true }}
        />
        <StatsCard
          title="Koneksi Aktif"
          value="142"
          icon={Wifi}
          description="Sedang online"
          trend={{ value: "5%", positive: true }}
        />
        <StatsCard
          title="Pendapatan Bulan Ini"
          value="Rp 45,5 Jt"
          icon={TrendingUp}
          description="Target 90% tercapai"
          trend={{ value: "8%", positive: true }}
        />
        <StatsCard
          title="Pembayaran Pending"
          value="8"
          icon={CreditCard}
          description="Perlu ditindaklanjuti"
          trend={{ value: "2", positive: false }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pelanggan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomerTable
            customers={mockCustomers}
            onEdit={(customer) => console.log("Edit customer:", customer)}
            onDelete={(customer) => console.log("Delete customer:", customer)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
