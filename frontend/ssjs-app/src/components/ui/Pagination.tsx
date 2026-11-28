import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  disabled?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  disabled,
  onPageChange,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col justify-between gap-4 border-t border-line-soft p-5 sm:flex-row sm:items-center"
    >
      <p className="text-sm text-gray-500">
        Page {page} of {Math.max(totalPages, 1)}
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1 || disabled}
          onClick={() => onPageChange(page - 1)}
          icon={<ChevronLeft size={16} />}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages || disabled}
          onClick={() => onPageChange(page + 1)}
          iconAfter={<ChevronRight size={16} />}
        >
          Next
        </Button>
      </div>
    </nav>
  );
}
