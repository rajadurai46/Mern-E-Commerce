import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addToCart,
  getCart,
  updateQuantity,
  removeItem
} from "../controllers/cart.controller.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateQuantity);
router.delete("/:productId", protect, removeItem);

export default router;
