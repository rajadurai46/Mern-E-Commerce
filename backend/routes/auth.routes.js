import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { register, login, forgotPassword, resetPassword, verifyResetOtp, sendChangePasswordOtp, verifyProfileOtp } 
from "../controllers/auth.controller.js";
import { decrypt } from "../utils/ResponseEncryptandDecrypt.js";
import { googleLogin } from "../controllers/auth.controller.js";



const router = express.Router();

router.post("/google-login", googleLogin);

router.post("/register", decrypt, register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-reset-otp", verifyResetOtp);

router.post("/send-profile-otp", protect, sendChangePasswordOtp);
router.post("/verify-profile-otp", protect, verifyProfileOtp);

export default router;

