import { Router } from "express";

import {
  createProfile,
  getMyProfile,
  uploadProfileFile
} from "../controllers/user.controller";

import authMiddleware from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";

const router = Router();

router.post("/create-profile", authMiddleware, createProfile);
router.get("/my-profile", authMiddleware, getMyProfile);

// Upload one profile photo or document.
// Example: POST /api/users/upload?type=photo
// Example: POST /api/users/upload?type=document
router.post(
  "/upload",
  authMiddleware,
  upload.single("file"),
  uploadProfileFile
);

export default router;
