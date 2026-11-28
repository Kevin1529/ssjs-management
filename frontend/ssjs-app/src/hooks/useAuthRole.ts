"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import {
  getActiveRole,
  subscribeToActiveRole,
  type ActiveRole,
} from "@/lib/active-role";
import { getRoleForPath } from "@/lib/auth-routes";

/** Current role: inferred from the route, otherwise from session storage. */
export function useAuthRole(): ActiveRole | null {
  const pathname = usePathname();
  const storedRole = useSyncExternalStore(
    subscribeToActiveRole,
    getActiveRole,
    () => null,
  );

  return getRoleForPath(pathname) ?? storedRole;
}
