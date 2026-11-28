import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

interface SectionCardProps {
  icon: LucideIcon;
  title: string;
  className?: string;
  children: React.ReactNode;
}

export default function SectionCard({
  icon: Icon,
  title,
  className,
  children,
}: SectionCardProps) {
  return (
    <section className={cn("rounded-2xl border border-line bg-white p-6", className)}>
      <div className="mb-5 flex items-center gap-3">
        <Icon className="text-brand-accent" size={21} aria-hidden="true" />
        <h3 className="font-semibold text-brand">{title}</h3>
      </div>
      {children}
    </section>
  );
}
