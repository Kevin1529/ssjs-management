"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  FileText,
  MapPin,
  PencilLine,
  RefreshCw,
  ShieldAlert,
  UserRound,
} from "lucide-react";

import { userService } from "@/services/user.service";
import { formatDate, formatDateTime } from "@/lib/date-format";
import type { User } from "@/types/user";

const statusStyle: Record<User["status"], string> = {
  PROFILE_PENDING: "bg-gray-100 text-gray-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AccountSettingsPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const response = await userService.getMyProfile();

        if (!response?.profile) {
          throw new Error("Unable to find your profile.");
        }

        const profile = response.profile;

        if (profile.status === "PROFILE_PENDING") {
          router.replace("/profile");
          return;
        }

        if (active) {
          setUser(profile);
          setError("");
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load account settings.";

        if (/token|session|authentication|unauthorized|login/i.test(message)) {
          router.replace("/");
          return;
        }

        if (active) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadUser();

    return () => {
      active = false;
    };
  }, [retryCount, router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF]">
        <RefreshCw className="animate-spin text-[#173F35]" />
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF] p-6">
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
          <p className="text-red-600">{error || "Profile not found."}</p>
          <button
            onClick={() => {
              setError("");
              setLoading(true);
              setRetryCount((count) => count + 1);
            }}
            className="mt-5 rounded-xl bg-[#173F35] px-5 py-3 text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const approved = user.status === "APPROVED";
  const rejected = user.status === "REJECTED";

  return (
    <main className="min-h-screen bg-[#F6F5EF]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm text-[#78917F]">ACCOUNT SETTINGS</p>
            <h2 className="mt-2 text-3xl font-semibold text-[#173F35]">
              Hello, {user.fullName || "there"}!
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Review your profile and the latest update on your membership.
            </p>
          </div>
          {approved && (
            <Link
              href="/profile/edit"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#245747]"
            >
              <PencilLine size={17} />
              Edit profile
            </Link>
          )}
        </div>

        <section className="mb-7 rounded-3xl border border-[#E8EAE2] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#E8F0E7] text-[#173F35]">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={`${user.fullName || "Member"} profile`}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={40} />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-[#173F35]">
                  {user.fullName || "Name not provided"}
                </h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[user.status]
                  }`}
                >
                  {user.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {user.email || "Email not provided"}
              </p>
              <p className="mt-1 text-sm text-gray-500">{user.mobileNumber}</p>
              {user.uniqueUserId && (
                <p className="mt-2 text-sm font-semibold text-[#47765C]">
                  Membership ID: {user.uniqueUserId}
                </p>
              )}
            </div>
          </div>
        </section>

        {user.status === "PENDING_APPROVAL" && (
          <section className="rounded-3xl border border-[#E9D8B6] bg-[#FFF9ED] p-7 sm:p-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F7E9C9] text-[#98702E]">
              <Clock3 size={28} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-[#98702E]">
              APPLICATION UNDER REVIEW
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-[#4D402A]">
              Your application is in good hands.
            </h3>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#806E50]">
              We&apos;ve received your details. Our team will review your
              application and update your membership status here.
            </p>
            <div className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[#806E50]">
              <Clock3 size={16} />
              Pending approval
            </div>
          </section>
        )}

        {rejected && (
          <section className="rounded-3xl border border-red-200 bg-red-50 p-7 sm:p-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
              <ShieldAlert size={28} />
            </div>
            <p className="text-xs font-semibold tracking-widest text-red-700">
              ACTION REQUIRED
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-red-950">
              Your application needs an update.
            </h3>
            <p className="mt-3 text-sm leading-6 text-red-800">
              {user.rejectionReason || "Please review and update your profile."}
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#173F35] px-6 py-3 text-sm font-medium text-white hover:bg-[#245747]"
            >
              Update and resubmit
              <RefreshCw size={16} />
            </button>
          </section>
        )}

        {/* {approved && (
          <section className="overflow-hidden rounded-3xl bg-[#173F35] p-7 text-white shadow-xl sm:p-10">
            <div className="flex flex-col justify-between gap-8 sm:flex-row">
              <div>
                <div className="flex items-center gap-2 text-[#D5E6D7]">
                  <BadgeCheck size={20} />
                  <span className="text-xs font-semibold tracking-widest">
                    OFFICIAL MEMBER
                  </span>
                </div>

                <h3 className="mt-6 font-serif text-3xl italic sm:text-4xl">
                  Welcome to Mosaic.
                </h3>
                <p className="mt-3 text-sm text-white/65">
                  Your membership has been approved.
                </p>
              </div>

              <div className="rounded-2xl border border-white/20 bg-white/10 p-5 sm:min-w-56">
                <p className="text-xs tracking-widest text-white/60">
                  MEMBERSHIP ID
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-wider">
                  {user.uniqueUserId || "Not assigned"}
                </p>
                <p className="mt-2 text-xs text-[#D5E6D7]">
                  Verified membership
                </p>
              </div>
            </div>

            <div className="mt-9 flex items-center justify-between border-t border-white/15 pt-5 text-xs text-white/50">
              <span>{user.fullName}</span>
              <span>MOSAIC MEMBERSHIP</span>
            </div>
          </section>
        )} */}

        <section className="mt-8 space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#E8EAE2] bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <UserRound
                  className="text-[#47765C]"
                  size={21}
                />
                <h3 className="font-semibold text-[#173F35]">
                  Personal information
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileDetail
                  label="Full name"
                  value={user.fullName}
                />
                <ProfileDetail
                  label="Email address"
                  value={user.email}
                />
                <ProfileDetail
                  label="Mobile number"
                  value={user.mobileNumber}
                />
                <ProfileDetail
                  label="Date of birth"
                  value={formatDate(user.dateOfBirth)}
                />
                <ProfileDetail
                  label="Gender"
                  value={
                    user.gender
                      ? user.gender.charAt(0) +
                        user.gender.slice(1).toLowerCase()
                      : undefined
                  }
                />
                <ProfileDetail
                  label="Application status"
                  value={user.status.replaceAll("_", " ")}
                />
                <ProfileDetail
                  label="Last updated"
                  value={formatDateTime(user.updatedAt)}
                />
                <ProfileDetail
                  label="Submitted"
                  value={formatDateTime(user.createdAt)}
                />
                {user.approvedAt && (
                  <ProfileDetail
                    label="Approved"
                    value={formatDateTime(user.approvedAt)}
                  />
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E8EAE2] bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <MapPin
                  className="text-[#47765C]"
                  size={21}
                />
                <h3 className="font-semibold text-[#173F35]">
                  Residential address
                </h3>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileDetail
                  label="Address"
                  value={user.address?.addressLine}
                />
                <ProfileDetail
                  label="City"
                  value={user.address?.city}
                />
                <ProfileDetail
                  label="State"
                  value={user.address?.state}
                />
                <ProfileDetail
                  label="Country"
                  value={user.address?.country}
                />
                <ProfileDetail
                  label="PIN code"
                  value={user.address?.pincode}
                />
              </div>
            </section>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="rounded-2xl border border-[#E8EAE2] bg-white p-6">
              <div className="mb-5 flex items-center gap-3">
                <FileText
                  className="text-[#47765C]"
                  size={21}
                />
                <h3 className="font-semibold text-[#173F35]">
                  Supporting documents
                </h3>
              </div>
              {user.documents?.length ? (
                <ul className="space-y-2">
                  {user.documents.map((document, index) => (
                    <li key={`${document}-${index}`}>
                      <a
                        href={document}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-[#29473D] underline hover:text-[#173F35]"
                      >
                        <FileText size={16} />
                        Document {index + 1}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  No supporting documents uploaded.
                </p>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProfileDetail({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 break-words text-sm font-medium text-[#29473D]">
        {value || "Not provided"}
      </p>
    </div>
  );
}
