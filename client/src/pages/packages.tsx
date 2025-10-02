import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PackageCard } from "@/components/package-card";
import { EditPackageDialog } from "@/components/edit-package-dialog";
import { AddPackageDialog } from "@/components/add-package-dialog";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Package, Customer } from "@shared/schema";

export default function Packages() {
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const { toast } = useToast();
  
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    refetchInterval: 30000,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/packages", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Berhasil", description: "Paket berhasil ditambahkan" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => apiRequest(`/api/packages/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      toast({ title: "Berhasil", description: "Paket berhasil diupdate" });
    },
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
    refetchInterval: 30000,
  });

  const packagesWithCount = packages.map(pkg => ({
    ...pkg,
    customerCount: customers.filter(c => c.packageId === pkg.id).length,
  }));

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Paket WiFi</h1>
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
          <h1 className="text-3xl font-semibold">Paket WiFi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola paket internet yang tersedia ({packages.length} paket)
          </p>
        </div>
        <AddPackageDialog onSubmit={(data) => createMutation.mutate(data)} />
      </div>

      {packagesWithCount.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Belum ada paket. Tambahkan paket pertama Anda.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {packagesWithCount.map((pkg) => (
            <PackageCard
              key={pkg.id}
              name={pkg.name}
              speed={pkg.speed}
              price={pkg.price}
              description={pkg.description || undefined}
              customerCount={pkg.customerCount}
              onEdit={() => setEditingPackage(packages.find(p => p.id === pkg.id) || null)}
            />
          ))}
        </div>
      )}

      {packages.length > 0 && (
        <EditPackageDialog
          package={editingPackage || packages[0]}
          open={!!editingPackage}
          onOpenChange={(open) => !open && setEditingPackage(null)}
          onSubmit={(data) => {
            if (editingPackage) {
              updateMutation.mutate({ id: editingPackage.id, data });
              setEditingPackage(null);
            }
          }}
        />
      )}
    </div>
  );
}
