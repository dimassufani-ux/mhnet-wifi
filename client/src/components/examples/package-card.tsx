import { PackageCard } from "../package-card";

export default function PackageCardExample() {
  return (
    <div className="p-4 grid gap-4 md:grid-cols-3">
      <PackageCard
        name="Basic"
        speed="20 Mbps"
        price={150000}
        description="Cocok untuk browsing dan streaming"
        customerCount={45}
        onEdit={() => {}}
      />
      <PackageCard
        name="Premium"
        speed="50 Mbps"
        price={300000}
        description="Untuk keluarga dan gaming"
        customerCount={78}
        onEdit={() => {}}
      />
      <PackageCard
        name="Ultra"
        speed="100 Mbps"
        price={500000}
        description="Kecepatan maksimal untuk bisnis"
        customerCount={27}
        onEdit={() => {}}
      />
    </div>
  );
}
