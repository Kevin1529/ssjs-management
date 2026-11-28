"use client";

import { useEffect, useId } from "react";
import { X } from "lucide-react";
import RejectionReasonField from "@/components/form/RejectionReasonField";
import Button from "@/components/ui/Button";

interface RejectDialogProps {
  applicantName?: string;
  reason: string;
  onReasonChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  busy: boolean;
}

export default function RejectDialog({
  applicantName,
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  busy,
}: RejectDialogProps) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 id={titleId} className="text-lg font-semibold text-brand">
            Reject application
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close rejection dialog"
            className="rounded-lg p-2 hover:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-2 text-sm text-gray-500">
          Enter the reason for rejecting {applicantName ? `${applicantName}’s` : "this"}{" "}
          application. The user will be able to see this reason.
        </p>

        <RejectionReasonField
          hideLabel
          value={reason}
          onChange={onReasonChange}
          placeholder="Explain what needs to be corrected..."
          className="mt-5"
        />

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" disabled={!reason.trim() || busy} onClick={onConfirm}>
            Confirm rejection
          </Button>
        </div>
      </div>
    </div>
  );
}
