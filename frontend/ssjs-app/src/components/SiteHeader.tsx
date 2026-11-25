"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  CircleUserRound,
  LayoutGrid,
  LogOut,
  Sparkles,
  X,
} from "lucide-react";
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
      : pathname === "/dashboard" ||
          pathname === "/account-settings" ||
          pathname.startsWith("/profile")
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
          {authRole === "user" ? (
            <AccountMenu
              onLogout={logout}
              loggingOut={loggingOut}
            />
          ) : authRole ? (
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
          aria-label={isMenuOpen ? "Close mega menu" : "Open mega menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-mega-menu"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        >
          {isMenuOpen ? <X size={22} /> : <LayoutGrid size={21} />}
        </button>
      </div>

      <nav
        id="mobile-mega-menu"
        aria-label="Mega menu"
        hidden={!isMenuOpen}
        className="absolute left-0 right-0 top-full border-t border-[#E5EAE2] bg-white px-5 py-5 shadow-xl md:hidden sm:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2">
          <section>
            <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-[#78917F]">
              Explore
            </h2>
            <div className="grid gap-1 sm:grid-cols-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#E8F0E7] hover:text-[#173F35]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-[#78917F]">
              {authRole === "user" ? "Your account" : "Membership"}
            </h2>
            {authRole === "user" ? (
              <div className="grid gap-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#E8F0E7] hover:text-[#173F35]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/account-settings"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-[#E8F0E7] hover:text-[#173F35]"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  disabled={loggingOut}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
                >
                  <LogOut size={16} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            ) : authRole ? (
              <button
                type="button"
                onClick={logout}
                disabled={loggingOut}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:opacity-60"
              >
                <LogOut size={16} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="inline-flex rounded-xl px-3 py-3 text-sm font-medium text-[#173F35] transition hover:bg-[#E8F0E7]"
              >
                Log in
              </Link>
            )}
          </section>
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

function AccountMenu({
  onLogout,
  loggingOut,
}: {
  onLogout: () => void;
  loggingOut: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#E4E9E2] bg-white px-3 py-2.5 text-sm font-medium text-[#29473D] transition hover:bg-[#E8F0E7]"
      >
        <CircleUserRound size={19} />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown size={15} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-52 rounded-2xl border border-[#E5EAE2] bg-white p-2 text-sm shadow-xl"
        >
          <Link
            href="/dashboard"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-[#29473D] hover:bg-[#F6F5EF]"
          >
            Dashboard
          </Link>
          <Link
            href="/account-settings"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="block rounded-xl px-3 py-2.5 text-[#29473D] hover:bg-[#F6F5EF]"
          >
            Profile
          </Link>
          <div className="my-1 border-t border-[#EDF0EA]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            disabled={loggingOut}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-red-700 hover:bg-red-50 disabled:opacity-60"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
