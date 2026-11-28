import {
  BadgeCheck,
  Clock3,
  ShieldCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import type { AdminDashboardStats } from "@/types/admin";

interface StatCardProps {
  label: string;
  value: number;
  description: string;
  icon: LucideIcon;
  iconClass: string;
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
  iconClass,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-line bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{label}</p>
        <Icon
          size={21}
          className={iconClass}
          aria-hidden="true"
        />
      </div>
      <p className="mt-4 text-3xl font-semibold text-brand">{value}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  );
}

export default function StatsGrid({ stats }: { stats: AdminDashboardStats }) {
  const cards: StatCardProps[] = [
    {
      label: "Total members",
      value: stats.totalUsers,
      description: "All registered users",
      icon: UserRound,
      iconClass: "text-brand-accent",
    },
    {
      label: "Approved",
      value: stats.approvedUsers,
      description: "Active memberships",
      icon: BadgeCheck,
      iconClass: "text-green-600",
    },
    {
      label: "Pending approval",
      value: stats.pendingUsers,
      description: "Awaiting your review",
      icon: Clock3,
      iconClass: "text-amber-600",
    },
    {
      label: "Rejected",
      value: stats.rejectedUsers,
      description: "Rejected applications",
      icon: ShieldCheck,
      iconClass: "text-red-600",
    },
  ];
  console.log("stats", stats);
  return (
    <>
      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard
            key={card.label}
            {...card}
          />
        ))}
      </div>
      <p className="mb-6 text-xs text-gray-500">
        Incomplete profiles: {stats.profilePendingUsers}
      </p>
    </>
  );
}
