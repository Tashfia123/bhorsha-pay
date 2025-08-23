import userModel from "../models/userModel.js";
import JWT from "jsonwebtoken";
import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import crypto from 'crypto';
import axios from 'axios';

export const registerController = async (req, res) => {
  try {
    const { name, email, password, phone, address, answer, defaultWalletAddress } = req.body;
    const nidFile = req.file; // Get uploaded file from multer

    console.log('=== REGISTRATION ATTEMPT ===');
    console.log('Form data:', { name, email, phone, address, answer });
    console.log('NID File received:', nidFile ? {
      filename: nidFile.filename,
      originalname: nidFile.originalname,
      mimetype: nidFile.mimetype,
      size: nidFile.size,
      path: nidFile.path
    } : 'NO FILE');

    // Validations
    if (!name) {
      return res.status(400).send({ success: false, message: "Name is Required" });
    }
    if (!email) {
      return res.status(400).send({ success: false, message: "Email is Required" });
    }
    if (!password) {
      return res.status(400).send({ success: false, message: "Password is Required" });
    }
    if (!phone) {
      return res.status(400).send({ success: false, message: "Phone no is Required" });
    }
    if (!nidFile) {
      return res.status(400).send({ success: false, message: "NID Picture is Required" });
    }
    if (!address) {
      return res.status(400).send({ success: false, message: "Address is Required" });
    }
    if (!answer) {
      return res.status(400).send({ success: false, message: "Answer is Required" });
    }

    // Validate file type
    if (!nidFile.mimetype.startsWith('image/')) {
      return res.status(400).send({ success: false, message: "Only image files are allowed for NID" });
    }

    // Check existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already registered, please login",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Prepare NID file metadata (Reference Storage approach)
    const nidData = {
      filename: nidFile.filename,
      originalName: nidFile.originalname,
      mimetype: nidFile.mimetype,
      size: nidFile.size,
      path: nidFile.path,
      uploadDate: new Date()
    };

    console.log('NID Metadata prepared:', nidData);

    // Save new user
    const user = await new userModel({
      name,
      email,
      phone,
      nid: nidData,
      address,
      password: hashedPassword,
      answer,
      defaultWalletAddress: defaultWalletAddress || "",
      walletAddresses: defaultWalletAddress ? [defaultWalletAddress] : [],
    }).save();

    console.log('✅ User saved successfully with ID:', user._id);

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        nid: user.nid,
        address: user.address,
        role: user.role
      },
    });
  } catch (error) {
    console.log('❌ Registration error:', error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error: error.message,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Compare password
    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate token
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        defaultWalletAddress: user.defaultWalletAddress, // Return wallet info
        walletAddresses: user.walletAddresses,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

// Add wallet address function
export const addWalletAddressController = async (req, res) => {
  try {
    const { userId, walletAddress } = req.body;

    // Validate input
    if (!userId || !walletAddress) {
      return res.status(400).send({ success: false, message: "User ID and wallet address are required" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({ success: false, message: "User not found" });
    }

    // Check if wallet already exists
    if (user.walletAddresses.includes(walletAddress)) {
      return res.status(400).send({ success: false, message: "Wallet address already exists" });
    }

    // Update user wallet addresses
    user.walletAddresses.push(walletAddress);
    if (!user.defaultWalletAddress) {
      user.defaultWalletAddress = walletAddress; // Set as default if no default exists
    }
    await user.save();

    res.status(200).send({
      success: true,
      message: "Wallet address added successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        defaultWalletAddress: user.defaultWalletAddress,
        walletAddresses: user.walletAddresses,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error adding wallet address",
      error,
    });
  }
};

export const testController = (req, res) => {
  console.log("Protected route");
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer } = req.body;

    // Validation
    if (!email || !answer) {
      return res.status(400).send({
        success: false,
        message: "Email and answer are required",
      });
    }

    // Check user
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset token generated",
      resetToken,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Validation
    if (!token || !newPassword) {
      return res.status(400).send({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Hash token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const user = await userModel.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update user password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in reset password",
      error,
    });
  }
};

export const getCryptoRatesController = async (req, res) => {
  try {
    // Get top 10 cryptocurrencies by market cap
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
          sparkline: false
        }
      }
    );

    const cryptoData = response.data.map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      price_change_24h: coin.price_change_percentage_24h,
      last_updated: coin.last_updated
    }));

    res.status(200).send({
      success: true,
      message: "Crypto rates fetched successfully",
      data: cryptoData
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching crypto rates",
      error: error.message
    });
  }
};

export const getCryptoNewsController = async (req, res) => {
  try {
    const response = await axios.get(
      'https://min-api.cryptocompare.com/data/v2/news/?categories=Cryptocurrency,Blockchain&excludeCategories=Sponsored',
      {
        params: {
          lang: 'EN',
          sortOrder: 'latest'
        }
      }
    );

    const newsData = response.data.Data.map(article => ({
      id: article.id,
      title: article.title,
      body: article.body,
      source: article.source,
      url: article.url,
      imageUrl: article.imageurl,
      publishedOn: article.published_on,
      categories: article.categories,
      sourceInfo: article.source_info
    }));

    res.status(200).send({
      success: true,
      message: "Crypto news fetched successfully",
      data: newsData
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error fetching crypto news",
      error: error.message
    });
  }
};

