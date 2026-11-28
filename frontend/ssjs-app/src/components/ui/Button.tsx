import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "danger"
  | "dangerOutline"
  | "link";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 font-medium transition disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand text-white hover:bg-brand-hover disabled:opacity-60",
  secondary: "border border-line text-ink hover:bg-canvas disabled:opacity-50",
  danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
  dangerOutline:
    "border border-red-200 text-red-700 hover:bg-red-50 disabled:opacity-50",
  link: "text-brand-accent hover:text-brand disabled:opacity-50",
};

const sizes: Record<ButtonSize, string> = {
  sm: "rounded-lg px-4 py-2 text-xs",
  md: "rounded-xl px-5 py-3 text-sm",
  lg: "h-14 rounded-xl px-6 text-base",
};

/** Shared with `ButtonLink` so links and buttons look identical. */
export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    base,
    variant === "link" ? "" : sizes[size],
    variants[variant],
    fullWidth && "w-full",
    className,
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  /** Shows a spinner, disables the button and swaps the label. */
  loading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  iconAfter?: React.ReactNode;
}

export default function Button({
  variant,
  size,
  fullWidth,
  loading = false,
  loadingText,
  icon,
  iconAfter,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {icon}
          {children}
          {iconAfter}
        </>
      )}
    </button>
  );
}
