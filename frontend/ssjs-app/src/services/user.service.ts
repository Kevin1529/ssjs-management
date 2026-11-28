import { apiRequest } from "@/lib/api";
import type { ProfilePayload, UploadType, User } from "@/types/user";

export interface MyProfileResponse {
  success: boolean;
  profile: User;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: UploadType;
}

export const userService = {
  getMyProfile() {
    return apiRequest<MyProfileResponse>("/users/my-profile");
  },

  createProfile(payload: ProfilePayload) {
    return apiRequest<{
      success: boolean;
      message: string;
      profile: Partial<User>;
    }>("/users/create-profile", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateApprovedProfile(payload: ProfilePayload) {
    return apiRequest<{ success: boolean; message: string; profile: User }>(
      "/users/update-profile",
      { method: "PATCH", body: JSON.stringify(payload) },
    );
  },

  uploadFile(file: File, type: UploadType) {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest<UploadResponse>(`/users/upload?type=${type}`, {
      method: "POST",
      body: formData,
    });
  },
};
