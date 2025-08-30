import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
  createBlogController,
  getAllBlogsController,
  getSingleBlogController,
  updateBlogController,
  deleteBlogController,
  addCommentController,
  likeBlogController,
  getUserBlogsController,
  getBlogsByCampaignController
} from "../controller/blogController.js";

const router = express.Router();

// Get all blogs (public)
router.get("/all", getAllBlogsController);

// Get user blogs (protected)
router.get("/user/blogs", requireSignIn, getUserBlogsController);

// Get specific user's blogs (public)
router.get("/user/:userId", getUserBlogsController);

// Get blogs by campaign ID (public)
router.get("/campaign/:campaignId", getBlogsByCampaignController);

// Create a blog (protected) - MUST come before /:id route
router.post("/create", requireSignIn, createBlogController);

// Get single blog (public)
router.get("/:id", getSingleBlogController);

// Update blog (protected + author only)
router.put("/:id", requireSignIn, updateBlogController);

// Delete blog (protected + author only)
router.delete("/:id", requireSignIn, deleteBlogController);

// Add comment to blog (protected)
router.post("/:id/comment", requireSignIn, addCommentController);

// Like a blog (protected)
router.post("/:id/like", requireSignIn, likeBlogController);

export default router; 