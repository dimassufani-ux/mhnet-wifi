import { AddCustomerDialog } from "../add-customer-dialog";

const mockPackages = [
  { id: "1", name: "Basic", speed: "20 Mbps", price: 150000 },
  { id: "2", name: "Premium", speed: "50 Mbps", price: 300000 },
  { id: "3", name: "Ultra", speed: "100 Mbps", price: 500000 },
];

export default function AddCustomerDialogExample() {
  return (
    <div className="p-4">
      <AddCustomerDialog
        packages={mockPackages}
        onSubmit={(data) => console.log("Customer submitted:", data)}
      />
    </div>
  );
}
