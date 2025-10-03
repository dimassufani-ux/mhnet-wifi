import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Plus, Pencil, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@shared/schema";

const MONTHS = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
];

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ paymentStatus: "Belum Lunas", name: "", nickname: "" });
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers", selectedMonth],
    queryFn: () => apiRequest(`/api/customers?month=${selectedMonth}`, "GET"),
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/customers/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Berhasil", description: "Pelanggan berhasil dihapus" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Gagal menghapus pelanggan", variant: "destructive" });
    },
  });

  const filteredCustomers = useMemo(() => customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.nickname && customer.nickname.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [customers, searchQuery]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await apiRequest(`/api/customers/${editingCustomer.id}`, "PUT", formData);
        toast({ title: "Berhasil", description: "Pelanggan berhasil diupdate" });
        setEditingCustomer(null);
      } else {
        await apiRequest("/api/customers", "POST", formData);
        toast({ title: "Berhasil", description: "Pelanggan berhasil ditambahkan" });
        setShowAddDialog(false);
      }
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      setFormData({ paymentStatus: "Belum Lunas", name: "", nickname: "" });
    } catch (error) {
      toast({ title: "Error", description: "Gagal menyimpan data", variant: "destructive" });
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      paymentStatus: customer.paymentStatus,
      name: customer.name,
      nickname: customer.nickname || "",
    });
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div>
          <h1 className="text-3xl font-semibold">Pelanggan</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      )}
      {!isLoading && (<>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Pelanggan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pelanggan WiFi ({customers.length} pelanggan)
          </p>
        </div>
        <div className="flex gap-2">
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
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Pelanggan
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama pelanggan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">Status Pembayaran</th>
              <th className="p-4 text-left font-medium">Nama Pelanggan</th>
              <th className="p-4 text-left font-medium">Nama Panggilan</th>
              <th className="p-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCustomers.map((customer) => (
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
                <td className="p-4 text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(customer)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Hapus ${customer.name}?`)) {
                        deleteMutation.mutate(customer.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Halaman {page} dari {totalPages} ({filteredCustomers.length} pelanggan)
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

      <Dialog open={showAddDialog || !!editingCustomer} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingCustomer(null);
          setFormData({ paymentStatus: "Belum Lunas", name: "", nickname: "" });
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCustomer ? "Edit Pelanggan" : "Tambah Pelanggan Baru"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="paymentStatus">Status Pembayaran</Label>
              <Select
                value={formData.paymentStatus}
                onValueChange={(value) => setFormData({ ...formData, paymentStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lunas">Lunas</SelectItem>
                  <SelectItem value="Belum Lunas">Belum Lunas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Nama Pelanggan</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="nickname">Nama Panggilan (Opsional)</Label>
              <Input
                id="nickname"
                value={formData.nickname}
                onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">
              {editingCustomer ? "Update" : "Tambah"} Pelanggan
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}
