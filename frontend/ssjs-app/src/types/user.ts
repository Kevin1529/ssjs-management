
export type UserStatus =
  | "PROFILE_PENDING"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED";

export type Gender = "MALE" | "FEMALE";

export interface UserAddress {
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface User {
  _id: string;
  mobileNumber: string;
  fullName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: Gender;
  address?: UserAddress;
  profilePhoto?: string;
  documents?: string[];
  status: UserStatus;
  uniqueUserId?: string;
  rejectionReason?: string;
  approvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  profile: any;
  success: boolean;
  message?: string;
  user?: T;
}

export interface ProfilePayload {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  address: UserAddress;
  profilePhoto: string;
  documents: string[];
}
