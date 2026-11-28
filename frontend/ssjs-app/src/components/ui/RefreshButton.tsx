import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";
import Button from "./Button";

interface RefreshButtonProps {
  onClick: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function RefreshButton({
  onClick,
  loading = false,
  children = "Refresh",
}: RefreshButtonProps) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      disabled={loading}
      icon={
        <RefreshCw
          size={18}
          aria-hidden="true"
          className={cn(loading && "animate-spin motion-reduce:animate-none")}
        />
      }
    >
      {children}
    </Button>
  );
}
