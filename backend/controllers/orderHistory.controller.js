import Order from "../models/Order.js";

/* GET LOGGED-IN USER ORDER HISTORY */
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
      status: "success"
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
