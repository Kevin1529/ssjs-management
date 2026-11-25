
import { Request, Response } from "express";
import { randomInt } from "crypto";
import bcrypt from "bcryptjs";
import OTP from "../models/OTP";
import sendSMS from "../services/sms.service";
import User from "../models/User";
import generateToken from "../utils/jwt";
import { setAuthCookie, clearAuthCookie } from "../utils/authCookie";

export const sendOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const { mobileNumber } = req.body;

    if (
      typeof mobileNumber !== "string" ||
      !/^\+[1-9]\d{7,14}$/.test(mobileNumber)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid mobile number with country code"
      });
    }

    const otp = randomInt(100000, 1000000).toString();

    const otpHash = await bcrypt.hash(otp, 10);

    // Send SMS first
    await sendSMS(mobileNumber, otp);

    // Store hashed OTP
    await OTP.findOneAndUpdate(
      { mobileNumber },
      {
        $set: {
          otpHash,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
          attempts: 0,
          verified: false
        }
      },
      {
        upsert: true,
        new: true,
        runValidators: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      expiresIn: 300
    });

  } catch (error) {
    console.error("Send OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send OTP"
    });
  }
};

export const verifyOTP = async (
  req: Request,
  res: Response
) => {
  try {
    const mobileNumber = req.body?.mobileNumber;
    const otp = req.body?.otp;

    if (
      typeof mobileNumber !== "string" ||
      !/^\+[1-9]\d{7,14}$/.test(mobileNumber) ||
      typeof otp !== "string" ||
      !/^\d{6}$/.test(otp)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid mobile number and 6-digit OTP are required"
      });
    }

    const otpRecord = await OTP.findOne({ mobileNumber });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found. Please request a new OTP"
      });
    }

    if (otpRecord.verified) {
      return res.status(400).json({
        success: false,
        message: "OTP already used. Please request a new OTP"
      });
    }

    if (otpRecord.expiresAt.getTime() <= Date.now()) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new OTP"
      });
    }

    if (otpRecord.attempts >= 5) {
      await OTP.deleteOne({ _id: otpRecord._id });

      return res.status(429).json({
        success: false,
        message: "Maximum attempts exceeded. Request a new OTP"
      });
    }

    const isValid = await bcrypt.compare(
      otp,
      otpRecord.otpHash
    );

    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
        attemptsRemaining: 5 - otpRecord.attempts
      });
    }

    // Mark OTP as used
    otpRecord.verified = true;
    otpRecord.verifiedAt = new Date();
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ mobileNumber });

    if (!user) {
      user = await User.create({
        mobileNumber,
        status: "PROFILE_PENDING"
      });
    }

    const token = generateToken(user._id.toString());
    setAuthCookie(res, "userToken", token);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        mobileNumber: user.mobileNumber,
        fullName: user.fullName,
        status: user.status,
        uniqueUserId: user.uniqueUserId
      }
    });

  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};


export const userLogout = async (_req: Request, res: Response) => {
  clearAuthCookie(res, "userToken");

  return res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};
