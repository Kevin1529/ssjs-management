import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

interface UserJwtPayload extends jwt.JwtPayload {
  userId: string;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authReq = req as AuthRequest;
    const token = req.cookies?.userToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "string" || typeof decoded.userId !== "string") {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    authReq.userId = (decoded as UserJwtPayload).userId;
    next();
  } catch (_error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired session. Please login again.",
    });
  }
};

export default authMiddleware;
