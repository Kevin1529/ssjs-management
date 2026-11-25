
import { Router } from "express";

import {
  sendOTP,
  verifyOTP,
  userLogout
} from "../controllers/auth.controller";

const router = Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/logout", userLogout);

export default router;

