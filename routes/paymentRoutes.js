import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

// In-memory storage for demo purposes (in production, use a database)
const bkashPayments = [];

// Record a Bkash payment
router.post("/bkash", requireSignIn, async (req, res) => {
  try {
    const { amount, campaignId, campaignTitle, phoneNumber, transactionId } = req.body;
    
    if (!amount || !campaignId || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const payment = {
      id: `BK${Date.now()}`,
      amount: parseFloat(amount),
      campaignId,
      campaignTitle,
      phoneNumber,
      transactionId: transactionId || `BK${Date.now()}`,
      userId: req.user._id,
      status: 'completed',
      paymentMethod: 'bkash',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    bkashPayments.push(payment);

    res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: payment
    });
  } catch (error) {
    console.error("Error recording Bkash payment:", error);
    res.status(500).json({
      success: false,
      message: "Error recording payment"
    });
  }
});

// Get Bkash payments for a user
router.get("/bkash/user", requireSignIn, async (req, res) => {
  try {
    const userPayments = bkashPayments.filter(
      payment => payment.userId === req.user._id
    );

    res.status(200).json({
      success: true,
      data: userPayments
    });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments"
    });
  }
});

// Get Bkash payments for a campaign
router.get("/bkash/campaign/:campaignId", async (req, res) => {
  try {
    const { campaignId } = req.params;
    const campaignPayments = bkashPayments.filter(
      payment => payment.campaignId === campaignId
    );

    res.status(200).json({
      success: true,
      data: campaignPayments
    });
  } catch (error) {
    console.error("Error fetching campaign payments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payments"
    });
  }
});

// Get payment statistics
router.get("/bkash/stats", async (req, res) => {
  try {
    const totalPayments = bkashPayments.length;
    const totalAmount = bkashPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const uniqueCampaigns = [...new Set(bkashPayments.map(payment => payment.campaignId))].length;

    res.status(200).json({
      success: true,
      data: {
        totalPayments,
        totalAmount,
        uniqueCampaigns,
        averageAmount: totalPayments > 0 ? totalAmount / totalPayments : 0
      }
    });
  } catch (error) {
    console.error("Error fetching payment stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching payment statistics"
    });
  }
});

export default router;
