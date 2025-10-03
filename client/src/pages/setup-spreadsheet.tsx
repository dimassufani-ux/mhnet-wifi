import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileSpreadsheet, Check, Copy } from "lucide-react";

export default function SetupSpreadsheet() {
  const [title, setTitle] = useState("MHNET - Data Pelanggan WiFi");
  const [loading, setLoading] = useState(false);
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<any>(null);
  const { toast } = useToast();

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/init-spreadsheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (data.success) {
        setSpreadsheetInfo(data);
        toast({
          title: "Berhasil!",
          description: "Spreadsheet telah dibuat. Salin Spreadsheet ID di bawah.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Gagal membuat spreadsheet",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Terjadi kesalahan saat membuat spreadsheet",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      toast({
        variant: "destructive",
        description: "Gagal menyalin",
      });
    });
    toast({
      description: "Disalin ke clipboard",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Setup Google Spreadsheet</h1>
        <p className="text-muted-foreground mt-1">
          Buat spreadsheet baru untuk menyimpan data pelanggan
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Buat Spreadsheet Baru
          </CardTitle>
          <CardDescription>
            Spreadsheet akan dibuat dengan 3 sheet: Pelanggan, Paket, dan Pembayaran
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nama Spreadsheet</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="MHNET - Data Pelanggan WiFi"
              data-testid="input-spreadsheet-title"
            />
          </div>

          <Button
            onClick={handleCreate}
            disabled={loading || !title}
            className="w-full"
            data-testid="button-create-spreadsheet"
          >
            {loading ? "Membuat..." : "Buat Spreadsheet"}
          </Button>
        </CardContent>
      </Card>

      {spreadsheetInfo && (
        <Card className="border-chart-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-chart-2">
              <Check className="h-5 w-5" />
              Spreadsheet Berhasil Dibuat!
            </CardTitle>
            <CardDescription>
              Salin Spreadsheet ID di bawah ini dan tambahkan ke Secrets
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Spreadsheet URL</Label>
              <div className="flex gap-2">
                <Input
                  value={spreadsheetInfo.spreadsheetUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(spreadsheetInfo.spreadsheetUrl, "_blank")}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Spreadsheet ID</Label>
              <div className="flex gap-2">
                <Input
                  value={spreadsheetInfo.spreadsheetId}
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-spreadsheet-id"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(spreadsheetInfo.spreadsheetId)}
                  data-testid="button-copy-id"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md space-y-2">
              <p className="font-semibold text-sm">Langkah Selanjutnya:</p>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Klik tombol Copy di atas untuk menyalin Spreadsheet ID</li>
                <li>Buka tab "Secrets" di sidebar kiri Replit</li>
                <li>Tambahkan secret baru dengan key: <code className="bg-background px-1 rounded">SPREADSHEET_ID</code></li>
                <li>Paste Spreadsheet ID sebagai value</li>
                <li>Restart aplikasi untuk menggunakan spreadsheet</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Atau Gunakan Spreadsheet yang Sudah Ada</CardTitle>
          <CardDescription>
            Jika sudah punya spreadsheet, tambahkan Spreadsheet ID ke Secrets
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Pastikan spreadsheet memiliki 3 sheet dengan nama: <strong>Pelanggan</strong>, <strong>Paket</strong>, dan <strong>Pembayaran</strong>
          </p>
          <p className="text-sm text-muted-foreground">
            Tambahkan secret <code className="bg-muted px-1 rounded">SPREADSHEET_ID</code> dengan ID spreadsheet Anda, lalu restart aplikasi.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
