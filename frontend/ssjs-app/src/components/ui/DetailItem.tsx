interface DetailItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
}

/** Read-only label/value pair; shows "Not provided" when empty. */
export default function DetailItem({ label, value, icon }: DetailItemProps) {
  const content = (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-ink">
        {value || "Not provided"}
      </p>
    </div>
  );

  if (!icon) return content;

  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-brand-muted">{icon}</span>
      {content}
    </div>
  );
}
