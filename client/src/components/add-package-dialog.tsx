import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import type { InsertPackage } from "@shared/schema";

interface Props {
  onSubmit: (data: InsertPackage) => void;
}

export function AddPackageDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    speed: "",
    price: 0,
    description: "",
  });

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      setOpen(false);
      setFormData({ name: "", speed: "", price: 0, description: "" });
    } catch (error) {
      console.error('Failed to add package:', error);
    }
  }, [formData, onSubmit]);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-package">
          <Plus className="mr-2 h-4 w-4" />
          Tambah Paket
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Paket Baru</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nama Paket</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="Paket Home"
              required
            />
          </div>
          <div>
            <Label htmlFor="speed">Kecepatan</Label>
            <Input
              id="speed"
              value={formData.speed}
              onChange={handleSpeedChange}
              placeholder="10 Mbps"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={handlePriceChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleDescriptionChange}
              placeholder="Cocok untuk rumahan"
            />
          </div>
          <Button type="submit" className="w-full">
            Tambah Paket
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
