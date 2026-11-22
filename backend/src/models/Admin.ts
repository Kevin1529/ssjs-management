
import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
}

const AdminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    role: {
      type: String,
      default: "ADMIN",
      enum: ["ADMIN"]
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IAdmin>("Admin", AdminSchema);
