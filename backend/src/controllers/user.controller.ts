import fs from "fs";

import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth.middleware";

export const createProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const userId = req.userId;

    const {
      fullName,
      email,
      dateOfBirth,
      gender,
      address,
      profilePhoto,
      documents
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !dateOfBirth ||
      !gender ||
      !address?.addressLine ||
      !address?.city ||
      !address?.state ||
      !address?.country ||
      !address?.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please complete all required profile fields"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.status === "APPROVED") {
      return res.status(400).json({
        success: false,
        message: "Your profile is already approved"
      });
    }

    if (user.status === "PENDING_APPROVAL") {
      return res.status(400).json({
        success: false,
        message: "Your profile is already submitted for approval"
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    // Validate date of birth
    const dob = new Date(dateOfBirth);

    if (
      Number.isNaN(dob.getTime()) ||
      dob >= new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date of birth"
      });
    }

    if (!["MALE", "FEMALE", "OTHER"].includes(gender)) {
      return res.status(400).json({
        success: false,
        message: "Invalid gender"
      });
    }

    user.fullName = fullName.trim();
    user.email = email.toLowerCase().trim();
    user.dateOfBirth = dob;
    user.gender = gender;
    user.address = address;
    user.profilePhoto = profilePhoto;
    user.documents = documents || [];

    // Submit profile for admin approval
    user.status = "PENDING_APPROVAL";
    user.rejectionReason = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile submitted successfully for admin approval",
      profile: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        status: user.status
      }
    });

  } catch (error) {
    console.error("Create profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create profile"
    });
  }
};

export const getMyProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId).select(
      "-__v"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      success: true,
      profile: user
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile"
    });
  }
};


export const uploadProfileFile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid file to upload"
      });
    }

    if (req.query.type === "photo" && req.file.size > 5 * 1024 * 1024) {
      await fs.promises.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "Profile photo must be 5 MB or smaller"
      });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      fileType: req.query.type
    });
  } catch (error) {
    console.error("File upload error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to upload file"
    });
  }
};
