"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Search,
  RefreshCw,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { adminService } from "@/services/admin.service";
import type { User, UserStatus } from "@/types/user";

const PAGE_SIZE = 10;

const statusOptions = [
  "ALL",
  "PROFILE_PENDING",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
] as const;

const statusLabel: Record<string, string> = {
  ALL: "All statuses",
  PROFILE_PENDING: "Profile pending",
  PENDING_APPROVAL: "Pending approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

const statusStyle: Record<string, string> = {
  PROFILE_PENDING: "bg-gray-100 text-gray-700",
  PENDING_APPROVAL: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
};

export default function MemberDirectoryPage() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<"ALL" | UserStatus>("ALL");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch members from backend
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await adminService.getAllUsers({
        page,
        limit: PAGE_SIZE,
        search: searchTerm,
        status,
      });

      setUsers(response.users || []);
      setTotalCount(response.totalCount || 0);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load members.";

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
  }, [page, searchTerm, status, router]);

  // The protected API request validates the HttpOnly admin cookie.
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const changeStatus = (value: string) => {
    setStatus(value as "ALL" | UserStatus);
    setPage(1);
  };

  const getStatusBadge = (userStatus: UserStatus) => {
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          statusStyle[userStatus] || "bg-gray-100 text-gray-700"
        }`}
      >
        {statusLabel[userStatus] || userStatus}
      </span>
    );
  };

  return (
    <main className="min-h-screen bg-[#F6F5EF]">
      {/* Main content */}
      <section>
        <header className="flex flex-col justify-between gap-4 border-b border-[#E8EAE2] bg-white px-5 py-5 sm:flex-row sm:items-center sm:px-9">
          <div>
            <p className="text-xs tracking-widest text-[#78917F]">
              ADMINISTRATION
            </p>
            <h1 className="mt-1 text-xl font-semibold text-[#173F35]">
              Member Directory
            </h1>
          </div>

          <button
            onClick={loadUsers}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#E4E9E2] px-5 py-3 text-sm text-[#29473D] hover:bg-[#F6F5EF] disabled:opacity-50"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </header>

        <div className="p-5 sm:p-9">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-[#173F35]">
              All Members
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Search, filter and manage registered members.
            </p>
          </div>

          {/* Total members */}
          <div className="mb-6 rounded-2xl border border-[#E8EAE2] bg-white p-5">
            <p className="text-sm text-gray-500">Total matching members</p>
            <p className="mt-2 text-3xl font-semibold text-[#173F35]">
              {totalCount}
            </p>
          </div>

          {/* Search and filters */}
          <section className="mb-6 rounded-2xl border border-[#E8EAE2] bg-white p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#29473D]">
                  Search members
                </label>

                <div className="relative">
                  <Search
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, email, mobile or membership ID"
                    className="input pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#29473D]">
                  Filter by status
                </label>

                <select
                  value={status}
                  onChange={(e) => changeStatus(e.target.value)}
                  className="input"
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                    >
                      {statusLabel[option]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Members table */}
          <section className="overflow-hidden rounded-2xl border border-[#E8EAE2] bg-white">
            <div className="border-b border-[#EDF0EA] p-5">
              <h3 className="font-semibold text-[#173F35]">
                Registered Members
              </h3>
              <p className="mt-1 text-xs text-gray-400">
                Showing {users.length} of {totalCount} matching members
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center p-16">
                <RefreshCw className="animate-spin text-[#173F35]" />
              </div>
            ) : users.length === 0 ? (
              <div className="p-16 text-center">
                <Users
                  size={35}
                  className="mx-auto text-gray-300"
                />
                <h4 className="mt-4 font-semibold text-[#173F35]">
                  No members found
                </h4>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or status filter.
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[850px] text-left">
                    <thead className="bg-[#F8F9F5] text-xs text-gray-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">Member</th>
                        <th className="px-6 py-4 font-medium">Membership ID</th>
                        <th className="px-6 py-4 font-medium">Mobile</th>
                        <th className="px-6 py-4 font-medium">Status</th>
                        <th className="px-6 py-4 font-medium">Registered</th>
                        <th className="px-6 py-4 text-right font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-[#EDF0EA]">
                      {users.map((user) => (
                        <tr
                          key={user._id}
                          className="hover:bg-[#FAFBF8]"
                        >
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-[#173F35]">
                                {user.fullName || "Name not provided"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                {user.email || "-"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.uniqueUserId || "-"}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-600">
                            {user.mobileNumber}
                          </td>

                          <td className="px-6 py-4">
                            {getStatusBadge(user.status)}
                          </td>

                          <td className="px-6 py-4 text-sm text-gray-500">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "en-IN",
                                )
                              : "-"}
                          </td>

                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() =>
                                router.push(`/admin/users/${user._id}`)
                              }
                              className="inline-flex items-center gap-2 rounded-lg border border-[#E4E9E2] px-3 py-2 text-xs font-medium text-[#29473D] hover:bg-[#F6F5EF]"
                            >
                              <Eye size={15} />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-col justify-between gap-4 border-t border-[#EDF0EA] p-5 sm:flex-row sm:items-center">
                  <p className="text-sm text-gray-500">
                    Page {page} of {Math.max(totalPages, 1)}
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={page <= 1 || loading}
                      onClick={() => setPage((current) => current - 1)}
                      className="flex items-center gap-2 rounded-lg border border-[#E4E9E2] px-4 py-2 text-sm text-[#29473D] hover:bg-[#F6F5EF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>

                    <button
                      disabled={page >= totalPages || loading}
                      onClick={() => setPage((current) => current + 1)}
                      className="flex items-center gap-2 rounded-lg border border-[#E4E9E2] px-4 py-2 text-sm text-[#29473D] hover:bg-[#F6F5EF] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}
