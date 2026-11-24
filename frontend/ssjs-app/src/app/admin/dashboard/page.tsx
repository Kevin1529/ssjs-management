"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  Clock3,
  LogOut,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import { adminService } from "@/services/admin.service";
import type { User } from "@/types/user";

export default function AdminDashboard() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [stats, setStats] = useState({
    totalUsers: 0,
    approvedUsers: 0,
    pendingUsers: 0,
    rejectedUsers: 0,
    profilePendingUsers: 0,
  });

  const loadStats = useCallback(async () => {
    try {
      const response = await adminService.getDashboardStats();
      setStats(response.stats);
    } catch (err) {
      console.error("Unable to load dashboard statistics:", err);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      setError("");
      const response = await adminService.getPendingUsers();
      setUsers(response.users || []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load applications.";

      if (
        message.toLowerCase().includes("token") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        localStorage.removeItem("adminToken");
        router.replace("/admin/login");
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      router.replace("/admin/login");
      return;
    }

    loadUsers();
    loadStats();
  }, [router, loadUsers]);

  const approve = async (user: User) => {
    if (!window.confirm(`Approve ${user.fullName || "this member"}?`)) {
      return;
    }

    setActionLoading(user._id);

    try {
      const result = await adminService.approveUser(user._id);
      alert(`Approved successfully. Membership ID: ${result.uniqueUserId}`);
      await loadUsers();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Approval failed.");
    } finally {
      setActionLoading("");
    }
  };

  const reject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      return;
    }

    setActionLoading(selectedUser._id);

    try {
      await adminService.rejectUser(selectedUser._id, rejectionReason.trim());

      setSelectedUser(null);
      setRejectionReason("");
      await loadUsers();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Rejection failed.");
    } finally {
      setActionLoading("");
    }
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    router.replace("/admin/login");
  };

  const filteredUsers = users.filter((user) => {
    const searchValue = search.toLowerCase();

    return (
      user.fullName?.toLowerCase().includes(searchValue) ||
      user.mobileNumber.toLowerCase().includes(searchValue) ||
      user.email?.toLowerCase().includes(searchValue)
    );
  });

  return (
    <main className="min-h-screen bg-[#F6F5EF]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#173F35] p-6 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D5E6D7] text-[#173F35]">
            <ShieldCheck size={21} />
          </div>
          <div>
            <p className="font-semibold">Mosaic</p>
            <p className="text-[10px] tracking-widest text-white/50">
              ADMIN PANEL
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-2">
          <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm">
            <Clock3 size={18} />
            Pending applications
          </div>
        </div>

        <button
          onClick={logout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-sm text-white/65 hover:text-white"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <section className="lg:pl-64">
        <header className="flex items-center justify-between border-b border-[#E8EAE2] bg-white px-5 py-5 sm:px-9">
          <div>
            <p className="text-xs tracking-widest text-[#78917F]">
              ADMINISTRATION
            </p>
            <h1 className="mt-1 text-xl font-semibold text-[#173F35]">
              Membership overview
            </h1>
          </div>

          <button
            onClick={loadUsers}
            className="flex items-center gap-2 rounded-xl border border-[#E4E9E2] px-4 py-2 text-sm text-[#29473D] hover:bg-[#F6F5EF]"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </header>

        <div className="p-5 sm:p-9">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#173F35]">
              Good day, Admin.
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Review and manage incoming membership applications.
            </p>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total members",
                value: stats.totalUsers,
                icon: UserRound,
                color: "text-[#47765C]",
                description: "All registered users",
              },
              {
                label: "Approved",
                value: stats.approvedUsers,
                icon: BadgeCheck,
                color: "text-green-600",
                description: "Active memberships",
              },
              {
                label: "Pending approval",
                value: stats.pendingUsers,
                icon: Clock3,
                color: "text-amber-600",
                description: "Awaiting your review",
              },
              {
                label: "Rejected",
                value: stats.rejectedUsers,
                icon: ShieldCheck,
                color: "text-red-600",
                description: "Rejected applications",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-[#E8EAE2] bg-white p-6"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">{item.label}</p>
                    <Icon
                      size={21}
                      className={item.color}
                    />
                  </div>

                  <p className="mt-4 text-3xl font-semibold text-[#173F35]">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mb-6 text-xs text-gray-500">
            Incomplete profiles: {stats.profilePendingUsers}
          </p>

          <section className="overflow-hidden rounded-2xl border border-[#E8EAE2] bg-white">
            <div className="flex flex-col justify-between gap-4 border-b border-[#EDF0EA] p-5 sm:flex-row sm:items-center sm:p-6">
              <div>
                <h3 className="font-semibold text-[#173F35]">
                  Applications to review
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Review applicant details before making a decision.
                </p>
              </div>

              <div className="relative sm:w-72">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, email or mobile"
                  className="input pl-10"
                />
              </div>
            </div>

            {error && (
              <div className="m-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center p-16">
                <RefreshCw className="animate-spin text-[#173F35]" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F0E7] text-[#173F35]">
                  <UserRound size={25} />
                </div>
                <h4 className="mt-4 font-semibold text-[#173F35]">
                  No applications found
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  There are no matching pending applications.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EDF0EA]">
                {filteredUsers.map((user) => (
                  <article
                    key={user._id}
                    className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8F0E7] font-semibold text-[#173F35]">
                        {user.fullName?.charAt(0).toUpperCase() || "M"}
                      </div>

                      <div>
                        <h4 className="font-semibold text-[#173F35]">
                          {user.fullName || "Name not provided"}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {user.email}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {user.mobileNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => router.push(`/admin/users/${user._id}`)}
                        className="rounded-lg border border-[#E4E9E2] px-4 py-2 text-xs font-medium text-[#29473D] hover:bg-[#F6F5EF]"
                      >
                        View details
                      </button>

                      <button
                        disabled={!!actionLoading}
                        onClick={() => approve(user)}
                        className="rounded-lg bg-[#173F35] px-4 py-2 text-xs font-medium text-white hover:bg-[#245747] disabled:opacity-50"
                      >
                        {actionLoading === user._id
                          ? "Processing..."
                          : "Approve"}
                      </button>

                      <button
                        disabled={!!actionLoading}
                        onClick={() => {
                          setSelectedUser(user);
                          setRejectionReason("");
                        }}
                        className="rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </section>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#173F35]">
                Reject application
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                aria-label="Close rejection dialog"
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Enter the reason for rejecting {selectedUser.fullName}'s
              application. The user will be able to see this reason.
            </p>

            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explain what needs to be corrected..."
              className="input mt-5 resize-y"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setSelectedUser(null)}
                className="rounded-xl border border-[#E4E9E2] px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                disabled={!rejectionReason.trim() || !!actionLoading}
                onClick={reject}
                className="rounded-xl bg-red-700 px-4 py-2 text-sm text-white disabled:opacity-50"
              >
                Confirm rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
