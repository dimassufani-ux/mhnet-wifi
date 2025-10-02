import { PaymentTable } from "../payment-table";

const mockPayments = [
  {
    id: "1",
    customerName: "Ahmad Hidayat",
    amount: 300000,
    paymentDate: "15 Feb 2024",
    status: "paid" as const,
    method: "Transfer Bank",
    month: "Februari 2024",
  },
  {
    id: "2",
    customerName: "Siti Nurhaliza",
    amount: 150000,
    paymentDate: "10 Feb 2024",
    status: "paid" as const,
    method: "Tunai",
    month: "Februari 2024",
  },
  {
    id: "3",
    customerName: "Budi Santoso",
    amount: 500000,
    paymentDate: "-",
    status: "pending" as const,
    method: "-",
    month: "Februari 2024",
  },
  {
    id: "4",
    customerName: "Dewi Lestari",
    amount: 300000,
    paymentDate: "-",
    status: "overdue" as const,
    method: "-",
    month: "Januari 2024",
  },
];

export default function PaymentTableExample() {
  return (
    <div className="p-4">
      <PaymentTable payments={mockPayments} />
    </div>
  );
}
