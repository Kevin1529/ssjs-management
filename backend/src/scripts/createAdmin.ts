import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const email = "admin@gmail.com";
    const password = "Admin@123";

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "ADMIN"
    });

    console.log("Admin created successfully");

  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();