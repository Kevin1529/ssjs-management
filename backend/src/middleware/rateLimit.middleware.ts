import type { Request, Response, NextFunction, RequestHandler } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message: string;
  keyGenerator?: (req: Request) => string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory limiter. For multiple production instances, use a shared store such as Redis.
export function createRateLimiter(options: RateLimitOptions): RequestHandler {
  const entries = new Map<string, RateLimitEntry>();

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = options.keyGenerator?.(req) || req.ip || "unknown";
    let entry = entries.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + options.windowMs };
      entries.set(key, entry);
    }

    entry.count += 1;

    // Opportunistic cleanup avoids a background timer.
    if (entries.size > 5000) {
      for (const [entryKey, value] of entries) {
        if (value.resetAt <= now) entries.delete(entryKey);
      }
    }

    res.setHeader("RateLimit-Limit", options.max);
    res.setHeader("RateLimit-Remaining", Math.max(0, options.max - entry.count));
    res.setHeader("RateLimit-Reset", Math.ceil(entry.resetAt / 1000));

    if (entry.count > options.max) {
      res.setHeader("Retry-After", Math.max(1, Math.ceil((entry.resetAt - now) / 1000)));
      res.status(429).json({
        success: false,
        message: options.message,
      });
      return;
    }

    next();
  };
}

export const otpIpRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many OTP requests from this network. Please try again later.",
});

export const otpMobileRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many OTP requests for this mobile number. Please try again later.",
  keyGenerator: (req) => {
    const mobile = typeof req.body?.mobileNumber === "string"
      ? req.body.mobileNumber
      : "invalid";
    return mobile;
  },
});

export const adminLoginRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many admin login attempts. Please try again later.",
});

export const otpVerifyIpRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: "Too many verification attempts from this network. Please try again later.",
});

export const otpVerifyMobileRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many verification attempts for this mobile number. Request a new OTP later.",
  keyGenerator: (req) => {
    const mobile = typeof req.body?.mobileNumber === "string"
      ? req.body.mobileNumber
      : "invalid";
    return mobile;
  },
});
