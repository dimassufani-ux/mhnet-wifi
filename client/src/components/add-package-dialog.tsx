import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface Props {
  onSubmit: (data: any) => void;
}

export function AddPackageDialog({ onSubmit }: Props) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    speed: "",
    price: 0,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setOpen(false);
    setFormData({ name: "", speed: "", price: 0, description: "" });
  };

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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Paket Home"
              required
            />
          </div>
          <div>
            <Label htmlFor="speed">Kecepatan</Label>
            <Input
              id="speed"
              value={formData.speed}
              onChange={(e) => setFormData({ ...formData, speed: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
