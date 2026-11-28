"use client";

import { useRouter } from "next/navigation";
import ProfileForm from "@/components/profile/ProfileForm";
import ProfileFormShell from "@/components/profile/ProfileFormShell";
import BrandLogo from "@/components/ui/BrandLogo";
import ErrorScreen from "@/components/ui/ErrorScreen";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { useUserProfile } from "@/hooks/useUserProfile";
import { profileToForm } from "@/lib/profile-form";
import { userService } from "@/services/user.service";
import type { ProfilePayload, User } from "@/types/user";

/** Only users who still have to submit (or resubmit) a profile belong here. */
function redirectIfAlreadySubmitted(profile: User) {
  if (profile.status === "APPROVED") return "/dashboard";
  if (profile.status === "PENDING_APPROVAL") return "/account-settings";
  return null;
}

const createProfile = (payload: ProfilePayload) => userService.createProfile(payload);

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, error, reload } = useUserProfile({
    fallbackError: "Unable to load your profile.",
    redirectFor: redirectIfAlreadySubmitted,
  });

  if (loading) return <LoadingScreen />;
  if (error || !user) {
    return <ErrorScreen message={error || "Profile not found."} onRetry={reload} />;
  }

  return (
    <ProfileFormShell
      above={
        <div className="mb-8">
          <BrandLogo size="md" />
        </div>
      }
      hero={
        <div className="py-1">
          <p className="text-xs tracking-[0.2em] text-brand-light">YOUR MEMBERSHIP JOURNEY</p>
          <h1 className="mt-3 text-3xl font-semibold">Tell us about yourself.</h1>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Complete your profile so we can get to know you better.
          </p>
        </div>
      }
    >
      <ProfileForm
        variant="create"
        initialValues={profileToForm(user)}
        onSubmit={createProfile}
        onSuccess={() => router.push("/account-settings")}
      />
    </ProfileFormShell>
  );
}
