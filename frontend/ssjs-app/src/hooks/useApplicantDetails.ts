"use client";

import { useCallback, useEffect, useState } from "react";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/user";

/** Loads one applicant for the admin detail page. */
export function useApplicantDetails(userId: string) {
  const handleError = useAuthErrorHandler(ADMIN_LOGIN_PATH);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await adminService.getUserDetails(userId);
        if (!active) return;

        setUser(response.user);
        setError("");
      } catch (loadError) {
        const message = handleError(loadError, "Unable to load user details.");
        if (active && message) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [userId, reloadKey, handleError]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  /** Reload with the full-page spinner (used after a failed first load). */
  const retry = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { user, loading, error, setError, reload, retry };
}
