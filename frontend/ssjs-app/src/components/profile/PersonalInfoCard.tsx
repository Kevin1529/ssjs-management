import { CalendarDays, Mail, Phone, UserRound } from "lucide-react";
import DetailItem from "@/components/ui/DetailItem";
import SectionCard from "@/components/ui/SectionCard";
import { formatDate, formatDateTime } from "@/lib/date-format";
import { capitalize, humanizeStatus } from "@/lib/format";
import type { User } from "@/types/user";

interface PersonalInfoCardProps {
  user: User;
  /** "member" = compact grid; "admin" = icon list without status rows. */
  variant?: "member" | "admin";
}

export default function PersonalInfoCard({ user, variant = "member" }: PersonalInfoCardProps) {
  const admin = variant === "admin";
  const icon = (Icon: typeof UserRound) => (admin ? <Icon size={17} /> : undefined);

  const rows: Array<{ label: string; value?: string; icon?: React.ReactNode }> = [
    { label: "Full name", value: user.fullName, icon: icon(UserRound) },
    { label: "Email address", value: user.email, icon: icon(Mail) },
    { label: "Mobile number", value: user.mobileNumber, icon: icon(Phone) },
    { label: "Date of birth", value: formatDate(user.dateOfBirth), icon: icon(CalendarDays) },
    { label: "Gender", value: capitalize(user.gender), icon: icon(UserRound) },
  ];

  if (!admin) {
    rows.push({ label: "Application status", value: humanizeStatus(user.status) });
  }

  rows.push(
    { label: "Last updated", value: formatDateTime(user.updatedAt), icon: icon(CalendarDays) },
    {
      label: admin ? "Created on" : "Submitted",
      value: formatDateTime(user.createdAt),
      icon: icon(CalendarDays),
    },
  );

  if (!admin && user.approvedAt) {
    rows.push({ label: "Approved", value: formatDateTime(user.approvedAt) });
  }

  return (
    <SectionCard icon={UserRound} title="Personal information">
      <div className={admin ? "space-y-5" : "grid gap-4 sm:grid-cols-2"}>
        {rows.map((row) => (
          <DetailItem key={row.label} {...row} />
        ))}
      </div>
    </SectionCard>
  );
}
