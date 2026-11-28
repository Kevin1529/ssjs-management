import { cn } from "@/lib/cn";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  /** Hide the label visually but keep it for screen readers. */
  hideLabel?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** Label + control + hint wrapper used by every text-like field. */
export default function FormField({
  label,
  htmlFor,
  hint,
  hideLabel = false,
  className,
  children,
}: FormFieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={htmlFor}
        className={cn(
          hideLabel ? "sr-only" : "mb-2 block text-sm font-medium text-ink",
        )}
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
