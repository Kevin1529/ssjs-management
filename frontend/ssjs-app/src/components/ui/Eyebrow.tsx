import { cn } from "@/lib/cn";

export default function Eyebrow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={cn(
        "text-sm font-semibold tracking-[0.18em] text-brand-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
