"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, RefreshCw } from "lucide-react";
import { userService } from "@/services/user.service";
import type { User } from "@/types/user";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      try {
        const response = await userService.getMyProfile();
        const profile = response.profile;

        if (!profile) {
          throw new Error("Unable to find your profile.");
        }

        if (profile.status !== "APPROVED") {
          router.replace("/account-settings");
          return;
        }

        if (active) {
          setUser(profile);
          setError("");
        }
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Unable to load your dashboard.";

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

  return (
    <main className="min-h-screen bg-[#F6F5EF] px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm tracking-widest text-[#78917F]">
          MOSAIC MEMBERSHIP
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-[#173F35]">
          Welcome, {user.fullName || "member"}.
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Your membership is active. View your account details or membership ID
          below.
        </p>

        <section className="mt-8 overflow-hidden rounded-3xl bg-[#173F35] p-7 text-white shadow-xl sm:p-10">
          <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2 text-[#D5E6D7]">
                <BadgeCheck size={20} />
                <span className="text-xs font-semibold tracking-widest">
                  OFFICIAL MEMBER
                </span>
              </div>
              <h2 className="mt-5 font-serif text-3xl italic sm:text-4xl">
                Welcome to Mosaic.
              </h2>
              <p className="mt-3 text-sm text-white/65">
                Your application has been approved.
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
        </section>

      </div>
    </main>
  );
}
