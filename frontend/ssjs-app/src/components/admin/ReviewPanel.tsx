"use client";

import { useState } from "react";
import { BadgeCheck, CheckCircle2, Clock3, ShieldAlert, XCircle } from "lucide-react";
import RejectionReasonField from "@/components/form/RejectionReasonField";
import Button from "@/components/ui/Button";
import { humanizeStatus } from "@/lib/format";
import type { User } from "@/types/user";

interface ReviewPanelProps {
  user: User;
  busy: boolean;
  onApprove: () => void;
  /** Resolves true when the rejection succeeded (closes the form). */
  onReject: (reason: string) => Promise<boolean>;
}

function ResolvedStatus({ status }: { status: User["status"] }) {
  const icon =
    status === "APPROVED" ? (
      <BadgeCheck className="text-green-600" size={19} />
    ) : status === "REJECTED" ? (
      <ShieldAlert className="text-red-600" size={19} />
    ) : (
      <Clock3 size={19} />
    );

  return (
    <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
      {icon}
      This application is currently {humanizeStatus(status).toLowerCase()}.
    </div>
  );
}

export default function ReviewPanel({ user, busy, onApprove, onReject }: ReviewPanelProps) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [reason, setReason] = useState("");

  const closeForm = () => {
    setShowRejectForm(false);
    setReason("");
  };

  const confirmReject = async () => {
    if (await onReject(reason)) closeForm();
  };

  return (
    <section className="mt-6 rounded-2xl border border-line bg-white p-6">
      <h3 className="font-semibold text-brand">Application review</h3>

      {user.status !== "PENDING_APPROVAL" ? (
        <ResolvedStatus status={user.status} />
      ) : (
        <>
          <p className="mt-2 text-sm text-gray-500">
            Review the applicant&apos;s details and documents before making a decision.
          </p>

          {showRejectForm && (
            <RejectionReasonField value={reason} onChange={setReason} className="mt-5" />
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              disabled={busy}
              onClick={onApprove}
              icon={<CheckCircle2 size={17} />}
            >
              {busy ? "Processing..." : "Approve application"}
            </Button>

            {showRejectForm ? (
              <>
                <Button
                  variant="danger"
                  disabled={busy || !reason.trim()}
                  onClick={confirmReject}
                >
                  {busy ? "Processing..." : "Confirm rejection"}
                </Button>
                <Button variant="secondary" disabled={busy} onClick={closeForm}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                variant="dangerOutline"
                disabled={busy}
                onClick={() => setShowRejectForm(true)}
                icon={<XCircle size={17} />}
              >
                Reject application
              </Button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
