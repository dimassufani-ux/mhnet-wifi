import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ChevronLeft, ChevronRight, Plus, Trash2 } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PSB } from "@shared/schema";

const MONTHS = [
  "JANUARI", "FEBRUARI", "MARET", "APRIL", "MEI", "JUNI",
  "JULI", "AGUSTUS", "SEPTEMBER", "OKTOBER", "NOVEMBER", "DESEMBER"
];

export default function PSBPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", joinDate: "" });
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data: psbList = [], isLoading } = useQuery<PSB[]>({
    queryKey: ["/api/psb", selectedMonth],
    queryFn: () => apiRequest(`/api/psb?month=${selectedMonth}`, "GET"),
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/psb/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/psb"] });
      toast({ title: "Berhasil", description: "Data PSB berhasil dihapus" });
    },
    onError: (error) => {
      toast({ title: "Error", description: "Gagal menghapus data PSB", variant: "destructive" });
    },
  });

  const filteredPSB = useMemo(() => psbList.filter((psb) =>
    psb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    psb.phone.includes(searchQuery)
  ), [psbList, searchQuery]);

  const totalPages = Math.ceil(filteredPSB.length / itemsPerPage);
  const paginatedPSB = filteredPSB.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleAddPSB = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/api/psb", "POST", formData);
      queryClient.invalidateQueries({ queryKey: ["/api/psb"] });
      toast({ title: "Berhasil", description: "Data PSB berhasil ditambahkan" });
      setShowAddDialog(false);
      setFormData({ name: "", phone: "", joinDate: "" });
    } catch (error) {
      toast({ title: "Error", description: "Gagal menambahkan data PSB", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {isLoading && (
        <div>
          <h1 className="text-3xl font-semibold">PSB (Pemasangan Baru)</h1>
          <p className="text-muted-foreground mt-1">Loading...</p>
        </div>
      )}
      {!isLoading && (<>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">PSB (Pemasangan Baru)</h1>
          <p className="text-muted-foreground mt-1">
            Daftar calon pelanggan baru ({psbList.length} calon pelanggan)
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
            Tambah PSB
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari nama atau no HP..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="p-4 text-left font-medium">Nama</th>
              <th className="p-4 text-left font-medium">No HP</th>
              <th className="p-4 text-left font-medium">Tanggal Bergabung</th>
              <th className="p-4 text-right font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPSB.map((psb) => (
              <tr key={psb.id} className="border-b">
                <td className="p-4">{psb.name}</td>
                <td className="p-4">{psb.phone}</td>
                <td className="p-4">
                  {new Date(psb.joinDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`Hapus ${psb.name}?`)) {
                        deleteMutation.mutate(psb.id);
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
            Halaman {page} dari {totalPages} ({filteredPSB.length} calon pelanggan)
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

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah PSB Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddPSB} className="space-y-4">
            <div>
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">No HP</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="joinDate">Tanggal Bergabung</Label>
              <Input
                id="joinDate"
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Tambah PSB
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      </>
      )}
    </div>
  );
}
