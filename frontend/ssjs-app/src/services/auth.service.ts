import { apiRequest } from "@/lib/api";
import type { ApiMessage } from "@/types/admin";

export const authService = {
  sendOtp(mobileNumber: string) {
    return apiRequest<ApiMessage>("/auth/send-otp", {
      method: "POST",
      body: JSON.stringify({ mobileNumber }),
    });
  },

  verifyOtp(mobileNumber: string, otp: string) {
    return apiRequest<ApiMessage>("/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify({ mobileNumber, otp }),
    });
  },

  logout() {
    return apiRequest<ApiMessage>("/auth/logout", { method: "POST" });
  },
};
