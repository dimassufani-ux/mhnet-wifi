import { useQuery } from "@tanstack/react-query";
import { PackageCard } from "@/components/package-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import type { Package, Customer } from "@shared/schema";

export default function Packages() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
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
        <Button data-testid="button-add-package">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
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
              onEdit={() => console.log("Edit package:", pkg.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
