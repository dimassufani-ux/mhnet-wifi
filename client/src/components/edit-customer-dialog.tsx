import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil } from "lucide-react";
import type { Customer, Package } from "@shared/schema";

interface EditCustomerDialogProps {
  customer: Customer;
  packages: Package[];
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCustomerDialog({ customer, packages, onSubmit, open, onOpenChange }: EditCustomerDialogProps) {
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

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onOpenChange(false);
  }, [formData, onSubmit, onOpenChange]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handlePhoneChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, phone: e.target.value }));
  }, []);

  const handleAddressChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, address: e.target.value }));
  }, []);

  const handlePackageChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, packageId: value }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, status: value }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pelanggan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" value={formData.name} onChange={handleNameChange} required />
          </div>
          <div>
            <Label htmlFor="phone">Telepon</Label>
            <Input id="phone" value={formData.phone} onChange={handlePhoneChange} required />
          </div>
          <div>
            <Label htmlFor="address">Alamat</Label>
            <Input id="address" value={formData.address} onChange={handleAddressChange} required />
          </div>
          <div>
            <Label>Paket</Label>
            <Select value={formData.packageId} onValueChange={handlePackageChange}>
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
            <Select value={formData.status} onValueChange={handleStatusChange}>
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
