import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin";
import mongoose from "mongoose";
import User from "../models/User";
import Counter from "../models/Counter";
import { AdminRequest } from "../middleware/admin.middleware";

export const adminLogin = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase()
    }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
        role: "ADMIN"
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Admin login failed"
    });
  }
};

// 1. Get all pending users
export const getPendingUsers = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const users = await User.find({
      status: "PENDING_APPROVAL"
    })
      .select("-__v")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch pending users"
    });
  }
};

// 2. Get complete user details
export const getUserDetails = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(id).select("-__v");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user details"
    });
  }
};

// 3. Approve user and generate membership ID
export const approveUser = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "User is already approved",
        uniqueUserId: user.uniqueUserId
      });
    }

    if (user.status !== "PENDING_APPROVAL") {
      return res.status(400).json({
        success: false,
        message: "Only pending users can be approved"
      });
    }

    // Atomically allocate the next membership number.
    const counter = await Counter.findOneAndUpdate(
      { name: "membership" },
      { $inc: { sequence: 1 } },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    const uniqueUserId = `SSJS-${String(counter.sequence).padStart(6, "0")}`;

    // Conditional update prevents two requests approving the same user.
    const approvedUser = await User.findOneAndUpdate(
      {
        _id: id,
        status: "PENDING_APPROVAL"
      },
      {
        $set: {
          status: "APPROVED",
          uniqueUserId,
          approvedAt: new Date(),
          rejectionReason: undefined
        }
      },
      { new: true, runValidators: true }
    );

    if (!approvedUser) {
      return res.status(409).json({
        success: false,
        message: "User status changed. Refresh and try again."
      });
    }

    return res.status(200).json({
      success: true,
      message: "User approved successfully",
      uniqueUserId: approvedUser.uniqueUserId,
      user: approvedUser
    });
  } catch (error) {
    console.error("Approve user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to approve user"
    });
  }
};

// 4. Reject user
export const rejectUser = async (
  req: AdminRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const user = await User.findOneAndUpdate(
      {
        _id: id,
        status: "PENDING_APPROVAL"
      },
      {
        $set: {
          status: "REJECTED",
          rejectionReason: reason.trim()
        }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Pending user not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "User rejected successfully",
      user
    });
  } catch (error) {
    console.error("Reject user error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reject user"
    });
  }
};

// 5. Get All users
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all users and total count
    const [users, totalCount] = await Promise.all([
      User.find()
        .select("-__v")
        .sort({ createdAt: -1 })
        .lean(),

      User.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      totalCount,
      users
    });

  } catch (error) {
    console.error("Get all users error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};