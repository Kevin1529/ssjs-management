"use client";

import { PencilLine } from "lucide-react";
import AddressCard from "@/components/profile/AddressCard";
import DocumentsCard from "@/components/profile/DocumentsCard";
import PendingApprovalBanner from "@/components/profile/PendingApprovalBanner";
import PersonalInfoCard from "@/components/profile/PersonalInfoCard";
import ProfileSummaryCard from "@/components/profile/ProfileSummaryCard";
import RejectedBanner from "@/components/profile/RejectedBanner";
import ButtonLink from "@/components/ui/ButtonLink";
import ErrorScreen from "@/components/ui/ErrorScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { User } from "@/types/user";

const redirectIfProfileIncomplete = (profile: User) =>
  profile.status === "PROFILE_PENDING" ? "/profile" : null;

export default function AccountSettingsPage() {
  const { user, loading, error, reload } = useUserProfile({
    fallbackError: "Unable to load account settings.",
    redirectFor: redirectIfProfileIncomplete,
  });

  if (loading) return <LoadingScreen />;
  if (error || !user) {
    return <ErrorScreen message={error || "Profile not found."} onRetry={reload} />;
  }

  return (
    <main className="min-h-screen bg-canvas">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-brand-muted">ACCOUNT SETTINGS</p>
            <h1 className="mt-2 text-3xl font-semibold text-brand">
              Hello, {user.fullName || "there"}!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review your profile and the latest update on your membership.
            </p>
          </div>

          {user.status === "APPROVED" && (
            <ButtonLink
              href="/profile/edit"
              className="shrink-0 font-semibold"
            >
              <PencilLine size={17} aria-hidden="true" />
              Edit profile
            </ButtonLink>
          )}
        </div>

        <ProfileSummaryCard user={user} fallbackName="Member">
          <p className="mt-2 text-sm text-gray-500">{user.email || "Email not provided"}</p>
          <p className="mt-1 text-sm text-gray-500">{user.mobileNumber}</p>
        </ProfileSummaryCard>

        {user.status === "PENDING_APPROVAL" && <PendingApprovalBanner />}
        {user.status === "REJECTED" && <RejectedBanner reason={user.rejectionReason} />}

        <div className="mt-8 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <PersonalInfoCard user={user} />
            <AddressCard address={user.address} />
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <DocumentsCard documents={user.documents} />
          </div>
        </div>
      </div>
    </main>
  );
}
