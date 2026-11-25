"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import AdminHeader from "@/components/AdminHeader";
import { adminService } from "@/services/admin.service";
import { userService } from "@/services/user.service";
import {
  getActiveRole,
  setActiveRole,
  subscribeToActiveRole,
} from "@/lib/active-role";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact us" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const storedRole = useSyncExternalStore(
    subscribeToActiveRole,
    getActiveRole,
    () => null,
  );
  const routeRole =
    pathname.startsWith("/admin") && pathname !== "/admin/login"
      ? "admin"
      : pathname === "/dashboard" || pathname === "/profile"
        ? "user"
        : null;
  const authRole = routeRole ?? storedRole;

  const logout = async () => {
    if (!authRole || loggingOut) return;

    setLoggingOut(true);
    setLogoutError("");

    try {
      if (authRole === "admin") {
        await adminService.logout();
      } else {
        await userService.logout();
      }

      setActiveRole(null);
      setIsMenuOpen(false);
      router.replace(authRole === "admin" ? "/admin/login" : "/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLogoutError("Unable to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  };

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") {
      return null;
    }

    return (
      <AdminHeader
        activePage={pathname.startsWith("/admin/users") ? "users" : "dashboard"}
        onLogout={logout}
        loggingOut={loggingOut}
        logoutError={logoutError}
      />
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5EAE2] bg-[#F6F5EF]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173F35] text-[#D5E6D7]">
            <Sparkles size={20} />
          </span>
          <span>
            <span className="block text-lg font-semibold leading-tight text-[#173F35]">
              Mosaic
            </span>
            <span className="text-[9px] tracking-[0.2em] text-gray-500">
              MEMBERSHIP COMMUNITY
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-[#173F35]"
            >
              {item.label}
            </Link>
          ))}
          {authRole ? (
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#245747] disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-[#173F35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#245747]"
            >
              Log in
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#173F35] transition hover:bg-[#E8F0E7] md:hidden"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!isMenuOpen}
        className="border-t border-[#E5EAE2] px-6 py-4 md:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#E8F0E7] hover:text-[#173F35]"
            >
              {item.label}
            </Link>
          ))}
          {authRole ? (
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:opacity-60"
            >
              <LogOut size={16} />
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded-xl bg-[#173F35] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#245747]"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>
      {logoutError && (
        <p
          role="alert"
          className="bg-red-50 px-6 py-2 text-right text-sm text-red-700"
        >
          {logoutError}
        </p>
      )}
    </header>
  );
}
