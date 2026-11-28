import type { ActiveRole } from "@/lib/active-role";

export const ADMIN_LOGIN_PATH = "/admin/login";
export const USER_LOGIN_PATH = "/";

/** Which role a pathname belongs to, or null for public pages. */
export function getRoleForPath(pathname: string): ActiveRole | null {
  if (pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN_PATH) {
    return "admin";
  }

  if (
    pathname === "/dashboard" ||
    pathname === "/account-settings" ||
    pathname.startsWith("/profile")
  ) {
    return "user";
  }

  return null;
}
