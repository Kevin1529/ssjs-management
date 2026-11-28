import { LayoutDashboard, Users } from "lucide-react";

export const MAIN_NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact us" },
] as const;

export const FOOTER_NAV = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact" },
] as const;

export const USER_MENU_NAV = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/account-settings", label: "Profile" },
] as const;

export type AdminPage = "dashboard" | "users";

export const ADMIN_NAV = [
  { key: "dashboard", href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { key: "users", href: "/admin/users", label: "Members", icon: Users },
] as const satisfies ReadonlyArray<{
  key: AdminPage;
  href: string;
  label: string;
  icon: typeof Users;
}>;
