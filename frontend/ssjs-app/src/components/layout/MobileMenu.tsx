import Link from "next/link";
import { MAIN_NAV, USER_MENU_NAV } from "@/constants/navigation";
import type { ActiveRole } from "@/lib/active-role";
import LogoutButton from "./LogoutButton";

interface MobileMenuProps {
  open: boolean;
  authRole: ActiveRole | null;
  loggingOut: boolean;
  onNavigate: () => void;
  onLogout: () => void;
}

const linkClass =
  "rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-brand-tint hover:text-brand";

const headingClass =
  "mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-brand-muted";

export default function MobileMenu({
  open,
  authRole,
  loggingOut,
  onNavigate,
  onLogout,
}: MobileMenuProps) {
  const logout = (
    <LogoutButton variant="mobile" loggingOut={loggingOut} onLogout={onLogout} iconSize={16} />
  );

  return (
    <nav
      id="mobile-mega-menu"
      aria-label="Mega menu"
      hidden={!open}
      className="absolute left-0 right-0 top-full border-t border-line bg-white px-5 py-5 shadow-xl sm:px-8 md:hidden"
    >
      <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2">
        <section>
          <h2 className={headingClass}>Explore</h2>
          <div className="grid gap-1 sm:grid-cols-2">
            {MAIN_NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass}>
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className={headingClass}>{authRole === "user" ? "Your account" : "Membership"}</h2>

          {authRole === "user" ? (
            <div className="grid gap-1">
              {USER_MENU_NAV.map((item) => (
                <Link key={item.href} href={item.href} onClick={onNavigate} className={linkClass}>
                  {item.label}
                </Link>
              ))}
              {logout}
            </div>
          ) : authRole ? (
            logout
          ) : (
            <Link
              href="/login"
              onClick={onNavigate}
              className="inline-flex rounded-xl px-3 py-3 text-sm font-medium text-brand transition hover:bg-brand-tint"
            >
              Log in
            </Link>
          )}
        </section>
      </div>
    </nav>
  );
}
