import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";
import { sendResponse } from "../utils/sendResponse.js";
import { OAuth2Client } from "google-auth-library";


/* ======================================================
   REGISTER
====================================================== */

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, addresses } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      addresses: addresses || [],
    });

    sendResponse(res, true, 200, "Registered successfully", [], {}, {});
  } catch (err) {
    sendResponse(res, false, 500, "Server Error", [], {}, err);
  }
};

/* ======================================================
   LOGIN
====================================================== */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      
    sendResponse(res, false, 400, "User not found", [], {}, {});

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)

    sendResponse(res, false, 401, "Invalid credentials", [], {}, {});

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        addresses: user.addresses || []
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Token missing" });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();

    const { email, name } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        password: "google-oauth"
      });
    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: jwtToken,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Google authentication failed" });
  }
};

/* ======================================================
   FORGOT PASSWORD (EMAIL + OTP)
====================================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) 
    sendResponse(res, false, 400, "Email required", [], {}, {});

    const user = await User.findOne({ email });
    if (!user) 
    sendResponse(res, false, 400, "Email not registered", [], {}, {});

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "FlipShop – Reset Your Password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}"
           style="padding:10px 15px;background:#2874f0;color:#fff;text-decoration:none;border-radius:4px">
          Reset Password
        </a>
        <p>This link expires in 15 minutes.</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Weak password" });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired link" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.tempPassword = await bcrypt.hash(password, 10);
    user.resetOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.resetOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "FlipShop – Verify Password Reset",
      html: `
        <h2>Password Reset OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   VERIFY RESET OTP + SET NEW PASSWORD
====================================================== */
export const verifyResetOtp = async (req, res) => {
  try {
    const { token, otp } = req.body;

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      resetToken: token,
      resetOtp: hashedOtp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Invalid or expired OTP" });

    if (!user.tempPassword) {
      return res.status(400).json({ message: "Password missing" });
    }

    user.password = user.tempPassword;

    // cleanup
    user.tempPassword = undefined;
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   SEND OTP FOR PROFILE PASSWORD CHANGE
====================================================== */
export const sendChangePasswordOtp = async (req, res) => {
  try {
    const { newPassword } = req.body;

   if (!newPassword) {
  return res.status(400).json({ message: "Password is required" });
}

if (newPassword.length < 6) {
  return res.status(400).json({
    message: "Password must be at least 6 characters"
  });
}


    const user = await User.findById(req.user.id);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ HASH PASSWORD ONCE HERE
    user.tempPassword = await bcrypt.hash(newPassword, 10);
    user.emailOtp = crypto.createHash("sha256").update(otp).digest("hex");
    user.emailOtpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "FlipShop – Confirm Password Change",
      html: `
        <h2>Password Change OTP</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   VERIFY PROFILE PASSWORD OTP
====================================================== */
export const verifyProfileOtp = async (req, res) => {
  try {
    const { otp } = req.body;

    /* ✅ HARD GUARDS */
    if (!otp || typeof otp !== "string") {
      return res.status(400).json({ message: "OTP is required" });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const user = await User.findOne({
      _id: req.user.id,
      emailOtp: hashedOtp,
      emailOtpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired OTP" });
    }

    if (!user.tempPassword) {
      return res
        .status(400)
        .json({ message: "Password reset data missing" });
    }

    /* ✅ APPLY PASSWORD (DO NOT HASH AGAIN) */
    user.password = user.tempPassword;

    /* ✅ CLEANUP */
    user.tempPassword = undefined;
    user.emailOtp = undefined;
    user.emailOtpExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (err) {
    console.error("VERIFY PROFILE OTP ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

