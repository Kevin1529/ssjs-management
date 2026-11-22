import mongoose, { Schema, Document } from "mongoose";

interface ICounter extends Document {
  name: string;
  sequence: number;
}

const counterSchema = new Schema<ICounter>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  sequence: {
    type: Number,
    default: 0
  }
});

export default mongoose.model<ICounter>("Counter", counterSchema);