import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CustomerTable } from "@/components/customer-table";
import { AddCustomerDialog } from "@/components/add-customer-dialog";
import { EditCustomerDialog } from "@/components/edit-customer-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { exportCustomersToCSV, exportCustomersToPDF } from "@/lib/export-utils";
import type { Customer, Package } from "@shared/schema";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { toast } = useToast();
  const itemsPerPage = 10;

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    refetchInterval: 30000,
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/customers/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Berhasil", description: "Pelanggan berhasil dihapus" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/customers/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({ title: "Berhasil", description: "Pelanggan berhasil diupdate" });
    },
  });

  const customersWithPackageNames = customers.map(customer => {
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

  const filteredCustomers = customersWithPackageNames.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (loadingCustomers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Pelanggan</h1>
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
          <h1 className="text-3xl font-semibold">Pelanggan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pelanggan WiFi ({customers.length} pelanggan)
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
              <DropdownMenuItem onClick={() => exportCustomersToCSV(customers, packages)}>
                Export CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportCustomersToPDF(customers, packages)}>
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AddCustomerDialog
          packages={packages}
          onSubmit={(data) => {
            apiRequest("/api/customers", "POST", data).then(() => {
              queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
              toast({
                title: "Berhasil",
                description: "Pelanggan baru berhasil ditambahkan",
              });
            });
          }}
        />
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari pelanggan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-customer"
        />
      </div>

      <CustomerTable
        customers={paginatedCustomers}
        onEdit={(customer) => setEditingCustomer(customers.find(c => c.id === customer.id) || null)}
        onDelete={(customer) => {
          if (confirm(`Hapus pelanggan ${customer.name}?`)) {
            deleteMutation.mutate(customer.id);
          }
        }}
      />

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

      {customers.length > 0 && (
        <EditCustomerDialog
          customer={editingCustomer || customers[0]}
          packages={packages}
          open={!!editingCustomer}
          onOpenChange={(open) => !open && setEditingCustomer(null)}
          onSubmit={(data) => {
            if (editingCustomer) {
              updateMutation.mutate({ id: editingCustomer.id, data });
              setEditingCustomer(null);
            }
          }}
        />
      )}
    </div>
  );
}
