import { cn } from "@/lib/cn";

interface AlertProps {
  tone?: "error" | "success";
  /** Plain coloured text instead of a tinted box. */
  plain?: boolean;
  className?: string;
  children: React.ReactNode;
}

const tones = {
  error: { box: "bg-red-50 text-red-700", plain: "text-red-600" },
  success: { box: "bg-green-50 text-green-700", plain: "text-brand-accent" },
};

export default function Alert({
  tone = "error",
  plain = false,
  className,
  children,
}: AlertProps) {
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "text-sm",
        plain ? tones[tone].plain : cn("rounded-xl px-4 py-3", tones[tone].box),
        className,
      )}
    >
      {children}
    </p>
  );
}
