
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  mobileNumber: string;
  email: string;
  fullName: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: {
    addressLine: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  profilePhoto?: string;
  documents?: string[];

  status:
    | "PROFILE_PENDING"
    | "PENDING_APPROVAL"
    | "APPROVED"
    | "REJECTED";

  uniqueUserId?: string;
  rejectionReason?: string;
  approvedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      trim: true
    },

    fullName: {
      type: String,
      trim: true
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"]
    },

    address: {
      addressLine: String,
      city: String,
      state: String,
      country: String,
      pincode: String
    },

    profilePhoto: String,

    documents: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: [
        "PROFILE_PENDING",
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED"
      ],
      default: "PROFILE_PENDING"
    },

    uniqueUserId: {
      type: String,
      unique: true,
      sparse: true
    },

    rejectionReason: String,

    approvedAt: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IUser>("User", UserSchema);
