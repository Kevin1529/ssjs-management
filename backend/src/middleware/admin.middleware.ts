import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AdminRequest extends Request {
  adminId?: string;
}

export const adminAuth = (
  req: AdminRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin token required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { adminId: string; role: string };

    if (decoded.role !== "ADMIN" || !decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied"
      });
    }

    req.adminId = decoded.adminId;
    next();

  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};