import { LogOut } from "lucide-react";
import { cn } from "@/lib/cn";

const styles = {
  solid:
    "rounded-xl bg-brand px-5 py-2.5 font-semibold text-white hover:bg-brand-hover",
  menuItem: "w-full rounded-xl px-3 py-2.5 text-left text-red-700 hover:bg-red-50",
  mobile: "mt-1 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-700 hover:bg-red-50",
  adminDesktop:
    "hidden rounded-xl border border-white/20 px-4 py-2.5 text-sm font-medium text-white/85 hover:bg-white/10 md:inline-flex",
  adminMobile:
    "mt-1 rounded-xl px-4 py-3 text-left text-sm font-medium text-white/80 hover:bg-white/10",
} as const;

interface LogoutButtonProps {
  variant: keyof typeof styles;
  onLogout: () => void;
  loggingOut: boolean;
  /** Overrides the default icon size. */
  iconSize?: number;
  role?: "menuitem";
}

export default function LogoutButton({
  variant,
  onLogout,
  loggingOut,
  iconSize = 16,
  role,
}: LogoutButtonProps) {
  return (
    <button
      type="button"
      role={role}
      onClick={onLogout}
      disabled={loggingOut}
      className={cn(
        "inline-flex items-center gap-2 transition disabled:opacity-60",
        variant === "menuItem" && "flex",
        styles[variant],
      )}
    >
      <LogOut size={iconSize} aria-hidden="true" />
      {loggingOut ? "Logging out..." : "Logout"}
    </button>
  );
}
