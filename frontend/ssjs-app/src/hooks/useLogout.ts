"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { setActiveRole, type ActiveRole } from "@/lib/active-role";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";

export function useLogout(role: ActiveRole | null, onDone?: () => void) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const logout = useCallback(async () => {
    if (!role || loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      await (role === "admin" ? adminService.logout() : authService.logout());

      setActiveRole(null);
      onDone?.();
      router.replace(role === "admin" ? ADMIN_LOGIN_PATH : "/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }, [role, loggingOut, onDone, router]);

  return { logout, loggingOut, logoutError };
}
