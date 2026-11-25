import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminRequest extends Request {
  adminId?: string;
}

interface AdminJwtPayload extends jwt.JwtPayload {
  adminId: string;
  role: string;
}

export const adminAuth = (
  req: AdminRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin token required",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "string" ||
      decoded.role !== "ADMIN" ||
      typeof decoded.adminId !== "string"
    ) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied",
      });
    }

    req.adminId = (decoded as AdminJwtPayload).adminId;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin session",
    });
  }
};
