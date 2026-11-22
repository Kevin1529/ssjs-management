import { Router } from "express";

import {
  createProfile,
  getMyProfile
} from "../controllers/user.controller";

import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post("/create-profile", authMiddleware,createProfile);
router.get("/my-profile", authMiddleware, getMyProfile);

export default router;
