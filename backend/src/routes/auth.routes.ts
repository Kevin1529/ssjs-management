
import { Router } from "express";

import {
  sendOTP,
  verifyOTP,
  userLogout
} from "../controllers/auth.controller";
import { getCsrfToken } from "../controllers/csrf.controller";
import {
  otpIpRateLimit,
  otpMobileRateLimit,
  otpVerifyIpRateLimit,
  otpVerifyMobileRateLimit,
} from "../middleware/rateLimit.middleware";

const router = Router();

router.get("/csrf", getCsrfToken);
router.post("/send-otp", otpIpRateLimit, otpMobileRateLimit, sendOTP);
router.post("/verify-otp", otpVerifyIpRateLimit, otpVerifyMobileRateLimit, verifyOTP);
router.post("/logout", userLogout);

export default router;

