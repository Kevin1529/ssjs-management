import { createHmac, randomBytes, timingSafeEqual } from "crypto";
import type { CookieOptions, Response } from "express";

const COOKIE_NAME = "csrfToken";
const isProduction = process.env.NODE_ENV === "production";
const csrfCookieOptions: CookieOptions = {
  httpOnly: false,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return secret;
}

export function createCsrfToken(): string {
  const nonce = randomBytes(32).toString("hex");
  const signature = createHmac("sha256", getSecret())
    .update(nonce)
    .digest("hex");
  return `${nonce}.${signature}`;
}

export function verifyCsrfToken(token: string): boolean {
  const [nonce, signature, extra] = token.split(".");
  if (!nonce || !signature || extra || !/^[a-f0-9]{64}$/i.test(nonce) || !/^[a-f0-9]{64}$/i.test(signature)) {
    return false;
  }

  const expected = createHmac("sha256", getSecret())
    .update(nonce)
    .digest();
  const supplied = Buffer.from(signature, "hex");

  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export function setCsrfCookie(res: Response, token: string): void {
  res.cookie(COOKIE_NAME, token, csrfCookieOptions);
}
