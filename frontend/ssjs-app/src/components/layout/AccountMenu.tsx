"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleUserRound } from "lucide-react";
import { USER_MENU_NAV } from "@/constants/navigation";
import LogoutButton from "./LogoutButton";

interface AccountMenuProps {
  onLogout: () => void;
  loggingOut: boolean;
}

export default function AccountMenu({ onLogout, loggingOut }: AccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Open account menu"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-brand-tint"
      >
        <CircleUserRound size={19} aria-hidden="true" />
        <span className="hidden sm:inline">Account</span>
        <ChevronDown size={15} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 z-[60] mt-2 w-52 rounded-2xl border border-line bg-white p-2 text-sm shadow-xl"
        >
          {USER_MENU_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block rounded-xl px-3 py-2.5 text-ink hover:bg-canvas"
            >
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-line-soft" />
          <LogoutButton
            variant="menuItem"
            role="menuitem"
            loggingOut={loggingOut}
            onLogout={() => {
              setIsOpen(false);
              onLogout();
            }}
          />
        </div>
      )}
    </div>
  );
}
