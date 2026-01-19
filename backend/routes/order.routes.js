import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { placeOrder, getOrders } from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", protect, placeOrder);   // POST /api/orders
router.get("/", protect, getOrders);     // GET  /api/orders

export default router;


