import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola pengaturan aplikasi dan profil
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil Bisnis</CardTitle>
          <CardDescription>
            Informasi tentang bisnis WiFi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-name">Nama Bisnis</Label>
            <Input
              id="business-name"
              defaultValue="MHNET"
              data-testid="input-business-name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-phone">Nomor Telepon</Label>
            <Input
              id="business-phone"
              defaultValue="081234567890"
              data-testid="input-business-phone"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-address">Alamat</Label>
            <Input
              id="business-address"
              defaultValue="Jl. Merdeka No. 123, Jakarta"
              data-testid="input-business-address"
            />
          </div>
          <Button data-testid="button-save-profile">Simpan Perubahan</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifikasi</CardTitle>
          <CardDescription>
            Atur pengingat dan notifikasi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Pengingat Pembayaran</Label>
              <p className="text-sm text-muted-foreground">
                Kirim notifikasi untuk pembayaran yang jatuh tempo
              </p>
            </div>
            <Button variant="outline" data-testid="button-toggle-payment-reminder">
              Aktif
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Notifikasi Pelanggan Baru</Label>
              <p className="text-sm text-muted-foreground">
                Terima notifikasi saat pelanggan baru terdaftar
              </p>
            </div>
            <Button variant="outline" data-testid="button-toggle-new-customer">
              Aktif
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
