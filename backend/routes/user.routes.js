import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMe,
  addAddress,
  setDefaultAddress,
  updateAddress,
  deleteAddress,
  updateProfile,
  deleteAccount
} from "../controllers/user.controller.js";

const router = express.Router();

/* USER PROFILE */
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.delete("/delete", protect, deleteAccount);

/* ADDRESS MANAGEMENT */
router.post("/address", protect, addAddress);
router.put("/address/default/:addressId", protect, setDefaultAddress);
router.put("/address/:addressId", protect, updateAddress);
router.delete("/address/:addressId", protect, deleteAddress);

export default router;

