import Button from "@/components/ui/Button";
import type { User } from "@/types/user";

interface PendingApplicationItemProps {
  user: User;
  /** True while any review action is running (disables all buttons). */
  disabled: boolean;
  /** True while this specific user is being processed. */
  processing: boolean;
  onView: () => void;
  onApprove: () => void;
  onReject: () => void;
}

export default function PendingApplicationItem({
  user,
  disabled,
  processing,
  onView,
  onApprove,
  onReject,
}: PendingApplicationItemProps) {
  return (
    <article className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
      <div className="flex items-center gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-tint font-semibold text-brand"
        >
          {user.fullName?.charAt(0).toUpperCase() || "M"}
        </div>

        <div>
          <h4 className="font-semibold text-brand">{user.fullName || "Name not provided"}</h4>
          <p className="mt-1 text-xs text-gray-500">{user.email}</p>
          <p className="mt-1 text-xs text-gray-500">{user.mobileNumber}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" size="sm" onClick={onView}>
          View details
        </Button>
        <Button size="sm" disabled={disabled} onClick={onApprove}>
          {processing ? "Processing..." : "Approve"}
        </Button>
        <Button variant="dangerOutline" size="sm" disabled={disabled} onClick={onReject}>
          Reject
        </Button>
      </div>
    </article>
  );
}
