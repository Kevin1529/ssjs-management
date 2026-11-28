import { STATUS_LABEL } from "@/constants/status";
import type { UserStatus } from "@/types/user";

export function capitalize(value?: string) {
  return value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : undefined;
}

/** "PENDING_APPROVAL" -> "PENDING APPROVAL" */
export function humanizeStatus(status: UserStatus) {
  return status.replaceAll("_", " ");
}

export function statusLabel(status: UserStatus) {
  return STATUS_LABEL[status] ?? humanizeStatus(status);
}

/** Last path segment of a URL, decoded safely; falls back to `fallback`. */
export function getFileName(url: string, fallback: string) {
  const name = url.split("?")[0].split("/").pop();
  if (!name) return fallback;

  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
