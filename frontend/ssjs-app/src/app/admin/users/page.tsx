"use client";

import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import MembersFilters from "@/components/admin/MembersFilters";
import MembersTable from "@/components/admin/MembersTable";
import Alert from "@/components/ui/Alert";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Spinner from "@/components/ui/Spinner";
import { useMembers } from "@/hooks/useMembers";

export default function MemberDirectoryPage() {
  const router = useRouter();
  const members = useMembers();

  return (
    <main className="min-h-screen bg-canvas">
      <AdminPageHeader
        title="Member Directory"
        onRefresh={members.refresh}
        refreshing={members.loading}
      />

      <div className="p-5 sm:p-9">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-brand">All Members</h2>
          <p className="mt-2 text-sm text-gray-500">
            Search, filter and manage registered members.
          </p>
        </div>

        <div className="mb-6 rounded-2xl border border-line bg-white p-5">
          <p className="text-sm text-gray-500">Total matching members</p>
          <p className="mt-2 text-3xl font-semibold text-brand">{members.totalCount}</p>
        </div>

        <MembersFilters
          search={members.search}
          onSearchChange={members.setSearch}
          status={members.status}
          onStatusChange={members.setStatus}
        />

        {members.error && <Alert className="mb-5">{members.error}</Alert>}

        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="border-b border-line-soft p-5">
            <h3 className="font-semibold text-brand">Registered Members</h3>
            <p className="mt-1 text-xs text-gray-400">
              Showing {members.users.length} of {members.totalCount} matching members
            </p>
          </div>

          {members.loading ? (
            <div className="flex justify-center p-16">
              <Spinner />
            </div>
          ) : members.users.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No members found"
              description="Try changing your search or status filter."
            />
          ) : (
            <>
              <MembersTable
                users={members.users}
                onView={(user) => router.push(`/admin/users/${user._id}`)}
              />
              <Pagination
                page={members.page}
                totalPages={members.totalPages}
                disabled={members.loading}
                onPageChange={members.setPage}
              />
            </>
          )}
        </section>
      </div>
    </main>
  );
}
