import type { Request, Response } from "express";
import { createCsrfToken, setCsrfCookie } from "../utils/csrf";

export const getCsrfToken = (_req: Request, res: Response) => {
  try {
    const csrfToken = createCsrfToken();
    res.setHeader("Cache-Control", "no-store");
    setCsrfCookie(res, csrfToken);

    return res.status(200).json({
      success: true,
      csrfToken,
    });
  } catch (error) {
    console.error("CSRF token generation error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to initialize request security.",
    });
  }
};
