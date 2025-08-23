import express from "express";
import {registerController, loginController, forgotPasswordController, resetPasswordController, getCryptoRatesController, getCryptoNewsController} from '../controller/authController.js'
import userModel from "../models/userModel.js";
import upload from "../middlewares/uploadMiddleware.js";
import multer from "multer";

import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router()

// Error handling middleware for multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).send({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    return res.status(400).send({
      success: false,
      message: 'File upload error: ' + error.message
    });
  } else if (error) {
    return res.status(400).send({
      success: false,
      message: error.message
    });
  }
  next();
};

router.post('/register', upload.single('nid'), handleMulterError, registerController)
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password/:token", resetPasswordController);
router.get("/crypto-rates", getCryptoRatesController);
router.get("/crypto-news", getCryptoNewsController);
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});

// The client is calling /auth/users/me but our route is at /users/me
// Move this route to match the client's expectation
router.get("/me", requireSignIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select("-password");
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        res.status(200).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error fetching user data",
            error,
        });
    }
});

export default router