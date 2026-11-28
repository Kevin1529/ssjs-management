"use client";

import { useCallback, useEffect, useState } from "react";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { adminService } from "@/services/admin.service";
import type { AdminDashboardStats } from "@/types/admin";
import type { User } from "@/types/user";

const EMPTY_STATS: AdminDashboardStats = {
  totalUsers: 0,
  approvedUsers: 0,
  pendingUsers: 0,
  rejectedUsers: 0,
  profilePendingUsers: 0,
};

/** Pending applications plus overview stats, loaded in parallel. */
export function useAdminDashboard() {
  const handleError = useAuthErrorHandler(ADMIN_LOGIN_PATH);

  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const [pending, overview] = await Promise.allSettled([
        adminService.getPendingUsers(),
        adminService.getDashboardStats(),
      ]);
      if (!active) return;

      if (pending.status === "fulfilled") {
        setUsers(pending.value.users || []);
        setError("");
      } else {
        const message = handleError(pending.reason, "Unable to load applications.");
        if (message) setError(message);
      }

      // Stats are secondary: a failure should not block the application list.
      if (overview.status === "fulfilled") {
        setStats(overview.value.stats);
      } else {
        console.error("Unable to load dashboard statistics:", overview.reason);
      }

      setLoading(false);
    };

    void load();
    return () => {
      active = false;
    };
  }, [reloadKey, handleError]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { users, stats, loading, error, setError, reload };
}
