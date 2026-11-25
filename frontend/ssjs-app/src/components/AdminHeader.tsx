"use client";

import Link from "next/link";
import { useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { href: "/admin/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Members", icon: Users },
];

export default function AdminHeader({
  activePage,
  onLogout,
  loggingOut,
  logoutError,
}: {
  activePage: "dashboard" | "users";
  onLogout: () => void;
  loggingOut: boolean;
  logoutError: string;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) =>
    activePage === "users" ? href === "/admin/users" : href === "/admin/dashboard";

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#173F35] text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link
          href="/admin/dashboard"
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5E6D7] text-[#173F35]">
            <ShieldCheck size={21} />
          </span>
          <span>
            <span className="block font-semibold leading-tight">Mosaic</span>
            <span className="text-[9px] tracking-[0.18em] text-white/55">
              ADMINISTRATION
            </span>
          </span>
        </Link>

        <nav
          aria-label="Admin navigation"
          className="hidden items-center gap-2 md:flex"
        >
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={17} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="hidden items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/85 transition hover:bg-white/10 disabled:opacity-60 md:inline-flex"
          >
            <LogOut size={16} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            aria-label={isMenuOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={isMenuOpen}
            aria-controls="admin-mobile-navigation"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 md:hidden"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="admin-mobile-navigation"
        aria-label="Admin navigation"
        hidden={!isMenuOpen}
        className="border-t border-white/10 px-5 py-3 md:hidden"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-3">
          {navigation.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
                isActive(href)
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <button
            type="button"
            onClick={onLogout}
            disabled={loggingOut}
            className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/80 hover:bg-white/10 disabled:opacity-60"
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </nav>

      {logoutError && (
        <p
          role="alert"
          className="bg-red-50 px-5 py-2 text-right text-sm text-red-700"
        >
          {logoutError}
        </p>
      )}
    </header>
  );
}
