"use client";

import { useCallback, useEffect, useState } from "react";
import { ADMIN_LOGIN_PATH } from "@/lib/auth-routes";
import { useAuthErrorHandler } from "@/hooks/useAuthErrorHandler";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { adminService } from "@/services/admin.service";
import type { StatusFilter } from "@/types/admin";
import type { User } from "@/types/user";

export const MEMBERS_PAGE_SIZE = 10;

/** Server-side search, status filter and pagination for the member directory. */
export function useMembers() {
  const handleError = useAuthErrorHandler(ADMIN_LOGIN_PATH);

  const [search, setSearch] = useState("");
  const [status, setStatusState] = useState<StatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const searchTerm = useDebouncedValue(search.trim());

  // Go back to page 1 whenever a filter changes (adjusting state during render
  // avoids a wasted request for the old page).
  const [appliedFilters, setAppliedFilters] = useState({ searchTerm, status });
  if (appliedFilters.searchTerm !== searchTerm || appliedFilters.status !== status) {
    setAppliedFilters({ searchTerm, status });
    setPage(1);
  }

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await adminService.getAllUsers({
          page,
          limit: MEMBERS_PAGE_SIZE,
          search: searchTerm,
          status,
        });
        if (!active) return;

        setUsers(response.users || []);
        setTotalCount(response.totalCount || 0);
        setTotalPages(response.totalPages || 0);
      } catch (loadError) {
        const message = handleError(loadError, "Unable to load members.");
        if (active && message) setError(message);
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [page, searchTerm, status, reloadKey, handleError]);

  const refresh = useCallback(() => setReloadKey((key) => key + 1), []);
  const setStatus = useCallback((value: StatusFilter) => setStatusState(value), []);

  return {
    users,
    totalCount,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    refresh,
  };
}
