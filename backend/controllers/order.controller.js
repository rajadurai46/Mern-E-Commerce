import Order from "../models/Order.js";
import User from "../models/User.js";
import Cart from "../models/Cart.js";

/* ======================================================
   PLACE ORDER
   POST /api/orders
====================================================== */
export const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMode } = req.body;

    /* ✅ BASIC VALIDATION */
    if (!addressId || !paymentMode) {
      return res.status(400).json({
        success: false,
        message: "Address and payment mode are required"
      });
    }

    /* 🔹 FETCH USER */
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    /* 🔹 FIND SELECTED ADDRESS */
    const selectedAddress = user.addresses.find(
      addr => addr._id.toString() === addressId
    );

    if (!selectedAddress) {
      return res.status(400).json({ message: "Address not found" });
    }

    /* 🔹 FETCH CART FROM DB (SOURCE OF TRUTH) */
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    /* 🔹 BUILD PRODUCTS FOR ORDER */
    const products = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.image,
      price: item.product.price,
      quantity: item.quantity
    }));

    const subtotal = products.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    const deliveryFee = paymentMode === "COD" ? 3 : 0;
    const grandTotal = subtotal + deliveryFee;

    /* 🔹 CREATE ORDER */
    const order = await Order.create({
      user: req.user.id,
      products,
      address: {
        doorNo: selectedAddress.doorNo,
        street: selectedAddress.street,
        line1: selectedAddress.line1,
        line2: selectedAddress.line2,
        pincode: selectedAddress.pincode
      },
      paymentMode,
      deliveryFee,
      grandTotal
    });

    /* 🔹 CLEAR CART AFTER ORDER */
    cart.items = [];
    await cart.save();

    res.status(200).json({
      success: true,
      orderId: order._id
    });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/* ======================================================
   GET LOGGED-IN USER ORDERS
   GET /api/orders
====================================================== */
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





