import { useState } from "react";
import { CustomerTable } from "@/components/customer-table";
import { AddCustomerDialog } from "@/components/add-customer-dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");

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
    {
      id: "4",
      name: "Dewi Lestari",
      phone: "084567890123",
      address: "Jl. Ahmad Yani No. 321",
      packageName: "Premium 50 Mbps",
      status: "active" as const,
      installationDate: "25 Jan 2024",
    },
    {
      id: "5",
      name: "Eko Prasetyo",
      phone: "085678901234",
      address: "Jl. Diponegoro No. 654",
      packageName: "Basic 20 Mbps",
      status: "disconnected" as const,
      installationDate: "05 Feb 2024",
    },
  ];

  const mockPackages = [
    { id: "1", name: "Basic", speed: "20 Mbps", price: 150000 },
    { id: "2", name: "Premium", speed: "50 Mbps", price: 300000 },
    { id: "3", name: "Ultra", speed: "100 Mbps", price: 500000 },
  ];

  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Pelanggan</h1>
          <p className="text-muted-foreground mt-1">
            Kelola data pelanggan WiFi
          </p>
        </div>
        <AddCustomerDialog
          packages={mockPackages}
          onSubmit={(data) => console.log("Customer submitted:", data)}
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
        onDelete={(customer) => console.log("Delete customer:", customer)}
      />
    </div>
  );
}
