import type { StatusFilter } from "@/types/admin";
import type { UserStatus } from "@/types/user";

export const STATUS_LABEL: Record<UserStatus, string> = {
  PROFILE_PENDING: "Profile pending",
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const STATUS_BADGE_CLASS: Record<UserStatus, string> = {
  PROFILE_PENDING: "bg-gray-100 text-gray-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export const STATUS_FILTER_OPTIONS: ReadonlyArray<{
  value: StatusFilter;
  label: string;
}> = [
  { value: "ALL", label: "All statuses" },
  ...(Object.keys(STATUS_LABEL) as UserStatus[]).map((value) => ({
    value,
    label: STATUS_LABEL[value],
  })),
];
