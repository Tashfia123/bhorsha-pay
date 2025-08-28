import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  approveUser,
  rejectUser,
  flagUserSuspicious,
  getSystemAnalytics,
  getRecentActivities,
  exportUserData
} from "../controller/adminController.js";
import { requireSignIn, requireAdmin, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin authentication check
router.get("/check-admin", requireSignIn, isAdmin);

// Dashboard stats
router.get("/dashboard-stats", requireSignIn, requireAdmin, getDashboardStats);

// User management
router.get("/users", requireSignIn, requireAdmin, getAllUsers);
router.get("/users/:userId", requireSignIn, requireAdmin, getUserDetails);
router.put("/users/:userId/approve", requireSignIn, requireAdmin, approveUser);
router.put("/users/:userId/reject", requireSignIn, requireAdmin, rejectUser);
router.put("/users/:userId/flag", requireSignIn, requireAdmin, flagUserSuspicious);

// Analytics
router.get("/analytics", requireSignIn, requireAdmin, getSystemAnalytics);
router.get("/activities", requireSignIn, requireAdmin, getRecentActivities);

// Data export
router.get("/export/users", requireSignIn, requireAdmin, exportUserData);

export default router;