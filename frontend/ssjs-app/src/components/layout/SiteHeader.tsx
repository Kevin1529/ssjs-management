"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { MAIN_NAV } from "@/constants/navigation";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useLogout } from "@/hooks/useLogout";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";
import AccountMenu from "./AccountMenu";
import AdminHeader from "./AdminHeader";
import LogoutButton from "./LogoutButton";
import MobileMenu from "./MobileMenu";

export default function SiteHeader() {
  const pathname = usePathname();
  const authRole = useAuthRole();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  const { logout, loggingOut, logoutError } = useLogout(authRole, closeMenu);

  if (pathname.startsWith("/admin")) {
    if (pathname === ADMIN_LOGIN_PATH) return null;

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
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4 sm:px-10 lg:px-12">
        <Link href="/" onClick={closeMenu} aria-label="Mosaic home">
          <BrandLogo />
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 text-sm font-medium text-gray-600 md:flex"
        >
          {MAIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-brand">
              {item.label}
            </Link>
          ))}

          {authRole === "user" ? (
            <AccountMenu onLogout={logout} loggingOut={loggingOut} />
          ) : authRole ? (
            <LogoutButton variant="solid" onLogout={logout} loggingOut={loggingOut} />
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-hover"
            >
              Log in
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-brand transition hover:bg-brand-tint md:hidden"
          aria-label={isMenuOpen ? "Close mega menu" : "Open mega menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-mega-menu"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <X size={22} /> : <LayoutGrid size={21} />}
        </button>
      </div>

      <MobileMenu
        open={isMenuOpen}
        authRole={authRole}
        loggingOut={loggingOut}
        onNavigate={closeMenu}
        onLogout={logout}
      />

      {logoutError && (
        <p role="alert" className="bg-red-50 px-6 py-2 text-right text-sm text-red-700">
          {logoutError}
        </p>
      )}
    </header>
  );
}
