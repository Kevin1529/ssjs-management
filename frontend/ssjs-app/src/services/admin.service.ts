
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
};
