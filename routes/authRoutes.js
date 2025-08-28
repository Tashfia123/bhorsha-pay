import express from "express";
import {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getCryptoRates,
  getCryptoNews,
  userAuthController,
  getUserProfile,
} from "../controller/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).send({
        success: false,
        message: "File too large. Maximum size is 10MB",
      });
    }
    return res.status(400).send({
      success: false,
      message: "File upload error: " + error.message,
    });
  } else if (error) {
    return res.status(400).send({
      success: false,
      message: error.message,
    });
  }
  next();
};

router.post(
  "/register",
  upload.single("nid"),
  handleMulterError,
  registerController
);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.get("/crypto-rates", getCryptoRates);
router.get("/crypto-news", getCryptoNews);
router.get("/user-auth", requireSignIn, userAuthController);
router.get("/me", requireSignIn, getUserProfile);

export default router;
