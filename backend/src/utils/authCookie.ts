import type { CookieOptions, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

export const setAuthCookie = (
  res: Response,
  cookieName: "userToken" | "adminToken",
  token: string,
) => {
  res.cookie(cookieName, token, authCookieOptions);
};

export const clearAuthCookie = (
  res: Response,
  cookieName: "userToken" | "adminToken",
) => {
  res.clearCookie(cookieName, {
    httpOnly: authCookieOptions.httpOnly,
    secure: authCookieOptions.secure,
    sameSite: authCookieOptions.sameSite,
    path: authCookieOptions.path,
  });
};
