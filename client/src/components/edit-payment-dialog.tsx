import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import type { Payment } from "@shared/schema";

interface Props {
  payment: Payment;
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPaymentDialog({ payment, onSubmit, open, onOpenChange }: Props) {
  const [formData, setFormData] = useState({
    amount: payment?.amount || 0,
    status: payment?.status || "pending",
    method: payment?.method || "",
    month: payment?.month || "",
  });

  useEffect(() => {
    if (open && payment) {
      setFormData({
        amount: payment.amount,
        status: payment.status,
        method: payment.method,
        month: payment.month,
      });
    }
  }, [open, payment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pembayaran</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Jumlah</Label>
            <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })} required />
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
            <Label htmlFor="method">Metode</Label>
            <Input id="method" value={formData.method} onChange={(e) => setFormData({ ...formData, method: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="month">Bulan</Label>
            <Input id="month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} required />
          </div>
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
