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


/**
 * Allows an already-approved member to update only their editable profile fields.
 * Membership identity and approval fields are deliberately never read from req.body.
 */
export const updateApprovedProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.status !== "APPROVED") {
      return res.status(403).json({
        success: false,
        message: "Only approved members can edit their profile"
      });
    }

    const {
      fullName,
      email,
      dateOfBirth,
      gender,
      address,
      profilePhoto,
      documents
    } = req.body;

    if (
      typeof fullName !== "string" || !fullName.trim() ||
      typeof email !== "string" ||
      !dateOfBirth ||
      !address ||
      typeof address.addressLine !== "string" || !address.addressLine.trim() ||
      typeof address.city !== "string" || !address.city.trim() ||
      typeof address.state !== "string" || !address.state.trim() ||
      typeof address.country !== "string" || !address.country.trim() ||
      typeof address.pincode !== "string" || !address.pincode.trim() ||
      !Array.isArray(documents) ||
      !documents.every((document: unknown) => typeof document === "string") ||
      (profilePhoto !== undefined && typeof profilePhoto !== "string")
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required profile fields in a valid format"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address"
      });
    }

    const existingEmailUser = await User.findOne({
      email: normalizedEmail,
      _id: { $ne: user._id }
    }).select("_id");

    if (existingEmailUser) {
      return res.status(409).json({
        success: false,
        message: "This email address is already used by another member"
      });
    }

    const dob = new Date(dateOfBirth);
    if (Number.isNaN(dob.getTime()) || dob >= new Date()) {
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
    user.email = normalizedEmail;
    user.dateOfBirth = dob;
    user.gender = gender;
    user.address = {
      addressLine: address.addressLine.trim(),
      city: address.city.trim(),
      state: address.state.trim(),
      country: address.country.trim(),
      pincode: address.pincode.trim()
    };
    user.profilePhoto = profilePhoto || "";
    user.documents = documents;

    // Do not change status, uniqueUserId, approvedAt or mobileNumber.
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Your profile has been updated successfully",
      profile: user
    });
  } catch (error) {
    console.error("Update approved profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update your profile"
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

    // Check file signatures instead of trusting the browser-provided MIME type.
    const fileHandle = await fs.promises.open(req.file.path, "r");
    const signature = Buffer.alloc(12);
    try {
      await fileHandle.read(signature, 0, signature.length, 0);
    } finally {
      await fileHandle.close();
    }

    const isJpeg = signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff;
    const isPng = signature.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
    const isWebp = signature.toString("ascii", 0, 4) === "RIFF" &&
      signature.toString("ascii", 8, 12) === "WEBP";
    const isPdf = signature.toString("ascii", 0, 5) === "%PDF-";

    const validPhoto = isJpeg || isPng || isWebp;
    const validDocument = validPhoto || isPdf;
    const mimeMatchesSignature =
      (req.file.mimetype === "image/jpeg" && isJpeg) ||
      (req.file.mimetype === "image/png" && isPng) ||
      (req.file.mimetype === "image/webp" && isWebp) ||
      (req.file.mimetype === "application/pdf" && isPdf);
    const validSignature =
      mimeMatchesSignature &&
      (req.query.type === "photo" ? validPhoto : validDocument);

    if (!validSignature) {
      await fs.promises.unlink(req.file.path);
      return res.status(400).json({
        success: false,
        message: "The uploaded file content does not match an allowed file type."
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
