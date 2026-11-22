
import mongoose, { Schema, Document } from "mongoose";

export interface IOTP extends Document {
  mobileNumber: string;
  otpHash: string;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  verifiedAt?: Date;
}

const OTPSchema = new Schema<IOTP>(
  {
    mobileNumber: {
      type: String,
      required: true,
      unique: true
    },

    otpHash: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true,
      expires: 0
    },

    attempts: {
      type: Number,
      default: 0
    },

    verified: {
      type: Boolean,
      default: false
    },

    verifiedAt: Date
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IOTP>("OTP", OTPSchema);
