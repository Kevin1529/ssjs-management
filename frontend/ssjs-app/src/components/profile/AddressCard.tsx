import { MapPin } from "lucide-react";
import DetailItem from "@/components/ui/DetailItem";
import SectionCard from "@/components/ui/SectionCard";
import type { User } from "@/types/user";

interface AddressCardProps {
  address?: User["address"];
  /** "admin" renders a stacked list with icons. */
  variant?: "member" | "admin";
}

export default function AddressCard({ address, variant = "member" }: AddressCardProps) {
  const admin = variant === "admin";
  const icon = admin ? <MapPin size={17} /> : undefined;

  const rows = [
    { label: "Address", value: address?.addressLine },
    { label: "City", value: address?.city },
    { label: "State", value: address?.state },
    { label: "Country", value: address?.country },
    { label: "PIN code", value: address?.pincode },
  ];

  return (
    <SectionCard icon={MapPin} title="Residential address">
      <div className={admin ? "space-y-5" : "grid gap-4 sm:grid-cols-2"}>
        {rows.map((row) => (
          <DetailItem key={row.label} icon={icon} {...row} />
        ))}
      </div>
    </SectionCard>
  );
}
