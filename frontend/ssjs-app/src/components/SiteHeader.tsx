"use client";

import Link from "next/link";
import { Menu, Sparkles, X } from "lucide-react";
import { useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/events", label: "Events" },
  { href: "/contact", label: "Contact us" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
          <Link
            href="/login"
            className="rounded-xl bg-[#173F35] px-5 py-2.5 font-semibold text-white transition hover:bg-[#245747]"
          >
            Log in
          </Link>
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
          <Link
            href="/login"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 rounded-xl bg-[#173F35] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#245747]"
          >
            Log in
          </Link>
        </div>
      </nav>
    </header>
  );
}
