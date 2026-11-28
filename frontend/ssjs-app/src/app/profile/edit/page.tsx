"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileFormShell from "@/components/profile/ProfileFormShell";
import ErrorScreen from "@/components/ui/ErrorScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import { profileToForm } from "@/lib/profile-form";
import { userService } from "@/services/user.service";
import type { ProfilePayload, User } from "@/types/user";

const SUCCESS_REDIRECT_DELAY_MS = 1800;

const redirectUnlessApproved = (profile: User) =>
  profile.status === "APPROVED" ? null : "/account-settings";

const updateProfile = (payload: ProfilePayload) =>
  userService.updateApprovedProfile(payload);

export default function EditApprovedProfilePage() {
  const router = useRouter();
  const { user, loading, error, reload } = useUserProfile({
    fallbackError: "Unable to load your profile.",
    redirectFor: redirectUnlessApproved,
  });

  if (loading) return <LoadingScreen />;
  if (error || !user) {
    return <ErrorScreen message={error || "Profile not found."} onRetry={reload} />;
  }

  return (
    <ProfileFormShell
      above={
        <Link
          href="/account-settings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
        >
          <ArrowLeft size={17} aria-hidden="true" /> Back to account settings
        </Link>
      }
      hero={
        <>
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
              <Sparkles size={21} aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs tracking-[0.2em] text-brand-light">MOSAIC MEMBERSHIP</p>
              <h1 className="mt-1 text-2xl font-semibold sm:text-3xl">Edit your profile</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Keep your membership information up to date.
          </p>
        </>
      }
    >
      <ProfileForm
        variant="edit"
        initialValues={profileToForm(user)}
        onSubmit={updateProfile}
        successMessage="Your profile has been updated successfully"
        successDelayMs={SUCCESS_REDIRECT_DELAY_MS}
        onSuccess={() => router.push("/account-settings")}
        cancelHref="/account-settings"
      />
    </ProfileFormShell>
  );
}
