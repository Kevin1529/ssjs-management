import { STATUS_BADGE_CLASS } from "@/constants/status";
import { cn } from "@/lib/cn";
import { humanizeStatus, statusLabel } from "@/lib/format";
import type { UserStatus } from "@/types/user";

interface StatusBadgeProps {
  status: UserStatus;
  /** "label" => "Pending approval", "raw" => "PENDING APPROVAL". */
  format?: "label" | "raw";
}

export default function StatusBadge({ status, format = "label" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs",
        format === "label" ? "font-medium" : "font-semibold",
        STATUS_BADGE_CLASS[status] ?? "bg-gray-100 text-gray-700",
      )}
    >
      {format === "label" ? statusLabel(status) : humanizeStatus(status)}
    </span>
  );
}
