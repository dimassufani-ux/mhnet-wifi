import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Payment {
  id: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  status: string;
  method: string;
  month: string;
}

interface PaymentTableProps {
  payments: Payment[];
  onEdit?: (payment: Payment) => void;
  onDelete?: (payment: Payment) => void;
}

export function PaymentTable({ payments, onEdit, onDelete }: PaymentTableProps) {
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
            <TableHead className="hidden sm:table-cell">Bulan</TableHead>
            <TableHead>Jumlah</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Bayar</TableHead>
            <TableHead className="hidden lg:table-cell">Metode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{payment.customerName}</span>
                    <span className="sm:hidden text-xs text-muted-foreground">{payment.month}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{payment.month}</TableCell>
                <TableCell className="font-semibold tabular-nums">{formatPrice(payment.amount)}</TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{payment.paymentDate}</TableCell>
                <TableCell className="hidden lg:table-cell text-sm">{payment.method}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(payment.status)} data-testid={`badge-status-${payment.id}`}>
                    {getStatusText(payment.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(payment)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => onDelete?.(payment)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
