import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, Edit } from "lucide-react";

interface PackageCardProps {
  name: string;
  speed: string;
  price: number;
  description?: string;
  customerCount?: number;
  onEdit?: () => void;
}

export function PackageCard({
  name,
  speed,
  price,
  description,
  customerCount,
  onEdit,
}: PackageCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card data-testid={`card-package-${name.toLowerCase()}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
            <Wifi className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            <Badge variant="outline" className="mt-1">
              {speed}
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onEdit} data-testid={`button-edit-${name.toLowerCase()}`}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-3xl font-bold">{formatPrice(price)}</div>
          <p className="text-sm text-muted-foreground">/bulan</p>
          {description && (
            <p className="text-sm text-muted-foreground mt-2">{description}</p>
          )}
          {customerCount !== undefined && (
            <div className="pt-2 mt-2 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{customerCount}</span> pelanggan aktif
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
