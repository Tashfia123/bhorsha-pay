import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { hashPassword } from "../helpers/authHelper.js";
import dotenv from "dotenv";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await hashPassword("admincool");

    // Create admin user
    const admin = new userModel({
      name: "System Administrator",
      email: "admin@gmail.com",
      password: hashedPassword,
      phone: "+8801700000000",
      nidNumber: "0000000000000",
      nid: {
        filename: "admin-nid.png",
        originalName: "admin-nid.png",
        mimetype: "image/png",
        size: 0,
        path: "/admin/nid.png",
        uploadDate: new Date(),
      },
      address: "System Admin Address",
      answer: "admin",
      role: 1, // Admin role
      defaultWalletAddress: "",
      walletAddresses: [],
    });

    await admin.save();
    console.log("✅ Admin user created successfully");
    console.log("Email: admin@gmail.com");
    console.log("Password: admincool");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
