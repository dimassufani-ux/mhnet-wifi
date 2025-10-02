import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import type { Customer, Package } from "@shared/schema";

interface Props {
  customer: Customer;
  packages: Package[];
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCustomerDialog({ customer, packages, onSubmit, open, onOpenChange }: Props) {
  const [formData, setFormData] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    packageId: customer?.packageId || "",
    status: customer?.status || "active",
  });

  useEffect(() => {
    if (open && customer) {
      setFormData({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        packageId: customer.packageId,
        status: customer.status,
      });
    }
  }, [open, customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pelanggan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          </div>
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
          </div>
          <div>
            <Label>Paket</Label>
            <Select value={formData.packageId} onValueChange={(value) => setFormData({ ...formData, packageId: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {packages.map((pkg) => (
                  <SelectItem key={pkg.id} value={pkg.id}>
                    {pkg.name} - {pkg.speed}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Nonaktif</SelectItem>
                <SelectItem value="suspended">Ditangguhkan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
