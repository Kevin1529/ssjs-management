import type { User, UserStatus } from "./user";

export interface ApiMessage {
  success: boolean;
  message: string;
}

export interface PendingUsersResponse {
  success: boolean;
  count: number;
  users: User[];
}

export interface AdminUserDetailsResponse {
  success: boolean;
  user: User;
  message?: string;
}

export interface AdminActionResponse extends ApiMessage {
  uniqueUserId?: string;
  user?: User;
}

export interface AdminDashboardStats {
  totalUsers: number;
  approvedUsers: number;
  pendingUsers: number;
  rejectedUsers: number;
  profilePendingUsers: number;
}

export interface AdminDashboardStatsResponse {
  success: boolean;
  stats: AdminDashboardStats;
}

export type StatusFilter = "ALL" | UserStatus;

export interface AllUsersParams {
  page: number;
  limit: number;
  search?: string;
  status?: StatusFilter;
}

export interface AllUsersResponse extends ApiMessage {
  totalCount: number;
  page: number;
  limit: number;
  totalPages: number;
  users: User[];
}
