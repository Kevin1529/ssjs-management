import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="p-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-tint text-brand">
        <Icon size={25} />
      </div>
      <h4 className="mt-4 font-semibold text-brand">{title}</h4>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
