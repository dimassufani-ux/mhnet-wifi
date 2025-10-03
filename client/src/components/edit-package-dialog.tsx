import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import type { Package } from "@shared/schema";

interface Props {
  package: Package;
  onSubmit: (data: any) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditPackageDialog({ package: pkg, onSubmit, open, onOpenChange }: Props) {
  const [formData, setFormData] = useState({
    name: pkg?.name || "",
    speed: pkg?.speed || "",
    price: pkg?.price || 0,
    description: pkg?.description || "",
  });

  useEffect(() => {
    if (open && pkg) {
      setFormData({
        name: pkg.name,
        speed: pkg.speed,
        price: pkg.price,
        description: pkg.description || "",
      });
    }
  }, [open, pkg]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  }, [formData, onSubmit, onOpenChange]);

  const handleNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  }, []);

  const handleSpeedChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, speed: e.target.value }));
  }, []);

  const handlePriceChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }));
  }, []);

  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, description: e.target.value }));
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Paket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Paket</Label>
            <Input id="name" value={formData.name} onChange={handleNameChange} required />
          </div>
          <div>
            <Label htmlFor="speed">Kecepatan</Label>
            <Input id="speed" value={formData.speed} onChange={handleSpeedChange} required />
          </div>
          <div>
            <Label htmlFor="price">Harga</Label>
            <Input id="price" type="number" value={formData.price} onChange={handlePriceChange} required />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea id="description" value={formData.description} onChange={handleDescriptionChange} />
          </div>
          <Button type="submit" className="w-full">Simpan</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
