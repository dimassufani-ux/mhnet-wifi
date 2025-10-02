import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CustomerTable } from "@/components/customer-table";
import { AddCustomerDialog } from "@/components/add-customer-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Customer, Package } from "@shared/schema";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const { data: customers = [], isLoading: loadingCustomers } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/customers/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Berhasil",
        description: "Pelanggan berhasil dihapus",
      });
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
        customers={filteredCustomers}
        onEdit={(customer) => console.log("Edit customer:", customer)}
        onDelete={(customer) => {
          if (confirm(`Hapus pelanggan ${customer.name}?`)) {
            deleteMutation.mutate(customer.id);
          }
        }}
      />
    </div>
  );
}
