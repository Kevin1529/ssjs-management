import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Spinner({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <LoaderCircle
      size={size}
      aria-hidden="true"
      className={cn("animate-spin text-brand motion-reduce:animate-none", className)}
    />
  );
}
