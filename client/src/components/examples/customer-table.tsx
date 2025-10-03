import { CustomerTable } from "../customer-table";

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

export default function CustomerTableExample() {
  return (
    <div className="p-4">
      <CustomerTable
        customers={mockCustomers}
        onEdit={(customer) => console.log("Edit customer:", customer.id)}
        onDelete={(customer) => console.log("Delete customer:", customer.id)}
      />
    </div>
  );
}
