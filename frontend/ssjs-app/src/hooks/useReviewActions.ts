"use client";

import { useCallback, useState } from "react";
import { getErrorMessage } from "@/lib/errors";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/user";

interface Options {
  /** Called after a successful approve or reject (e.g. to reload data). */
  onChanged: () => Promise<unknown> | void;
  onError: (message: string) => void;
}

/** Approve/reject actions shared by the admin dashboard and detail pages. */
export function useReviewActions({ onChanged, onError }: Options) {
  const [pendingId, setPendingId] = useState("");

  const run = useCallback(
    async (userId: string, action: () => Promise<void>, fallback: string) => {
      setPendingId(userId);
      try {
        await action();
        await onChanged();
        return true;
      } catch (error) {
        onError(getErrorMessage(error, fallback));
        return false;
      } finally {
        setPendingId("");
      }
    },
    [onChanged, onError],
  );

  const approve = useCallback(
    async (user: User) => {
      if (!window.confirm(`Approve ${user.fullName || "this member"}?`)) {
        return false;
      }

      return run(
        user._id,
        async () => {
          const result = await adminService.approveUser(user._id);
          alert(
            `User approved successfully. Membership ID: ${
              result.uniqueUserId || "Generated"
            }`,
          );
        },
        "Approval failed.",
      );
    },
    [run],
  );

  const reject = useCallback(
    (user: User, reason: string) =>
      run(
        user._id,
        async () => {
          await adminService.rejectUser(user._id, reason.trim());
        },
        "Rejection failed.",
      ),
    [run],
  );

  return { pendingId, isBusy: pendingId !== "", approve, reject };
}
