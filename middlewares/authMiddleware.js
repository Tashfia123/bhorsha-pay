import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    
    if (!token) {
      return res.status(401).send({
        success: false,
        message: "No token provided",
      });
    }
    
    const decode = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "Authentication failed",
      error,
    });
  }
};

// Admin access middleware
export const requireAdmin = async (req, res, next) => {
  try {
    // Handle special admin case
    if (req.user._id === "admin" && req.user.role === 1) {
      return next();
    }

    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in admin middleware",
      error,
    });
  }
};

// Check if user is admin (for frontend)
export const isAdmin = async (req, res) => {
  try {
    // Handle special admin case
    if (req.user._id === "admin" && req.user.role === 1) {
      return res.status(200).send({ ok: true, isAdmin: true });
    }

    const user = await userModel.findById(req.user._id);
    if (user.role === 1) {
      res.status(200).send({ ok: true, isAdmin: true });
    } else {
      res.status(200).send({ ok: false, isAdmin: false });
    }
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error checking admin status",
      error,
    });
  }
};
