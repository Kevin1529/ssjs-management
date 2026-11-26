import type { Request, Response, NextFunction } from "express";
import { verifyCsrfToken } from "../utils/csrf";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const csrfMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (SAFE_METHODS.has(req.method.toUpperCase())) {
    return next();
  }

  const cookieToken = req.cookies?.csrfToken;
  const headerToken = req.get("x-csrf-token");

  if (
    typeof cookieToken !== "string" ||
    typeof headerToken !== "string" ||
    cookieToken !== headerToken ||
    !verifyCsrfToken(cookieToken)
  ) {
    return res.status(403).json({
      success: false,
      code: "CSRF_VALIDATION_FAILED",
      message: "CSRF validation failed. Refresh the page and try again.",
    });
  }

  return next();
};

export default csrfMiddleware;
