
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

export const adminService = {
  login(email: string, password: string) {
    return apiRequest<AdminLoginResponse>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      tokenKey: "adminToken"
    });
  },

  getPendingUsers() {
    return apiRequest<PendingUsersResponse>("/admin/pending-users", {
      method: "GET",
      tokenKey: "adminToken",
      headers: {
        Authorization: `Bearer ${
          typeof window !== "undefined"
            ? localStorage.getItem("adminToken") || ""
            : ""
        }`,
      },
    });
  },

  approveUser(userId: string) {
    return apiRequest<{ success: boolean; message: string; uniqueUserId: string }>(
      `/admin/approve/${userId}`,
      {
        method: "PATCH",
        tokenKey: "adminToken",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? localStorage.getItem("adminToken") || ""
              : ""
          }`,
        },
      }
    );
  },

  rejectUser(userId: string, reason: string) {
    return apiRequest<{ success: boolean; message: string }>(
      `/admin/reject/${userId}`,
      {
        method: "PATCH",
        tokenKey: "adminToken",
        headers: {
          Authorization: `Bearer ${
            typeof window !== "undefined"
              ? localStorage.getItem("adminToken") || ""
              : ""
          }`,
        },
        body: JSON.stringify({ reason }),
      }
    );
  },
};
