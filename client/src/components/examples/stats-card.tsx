import { StatsCard } from "../stats-card";
import { Users } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-4">
      <StatsCard
        title="Total Pelanggan"
        value="150"
        icon={Users}
        description="Pelanggan aktif"
        trend={{ value: "12%", positive: true }}
      />
    </div>
  );
}
