import { Router } from "express";
import { adminLogin, adminLogout } from "../controllers/admin.controller";
import {
  getPendingUsers,
  getUserDetails,
  approveUser,
  rejectUser,
  getAllUsers,
  getDashboardStats
} from "../controllers/admin.controller";
import { adminAuth } from "../middleware/admin.middleware";
import { adminLoginRateLimit } from "../middleware/rateLimit.middleware";

const router = Router();

// Public admin login
router.post("/login", adminLoginRateLimit, adminLogin);
router.post("/logout", adminLogout);

// Protected admin APIs
router.get("/pending-users", adminAuth, getPendingUsers);

router.get("/users/:id", adminAuth, getUserDetails);

router.patch("/approve/:id", adminAuth, approveUser);

router.patch("/reject/:id", adminAuth, rejectUser);

router.get("/all-users", adminAuth, getAllUsers);

router.get("/dashboard/stats", adminAuth, getDashboardStats);

export default router;