import { apiRequest } from "@/lib/api";
import type {
  AdminActionResponse,
  AdminDashboardStatsResponse,
  AdminUserDetailsResponse,
  AllUsersParams,
  AllUsersResponse,
  ApiMessage,
  PendingUsersResponse,
} from "@/types/admin";

const userPath = (userId: string) => encodeURIComponent(userId);

export const adminService = {
  login(email: string, password: string) {
    return apiRequest<ApiMessage>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  logout() {
    return apiRequest<ApiMessage>("/admin/logout", { method: "POST" });
  },

  getPendingUsers() {
    return apiRequest<PendingUsersResponse>("/admin/pending-users");
  },

  getUserDetails(userId: string) {
    return apiRequest<AdminUserDetailsResponse>(`/admin/users/${userPath(userId)}`);
  },

  approveUser(userId: string) {
    return apiRequest<AdminActionResponse>(`/admin/approve/${userPath(userId)}`, {
      method: "PATCH",
    });
  },

  rejectUser(userId: string, reason: string) {
    return apiRequest<AdminActionResponse>(`/admin/reject/${userPath(userId)}`, {
      method: "PATCH",
      body: JSON.stringify({ reason }),
    });
  },

  getDashboardStats() {
    return apiRequest<AdminDashboardStatsResponse>("/admin/dashboard/stats");
  },

  getAllUsers({ page, limit, search, status }: AllUsersParams) {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(limit),
      search: search || "",
      status: status || "ALL",
    });

    return apiRequest<AllUsersResponse>(`/admin/all-users?${query}`);
  },
};
