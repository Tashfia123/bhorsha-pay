import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    nid: {
      type: {
        filename: { type: String, required: true },
        originalName: { type: String, required: true },
        mimetype: { type: String, required: true },
        size: { type: Number, required: true },
        path: { type: String, required: true },
        uploadDate: { type: Date, default: Date.now },
      },
      required: true,
      _id: false,
    },
    address: {
      type: {},
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    role: {
      type: Number,
      default: 0,
    },
    nidNumber: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\d{10,13}$/.test(v);
        },
        message: "NID number must be 10-13 digits",
      },
    },
    defaultWalletAddress: {
      type: String,
      default: "", // Can be set to an empty string or a placeholder value
    },
    walletAddresses: {
      type: [String], // Allows users to store multiple wallet addresses
      default: [], // Starts with an empty array
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);
