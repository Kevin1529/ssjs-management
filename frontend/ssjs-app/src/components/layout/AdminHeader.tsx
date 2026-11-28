"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, ShieldCheck, X } from "lucide-react";
import BrandLogo from "@/components/ui/BrandLogo";
import { ADMIN_NAV, type AdminPage } from "@/constants/navigation";
import { cn } from "@/lib/cn";
import LogoutButton from "./LogoutButton";

const DESKTOP_LINK = { classes: "gap-2 px-4 py-2.5", iconSize: 17 };
const MOBILE_LINK = { classes: "gap-3 px-4 py-3", iconSize: 18 };

interface AdminHeaderProps {
  activePage: AdminPage;
  onLogout: () => void;
  loggingOut: boolean;
  logoutError: string;
}

export default function AdminHeader({
  activePage,
  onLogout,
  loggingOut,
  logoutError,
}: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLink = (
    item: (typeof ADMIN_NAV)[number],
    layout: { classes: string; iconSize: number },
    onClick?: () => void,
  ) => {
    const active = item.key === activePage;
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        onClick={onClick}
        className={cn(
          "flex items-center rounded-xl text-sm font-medium transition",
          layout.classes,
          active ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon size={layout.iconSize} aria-hidden="true" />
        {item.label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8">
        <Link href="/admin/dashboard" className="shrink-0" aria-label="Admin dashboard">
          <BrandLogo tone="onDark" icon={ShieldCheck} subtitle="ADMINISTRATION" />
        </Link>

        <nav aria-label="Admin navigation" className="hidden items-center gap-2 md:flex">
          {ADMIN_NAV.map((item) => navLink(item, DESKTOP_LINK))}
        </nav>

        <div className="flex items-center gap-2">
          <LogoutButton variant="adminDesktop" onLogout={onLogout} loggingOut={loggingOut} />

          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close admin mega menu" : "Open admin mega menu"}
            aria-expanded={isMenuOpen}
            aria-controls="admin-mobile-mega-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-white transition hover:bg-white/10 md:hidden"
          >
            {isMenuOpen ? <X size={21} /> : <LayoutGrid size={21} />}
          </button>
        </div>
      </div>

      <nav
        id="admin-mobile-mega-menu"
        aria-label="Admin mega menu"
        hidden={!isMenuOpen}
        className="absolute left-0 right-0 top-full border-t border-white/10 bg-brand px-5 py-4 shadow-xl md:hidden"
      >
        <div className="mx-auto grid max-w-7xl gap-2 sm:grid-cols-2 sm:px-3">
          {ADMIN_NAV.map((item) => navLink(item, MOBILE_LINK, () => setIsMenuOpen(false)))}
          <LogoutButton
            variant="adminMobile"
            onLogout={onLogout}
            loggingOut={loggingOut}
            iconSize={18}
          />
        </div>
      </nav>

      {logoutError && (
        <p role="alert" className="bg-red-50 px-5 py-2 text-right text-sm text-red-700">
          {logoutError}
        </p>
      )}
    </header>
  );
}
