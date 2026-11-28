"use client";

import MembershipCard from "@/components/profile/MembershipCard";
import ErrorScreen from "@/components/ui/ErrorScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { User } from "@/types/user";

const redirectUnlessApproved = (profile: User) =>
  profile.status === "APPROVED" ? null : "/account-settings";

export default function DashboardPage() {
  const { user, loading, error, reload } = useUserProfile({
    fallbackError: "Unable to load your dashboard.",
    redirectFor: redirectUnlessApproved,
  });

  if (loading) return <LoadingScreen />;
  if (error || !user) {
    return <ErrorScreen message={error || "Profile not found."} onRetry={reload} />;
  }

  return (
    <main className="min-h-screen bg-canvas px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm tracking-widest text-brand-muted">MOSAIC MEMBERSHIP</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand">
          Welcome, {user.fullName || "member"}.
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your membership is active. View your account details or membership ID below.
        </p>

        <MembershipCard membershipId={user.uniqueUserId} />
      </div>
    </main>
  );
}
