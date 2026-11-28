"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, ShieldAlert } from "lucide-react";
import RejectionNotice from "@/components/admin/RejectionNotice";
import ReviewPanel from "@/components/admin/ReviewPanel";
import AddressCard from "@/components/profile/AddressCard";
import DocumentsCard from "@/components/profile/DocumentsCard";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import ErrorScreen from "@/components/ui/ErrorScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useApplicantDetails } from "@/hooks/useApplicantDetails";
import { useReviewActions } from "@/hooks/useReviewActions";

export default function AdminUserDetailsPage() {
  const router = useRouter();
  const { id: userId } = useParams<{ id: string }>();
  const { user, loading, error, setError, reload, retry } = useApplicantDetails(userId);
  const review = useReviewActions({ onChanged: reload, onError: setError });

  if (loading) return <LoadingScreen />;

  if (!user) {
    return error ? (
      <ErrorScreen
        message={error}
        onRetry={retry}
        icon={<ShieldAlert className="mx-auto text-red-600" size={36} aria-hidden="true" />}
      />
    ) : null;
  }

  return (
    <main className="min-h-screen bg-canvas">
      <header className="border-b border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-4 sm:px-8">
          <p className="text-xs tracking-widest text-brand-muted">MOSAIC ADMINISTRATION</p>
          <h1 className="mt-1 font-semibold text-brand">Applicant details</h1>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <Button
          variant="link"
          className="mb-7 text-sm"
          onClick={() => router.push("/admin/dashboard")}
          icon={<ArrowLeft size={17} />}
        >
          Back to applications
        </Button>

        {error && <Alert className="mb-5">{error}</Alert>}

        <ProfileSummaryCard user={user} fallbackName="Applicant">
          <p className="mt-2 text-sm text-gray-500">Applicant ID: {user._id}</p>
        </ProfileSummaryCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <PersonalInfoCard user={user} variant="admin" />
          <AddressCard address={user.address} variant="admin" />
        </div>

        <DocumentsCard documents={user.documents} variant="cards" className="mt-6" />

        {user.rejectionReason && <RejectionNotice reason={user.rejectionReason} />}

        <ReviewPanel
          user={user}
          busy={review.pendingId === user._id}
          onApprove={() => review.approve(user)}
          onReject={(reason) => review.reject(user, reason)}
        />

        <div className="mt-6 text-center">
          <Button variant="link" className="text-sm" onClick={reload} icon={<RefreshCw size={15} />}>
            Refresh applicant details
          </Button>
        </div>
      </div>
    </main>
  );
}
