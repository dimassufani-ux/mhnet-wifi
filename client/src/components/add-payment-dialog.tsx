import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { Customer } from "@shared/schema";

interface Props {
  customers: Customer[];
  onSubmit: (data: any) => void;
}

const getInitialFormData = () => ({
  customerId: "",
  amount: 0,
  status: "pending",
  method: "",
  month: "",
  paymentDate: new Date().toISOString().split('T')[0],
});

export function AddPaymentDialog({ customers, onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, paymentDate: new Date(formData.paymentDate) });
    setOpen(false);
    setFormData(getInitialFormData());
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-payment">
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Catat Pembayaran Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Pelanggan</Label>
            <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih pelanggan" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="amount">Jumlah (Rp)</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
              required
            />
          </div>
          <div>
            <Label htmlFor="month">Bulan</Label>
            <Input
              id="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              placeholder="Januari 2024"
              required
            />
          </div>
          <div>
            <Label htmlFor="method">Metode Pembayaran</Label>
            <Input
              id="method"
              value={formData.method}
              onChange={(e) => setFormData({ ...formData, method: e.target.value })}
              placeholder="Transfer Bank"
              required
            />
          </div>
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="paymentDate">Tanggal Bayar</Label>
            <Input
              id="paymentDate"
              type="date"
              value={formData.paymentDate}
              onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Catat Pembayaran
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
