import { PackageCard } from "@/components/package-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Packages() {
  const mockPackages = [
    {
      id: "1",
      name: "Basic",
      speed: "20 Mbps",
      price: 150000,
      description: "Cocok untuk browsing dan streaming",
      customerCount: 45,
    },
    {
      id: "2",
      name: "Premium",
      speed: "50 Mbps",
      price: 300000,
      description: "Untuk keluarga dan gaming",
      customerCount: 78,
    },
    {
      id: "3",
      name: "Ultra",
      speed: "100 Mbps",
      price: 500000,
      description: "Kecepatan maksimal untuk bisnis",
      customerCount: 27,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Paket WiFi</h1>
          <p className="text-muted-foreground mt-1">
            Kelola paket internet yang tersedia
          </p>
        </div>
        <Button data-testid="button-add-package">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockPackages.map((pkg) => (
          <PackageCard
            key={pkg.id}
            name={pkg.name}
            speed={pkg.speed}
            price={pkg.price}
            description={pkg.description}
            customerCount={pkg.customerCount}
            onEdit={() => console.log("Edit package:", pkg.name)}
          />
        ))}
      </div>
    </div>
  );
}
