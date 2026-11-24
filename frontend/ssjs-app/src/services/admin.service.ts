
import { apiRequest } from "@/lib/api";
import type { User } from "@/types/user";

interface AdminLoginResponse {
  success: boolean;
  message: string;
  token: string;
}

interface PendingUsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

interface AdminUserDetailsResponse {
  success: boolean;
  user: User;
  message?: string;
}

interface AdminActionResponse {
  success: boolean;
  message: string;
  uniqueUserId?: string;
  user?: User;
}

interface AdminDashboardStatsResponse {
  success: boolean;
  stats: {
    totalUsers: number;
    approvedUsers: number;
    pendingUsers: number;
    rejectedUsers: number;
    profilePendingUsers: number;
  };
}


export interface AllUsersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export interface AllUsersResponse {
  success: boolean;
  message: string;
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  users: User[];
}

export const adminService = {
  login(email: string, password: string) {
    return apiRequest<AdminLoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  getPendingUsers() {
    return apiRequest<PendingUsersResponse>("/admin/pending-users", {
      method: "GET",
      tokenKey: "adminToken",
    });
  },

  getUserDetails(userId: string) {
    return apiRequest<AdminUserDetailsResponse>(
      `/admin/users/${userId}`,
      {
        method: "GET",
        tokenKey: "adminToken",
      }
    );
  },

  approveUser(userId: string) {
    return apiRequest<AdminActionResponse>(
      `/admin/approve/${userId}`,
      {
        method: "PATCH",
        tokenKey: "adminToken",
      }
    );
  },

  rejectUser(userId: string, reason: string) {
    return apiRequest<AdminActionResponse>(
      `/admin/reject/${userId}`,
      {
        method: "PATCH",
        tokenKey: "adminToken",
        body: JSON.stringify({ reason }),
      }
    );
  },

  getDashboardStats() {
  return apiRequest<AdminDashboardStatsResponse>(
    "/admin/dashboard/stats",
    {
      method: "GET",
      tokenKey: "adminToken",
    }
  );
  },

getAllUsers(params: AllUsersParams) {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
    search: params.search || "",
    status: params.status || "ALL",
  });

  return apiRequest<AllUsersResponse>(
    `/admin/all-users?${query.toString()}`,
    {
      method: "GET",
      tokenKey: "adminToken",
    }
  );
},

};
