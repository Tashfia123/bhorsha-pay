import userModel from "../models/userModel.js";
import blogModel from "../models/blogModel.js";
import fs from "fs";
import path from "path";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();
    const pendingUsers = await userModel.countDocuments({ status: "pending" });
    const approvedUsers = await userModel.countDocuments({
      status: "approved",
    });
    const rejectedUsers = await userModel.countDocuments({
      status: "rejected",
    });
    const suspiciousUsers = await userModel.countDocuments({
      suspiciousFlags: { $exists: true, $not: { $size: 0 } },
    });

    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await userModel.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Get today's approvals
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayApprovals = await userModel.countDocuments({
      status: "approved",
      updatedAt: { $gte: today },
    });

    res.status(200).send({
      success: true,
      stats: {
        totalUsers,
        pendingUsers,
        approvedUsers,
        rejectedUsers,
        suspiciousUsers,
        recentRegistrations,
        todayApprovals,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching dashboard stats",
      error,
    });
  }
};

// Get all users with filtering and pagination
export const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let query = {};

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { nidNumber: { $regex: search, $options: "i" } },
      ];
    }

    const users = await userModel
      .find(query)
      .select("-password -answer -resetPasswordToken -resetPasswordExpire")
      .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await userModel.countDocuments(query);

    res.status(200).send({
      success: true,
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching users",
      error,
    });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel
      .findById(userId)
      .select("-password -answer -resetPasswordToken -resetPasswordExpire");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching user details",
      error,
    });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await userModel.findByIdAndUpdate(
      userId,
      { status: "approved", approvedAt: new Date(), approvedBy: req.user._id },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User approved successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error approving user",
      error,
    });
  }
};

// Reject user
export const rejectUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: req.user._id,
        rejectionReason: reason,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User rejected successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error rejecting user",
      error,
    });
  }
};

// Flag user as suspicious
export const flagUserSuspicious = async (req, res) => {
  try {
    const { userId } = req.params;
    const { flags } = req.body;

    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        suspiciousFlags: flags,
        flaggedAt: new Date(),
        flaggedBy: req.user._id,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "User flagged successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error flagging user",
      error,
    });
  }
};

// Get system analytics
export const getSystemAnalytics = async (req, res) => {
  try {
    // User registration trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrends = await userModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Status distribution
    const statusDistribution = await userModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Top suspicious flags
    const suspiciousFlags = await userModel.aggregate([
      {
        $match: {
          suspiciousFlags: { $exists: true, $not: { $size: 0 } },
        },
      },
      {
        $unwind: "$suspiciousFlags",
      },
      {
        $group: {
          _id: "$suspiciousFlags",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    res.status(200).send({
      success: true,
      analytics: {
        registrationTrends,
        statusDistribution,
        suspiciousFlags,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching analytics",
      error,
    });
  }
};

// Get recent activities
export const getRecentActivities = async (req, res) => {
  try {
    const recentUsers = await userModel
      .find()
      .select("name email status createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .limit(10);

    const recentBlogs = await blogModel
      .find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).send({
      success: true,
      activities: {
        recentUsers,
        recentBlogs,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching recent activities",
      error,
    });
  }
};

// Export user data
export const exportUserData = async (req, res) => {
  try {
    const { format = "json" } = req.query;
    const users = await userModel
      .find()
      .select("-password -answer -resetPasswordToken -resetPasswordExpire");

    if (format === "csv") {
      // Convert to CSV format
      const csvHeader =
        "Name,Email,Phone,NID Number,Status,Registration Date\n";
      const csvData = users
        .map(
          (user) =>
            `"${user.name}","${user.email}","${user.phone}","${
              user.nidNumber
            }","${user.status || "pending"}","${user.createdAt}"`
        )
        .join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=users.csv");
      res.status(200).send(csvHeader + csvData);
    } else {
      res.status(200).send({
        success: true,
        users,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error exporting user data",
      error,
    });
  }
};
