import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Customer, PSB } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

const MONTHS = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
];

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers", selectedMonth],
    queryFn: () => apiRequest(`/api/customers?month=${selectedMonth}`, "GET"),
    refetchInterval: 30000,
  });

  const { data: psbList = [], isLoading: loadingPSB } = useQuery<PSB[]>({
    queryKey: ["/api/psb", selectedMonth],
    queryFn: () => apiRequest(`/api/psb?month=${selectedMonth}`, "GET"),
    refetchInterval: 30000,
  });

  const lunas = customers.filter(c => c.paymentStatus === "Lunas").length;
  const belumLunas = customers.filter(c => c.paymentStatus === "Belum Lunas").length;
  const isLoading = loadingCustomers || loadingPSB;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Ringkasan data pelanggan WiFi</p>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((month) => (
              <SelectItem key={month} value={month}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Pelanggan"
          value={customers.length.toString()}
          icon={Users}
          description="Pelanggan terdaftar"
        />
        <StatsCard
          title="Sudah Lunas"
          value={lunas.toString()}
          icon={CheckCircle}
          description="Pembayaran lunas"
        />
        <StatsCard
          title="Belum Lunas"
          value={belumLunas.toString()}
          icon={XCircle}
          description="Perlu ditindaklanjuti"
        />
        <StatsCard
          title="Calon Pelanggan (PSB)"
          value={psbList.length.toString()}
          icon={UserPlus}
          description="Pemasangan baru"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pelanggan Terbaru</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Belum ada pelanggan untuk bulan {selectedMonth}
            </p>
          ) : (
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Nama</th>
                    <th className="p-4 text-left font-medium">Nama Panggilan</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 5).map((customer) => (
                    <tr key={customer.id} className="border-b">
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.paymentStatus === "Lunas" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {customer.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">{customer.name}</td>
                      <td className="p-4 text-muted-foreground">{customer.nickname || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {isLoading && (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Loading...</p>
          </div>
        </div>
      )}
      {!isLoading && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">Ringkasan data pelanggan WiFi</p>
            </div>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Pelanggan"
              value={customers.length.toString()}
              icon={Users}
              description="Pelanggan terdaftar"
            />
            <StatsCard
              title="Sudah Lunas"
              value={lunas.toString()}
              icon={CheckCircle}
              description="Pembayaran lunas"
            />
            <StatsCard
              title="Belum Lunas"
              value={belumLunas.toString()}
              icon={XCircle}
              description="Perlu ditindaklanjuti"
            />
            <StatsCard
              title="Calon Pelanggan (PSB)"
              value={psbList.length.toString()}
              icon={UserPlus}
              description="Pemasangan baru"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pelanggan Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              {customers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Belum ada pelanggan untuk bulan {selectedMonth}
                </p>
              ) : (
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-4 text-left font-medium">Status</th>
                        <th className="p-4 text-left font-medium">Nama</th>
                        <th className="p-4 text-left font-medium">Nama Panggilan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.slice(0, 5).map((customer) => (
                        <tr key={customer.id} className="border-b">
                          <td className="p-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              customer.paymentStatus === "Lunas" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {customer.paymentStatus}
                            </span>
                          </td>
                          <td className="p-4">{customer.name}</td>
                          <td className="p-4 text-muted-foreground">{customer.nickname || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
