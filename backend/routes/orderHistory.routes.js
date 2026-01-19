import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getOrderHistory } from "../controllers/orderHistory.controller.js";

const router = express.Router();

router.get("/my-orders", protect, getOrderHistory);

export default router;

