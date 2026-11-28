"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import PendingApplicationItem from "@/components/admin/PendingApplicationItem";
import RejectDialog from "@/components/admin/RejectDialog";
import StatsGrid from "@/components/admin/StatsGrid";
import SearchField from "@/components/form/SearchField";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { useReviewActions } from "@/hooks/useReviewActions";
import { matchesUserSearch } from "@/lib/user-search";
import type { User } from "@/types/user";

export default function AdminDashboard() {
  const router = useRouter();
  const { users, stats, loading, error, setError, reload } = useAdminDashboard();
  const review = useReviewActions({ onChanged: reload, onError: setError });

  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredUsers = useMemo(
    () => users.filter((user) => matchesUserSearch(user, search)),
    [users, search],
  );

  const openReject = (user: User) => {
    setRejectTarget(user);
    setRejectionReason("");
  };

  const closeReject = useCallback(() => setRejectTarget(null), []);

  const confirmReject = async () => {
    if (!rejectTarget || !rejectionReason.trim()) return;
    if (await review.reject(rejectTarget, rejectionReason)) closeReject();
  };

  return (
    <main className="min-h-screen bg-canvas">
      <AdminPageHeader title="Membership overview" onRefresh={reload} refreshing={loading} />

      <div className="p-5 sm:p-9">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-brand">Good day, Admin.</h2>
          <p className="mt-2 text-sm text-gray-500">
            Review and manage incoming membership applications.
          </p>
        </div>

        <StatsGrid stats={stats} />

        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-col justify-between gap-4 border-b border-line-soft p-5 sm:flex-row sm:items-center sm:p-6">
            <div>
              <h3 className="font-semibold text-brand">Applications to review</h3>
              <p className="mt-1 text-xs text-gray-400">
                Review applicant details before making a decision.
              </p>
            </div>

            <SearchField
              label="Search applications"
              hideLabel
              value={search}
              onChange={setSearch}
              placeholder="Search name, email or mobile"
              className="sm:w-72"
            />
          </div>

          {error && <Alert className="m-5">{error}</Alert>}

          {loading ? (
            <div className="flex justify-center p-16">
              <Spinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <EmptyState
              icon={UserRound}
              title="No applications found"
              description="There are no matching pending applications."
            />
          ) : (
            <div className="divide-y divide-line-soft">
              {filteredUsers.map((user) => (
                <PendingApplicationItem
                  key={user._id}
                  user={user}
                  disabled={review.isBusy}
                  processing={review.pendingId === user._id}
                  onView={() => router.push(`/admin/users/${user._id}`)}
                  onApprove={() => review.approve(user)}
                  onReject={() => openReject(user)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {rejectTarget && (
        <RejectDialog
          applicantName={rejectTarget.fullName}
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
          onCancel={closeReject}
          onConfirm={confirmReject}
          busy={review.isBusy}
        />
      )}
    </main>
  );
}
