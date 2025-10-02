import { useState } from "react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Customer {
  id: string;
  name: string;
  phone: string;
  address: string;
  packageName: string;
  status: string;
  installationDate: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit?: (customer: Customer) => void;
  onDelete?: (customer: Customer) => void;
}

export function CustomerTable({ customers, onEdit, onDelete }: CustomerTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-chart-2 text-white";
      case "suspended":
        return "bg-chart-3 text-white";
      case "disconnected":
        return "bg-destructive text-white";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Aktif";
      case "suspended":
        return "Ditangguhkan";
      case "disconnected":
        return "Terputus";
      default:
        return status;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pelanggan</TableHead>
            <TableHead className="hidden md:table-cell">Telepon</TableHead>
            <TableHead className="hidden lg:table-cell">Alamat</TableHead>
            <TableHead className="hidden sm:table-cell">Paket</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Tgl Instalasi</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Belum ada pelanggan
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id} data-testid={`row-customer-${customer.id}`}>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {getInitials(customer.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{customer.name}</span>
                    </div>
                    <div className="md:hidden text-xs text-muted-foreground">
                      {customer.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell font-mono text-sm">{customer.phone}</TableCell>
                <TableCell className="hidden lg:table-cell max-w-[200px] truncate">{customer.address}</TableCell>
                <TableCell className="hidden sm:table-cell">{customer.packageName}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(customer.status)} data-testid={`badge-status-${customer.id}`}>
                    {getStatusText(customer.status)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{customer.installationDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${customer.id}`}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit?.(customer)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete?.(customer)}
                      >
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
