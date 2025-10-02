import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Payment {
  id: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  status: "paid" | "pending" | "overdue";
  method: string;
  month: string;
}

interface PaymentTableProps {
  payments: Payment[];
}

export function PaymentTable({ payments }: PaymentTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-chart-2 text-white";
      case "pending":
        return "bg-chart-3 text-white";
      case "overdue":
        return "bg-destructive text-white";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "Lunas";
      case "pending":
        return "Pending";
      case "overdue":
        return "Terlambat";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pelanggan</TableHead>
            <TableHead>Bulan</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead>Tgl Bayar</TableHead>
            <TableHead>Metode</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                Belum ada pembayaran
              </TableCell>
            </TableRow>
          ) : (
            payments.map((payment) => (
              <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                <TableCell className="font-medium">{payment.customerName}</TableCell>
                <TableCell>{payment.month}</TableCell>
                <TableCell className="font-semibold tabular-nums">{formatPrice(payment.amount)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{payment.paymentDate}</TableCell>
                <TableCell className="text-sm">{payment.method}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)} data-testid={`badge-status-${payment.id}`}>
                    {getStatusText(payment.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
