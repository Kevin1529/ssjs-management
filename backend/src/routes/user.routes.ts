import { Router } from "express";

import {
  createProfile,
  getMyProfile,
  updateApprovedProfile,
  uploadProfileFile
} from "../controllers/user.controller";

import authMiddleware from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import { createRateLimiter } from "../middleware/rateLimit.middleware";

const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000,
  max: 30,
  message: "Too many uploads. Please try again later.",
});

const router = Router();

router.post("/create-profile", authMiddleware, createProfile);
router.get("/my-profile", authMiddleware, getMyProfile);
router.patch("/update-profile", authMiddleware, updateApprovedProfile);

// Upload one profile photo or document.
// Example: POST /api/users/upload?type=photo
// Example: POST /api/users/upload?type=document
router.post(
  "/upload",
  authMiddleware,
  uploadRateLimit,
  upload.single("file"),
  uploadProfileFile
);

export default router;
