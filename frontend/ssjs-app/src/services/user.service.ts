
import { apiRequest } from "@/lib/api";
import type {
  ApiResponse,
  ProfilePayload,
  User,
} from "@/types/user";

export const userService = {
  getMyProfile() {
    return apiRequest<ApiResponse<User>>("/users/my-profile", {
      method: "GET",
      tokenKey: "userToken",
    });
  },

  createProfile(payload: ProfilePayload) {
    return apiRequest<ApiResponse<User>>("/users/create-profile", {
      method: "POST",
      body: JSON.stringify(payload),
      tokenKey: "userToken"
    });
  },
};
