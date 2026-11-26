"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";

import { adminService } from "@/services/admin.service";
import { formatDate, formatDateTime } from "@/lib/date-format";
import type { User } from "@/types/user";

export default function AdminUserDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF]">
          <RefreshCw className="animate-spin text-[#173F35]" size={28} />
        </main>
      }
    >
      <AdminUserDetailsContent />
    </Suspense>
  );
}

function AdminUserDetailsContent() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const userId = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getUserDetails(userId);
      setUser(response.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load user details.";

      if (
        /token|session|authentication|unauthorized|login/i.test(message)
      ) {
        router.replace("/admin/login");
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [userId, router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const approve = async () => {
    if (!user) return;

    if (!window.confirm(`Approve ${user.fullName || "this member"}?`)) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      const response = await adminService.approveUser(user._id);

      alert(
        `User approved successfully. Membership ID: ${
          response.uniqueUserId || "Generated"
        }`,
      );

      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async () => {
    if (!user || !rejectionReason.trim()) {
      setError("Please enter a rejection reason.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");

      await adminService.rejectUser(user._id, rejectionReason.trim());

      setShowRejectForm(false);
      setRejectionReason("");

      await loadUser();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const statusStyle: Record<string, string> = {
    PROFILE_PENDING: "bg-gray-100 text-gray-700",
    PENDING_APPROVAL: "bg-amber-100 text-amber-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF]">
        <RefreshCw
          className="animate-spin text-[#173F35]"
          size={28}
        />
      </main>
    );
  }

  if (error && !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F5EF] p-5">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow">
          <ShieldAlert
            className="mx-auto text-red-600"
            size={36}
          />
          <p className="mt-4 text-sm text-red-600">{error}</p>

          <button
            onClick={loadUser}
            className="mt-5 rounded-xl bg-[#173F35] px-5 py-3 text-sm text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const isPending = user.status === "PENDING_APPROVAL";

  return (
    <main className="min-h-screen bg-[#F6F5EF]">
      <header className="border-b border-[#E8EAE2] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs tracking-widest text-[#78917F]">
              MOSAIC ADMINISTRATION
            </p>
            <h1 className="mt-1 font-semibold text-[#173F35]">
              Applicant details
            </h1>
          </div>

        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-7 flex items-center gap-2 text-sm text-[#47765C] hover:text-[#173F35]"
        >
          <ArrowLeft size={17} />
          Back to applications
        </button>

        {error && (
          <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="mb-7 rounded-3xl border border-[#E8EAE2] bg-white p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#E8F0E7] text-[#173F35]">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt={`${user.fullName || "Applicant"} profile`}
                  width={96}
                  height={96}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <UserRound size={40} />
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold text-[#173F35]">
                  {user.fullName || "Name not provided"}
                </h2>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyle[user.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {user.status.replaceAll("_", " ")}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Applicant ID: {user._id}
              </p>

              {user.uniqueUserId && (
                <p className="mt-2 text-sm font-semibold text-[#47765C]">
                  Membership ID: {user.uniqueUserId}
                </p>
              )}
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-[#E8EAE2] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <UserRound
                className="text-[#47765C]"
                size={21}
              />
              <h3 className="font-semibold text-[#173F35]">
                Personal information
              </h3>
            </div>

            <div className="space-y-5">
              <Detail
                icon={<UserRound size={17} />}
                label="Full name"
                value={user.fullName}
              />
              <Detail
                icon={<Mail size={17} />}
                label="Email address"
                value={user.email}
              />
              <Detail
                icon={<Phone size={17} />}
                label="Mobile number"
                value={user.mobileNumber}
              />
              <Detail
                icon={<CalendarDays size={17} />}
                label="Date of birth"
                value={formatDate(user.dateOfBirth)}
              />
              <Detail
                icon={<UserRound size={17} />}
                label="Gender"
                value={user.gender}
              />
              <Detail
                icon={<CalendarDays size={17} />}
                label="Last updated"
                value={formatDateTime(user.updatedAt)}
              />
              <Detail
                icon={<CalendarDays size={17} />}
                label="Created on"
                value={formatDateTime(user.createdAt)}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8EAE2] bg-white p-6">
            <div className="mb-6 flex items-center gap-3">
              <MapPin
                className="text-[#47765C]"
                size={21}
              />
              <h3 className="font-semibold text-[#173F35]">
                Address information
              </h3>
            </div>

            <div className="space-y-5">
              <Detail
                icon={<MapPin size={17} />}
                label="Address"
                value={user.address?.addressLine}
              />
              <Detail
                icon={<MapPin size={17} />}
                label="City"
                value={user.address?.city}
              />
              <Detail
                icon={<MapPin size={17} />}
                label="State"
                value={user.address?.state}
              />
              <Detail
                icon={<MapPin size={17} />}
                label="Country"
                value={user.address?.country}
              />
              <Detail
                icon={<MapPin size={17} />}
                label="Pincode"
                value={user.address?.pincode}
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-[#E8EAE2] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <FileText
              className="text-[#47765C]"
              size={21}
            />
            <h3 className="font-semibold text-[#173F35]">Uploaded documents</h3>
          </div>

          {user.documents && user.documents.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {user.documents.map((document, index) => (
                <a
                  key={`${document}-${index}`}
                  href={document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-[#E8EAE2] p-4 text-sm text-[#29473D] hover:bg-[#F6F5EF]"
                >
                  <span className="flex items-center gap-3">
                    <FileText size={19} />
                    Document {index + 1}
                  </span>
                  <span className="text-xs text-[#47765C]">View file ↗</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-[#F6F5EF] p-5 text-sm text-gray-500">
              No documents uploaded.
            </p>
          )}
        </section>

        {user.rejectionReason && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <div className="flex items-center gap-3 text-red-700">
              <ShieldAlert size={20} />
              <h3 className="font-semibold">Rejection reason</h3>
            </div>
            <p className="mt-3 text-sm text-red-800">{user.rejectionReason}</p>
          </section>
        )}

        <section className="mt-6 rounded-2xl border border-[#E8EAE2] bg-white p-6">
          <h3 className="font-semibold text-[#173F35]">Application review</h3>

          {isPending ? (
            <>
              <p className="mt-2 text-sm text-gray-500">
                Review the applicant's details and documents before making a
                decision.
              </p>

              {showRejectForm && (
                <div className="mt-5">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Reason for rejection
                  </label>

                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    rows={4}
                    placeholder="Explain why this application is being rejected..."
                    className="input min-h-28 resize-y"
                  />
                </div>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={approve}
                  disabled={actionLoading}
                  className="flex items-center gap-2 rounded-xl bg-[#173F35] px-5 py-3 text-sm font-medium text-white hover:bg-[#245747] disabled:opacity-50"
                >
                  <CheckCircle2 size={17} />
                  {actionLoading ? "Processing..." : "Approve application"}
                </button>

                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={actionLoading}
                    className="flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <XCircle size={17} />
                    Reject application
                  </button>
                ) : (
                  <>
                    <button
                      onClick={reject}
                      disabled={actionLoading || !rejectionReason.trim()}
                      className="rounded-xl bg-red-600 px-5 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {actionLoading ? "Processing..." : "Confirm rejection"}
                    </button>

                    <button
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason("");
                        setError("");
                      }}
                      disabled={actionLoading}
                      className="rounded-xl border border-gray-200 px-5 py-3 text-sm text-gray-600"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              {user.status === "APPROVED" ? (
                <BadgeCheck
                  className="text-green-600"
                  size={19}
                />
              ) : user.status === "REJECTED" ? (
                <ShieldAlert
                  className="text-red-600"
                  size={19}
                />
              ) : (
                <Clock3 size={19} />
              )}
              This application is currently{" "}
              {user.status.replaceAll("_", " ").toLowerCase()}.
            </div>
          )}
        </section>

        <div className="mt-6 text-center">
          <button
            onClick={loadUser}
            className="inline-flex items-center gap-2 text-sm text-[#47765C] hover:text-[#173F35]"
          >
            <RefreshCw size={15} />
            Refresh applicant details
          </button>
        </div>
      </div>
    </main>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-[#78917F]">{icon}</span>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="mt-1 text-sm font-medium text-[#29473D]">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}
