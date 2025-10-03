import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface PSBCustomer {
  id: string;
  name: string;
  phone: string;
  installationDate: Date;
}

export default function PSB() {
  const { data: customers = [], isLoading } = useQuery<PSBCustomer[]>({
    queryKey: ["/api/psb"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Daftar PSB</h1>
        <p className="text-muted-foreground">Pelanggan Sambungan Baru</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data PSB</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No HP</TableHead>
                <TableHead>Tanggal Bergabung</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {new Date(customer.installationDate).toLocaleDateString("id-ID")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
