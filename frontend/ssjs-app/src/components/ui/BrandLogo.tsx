import { Sparkles, type LucideIcon } from "lucide-react";
import { SITE } from "@/constants/site";
import { cn } from "@/lib/cn";

interface BrandLogoProps {
  /** "onLight" for light backgrounds, "onDark" for the green panels. */
  tone?: "onLight" | "onDark";
  size?: "sm" | "md";
  icon?: LucideIcon;
  subtitle?: string;
}

export default function BrandLogo({
  tone = "onLight",
  size = "sm",
  icon: Icon = Sparkles,
  subtitle = SITE.tagline,
}: BrandLogoProps) {
  const dark = tone === "onDark";
  const large = size === "md";

  return (
    <span className="flex items-center gap-3">
      <span
        className={cn(
          "flex items-center justify-center",
          large ? "h-11 w-11 rounded-2xl" : "h-10 w-10 rounded-xl",
          dark ? "bg-brand-light text-brand" : "bg-brand text-brand-light",
        )}
      >
        <Icon size={large ? 22 : 20} aria-hidden="true" />
      </span>
      <span>
        <span
          className={cn(
            "block font-semibold leading-tight",
            large ? "text-xl tracking-tight" : "text-lg",
            dark ? "text-white" : "text-brand",
          )}
        >
          {SITE.name}
        </span>
        <span
          className={cn(
            "block tracking-[0.2em]",
            large ? "text-xs" : "text-[9px]",
            dark ? "text-white/60" : "text-gray-500",
          )}
        >
          {subtitle}
        </span>
      </span>
    </span>
  );
}
