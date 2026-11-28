"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { USER_LOGIN_PATH } from "@/lib/auth-routes";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { userService } from "@/services/user.service";
import type { User } from "@/types/user";

interface Options {
  fallbackError: string;
  /**
   * Return a path to send the user elsewhere based on their status,
   * or null to stay. Must be a stable reference (define it at module level).
   */
  redirectFor?: (profile: User) => string | null;
}

/**
 * Loads the signed-in user's profile with status-based redirects,
 * session-expiry handling and a retry. Stays in `loading` while redirecting
 * so pages never flash an empty or error state.
 */
export function useUserProfile({ fallbackError, redirectFor }: Options) {
  const router = useRouter();
  const handleError = useAuthErrorHandler(USER_LOGIN_PATH);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const { profile } = await userService.getMyProfile();
        if (!profile) throw new Error("Unable to find your profile.");

        const redirectTo = redirectFor?.(profile);
        if (redirectTo) {
          router.replace(redirectTo);
          return;
        }

        if (!active) return;
        setUser(profile);
        setError("");
        setLoading(false);
      } catch (loadError) {
        const message = handleError(loadError, fallbackError);
        if (!active || message === null) return;

        setError(message);
        setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [reloadKey, router, handleError, redirectFor, fallbackError]);

  const reload = useCallback(() => {
    setLoading(true);
    setError("");
    setReloadKey((key) => key + 1);
  }, []);

  return { user, loading, error, reload };
}
