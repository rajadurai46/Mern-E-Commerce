import Cart from "../models/Cart.js";

/* ================= ADD TO CART ================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Invalid data" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }]
      });
    } else {
      const item = cart.items.find(
        i => i.product.toString() === productId
      );

      if (item) {
        item.quantity += quantity;
      } else {
        cart.items.push({
          product: productId,
          quantity
        });
      }

      await cart.save();
    }

    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= GET CART ================= */
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("items.product");

    res.json({
      items: cart ? cart.items : []
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE QUANTITY ================= */
export const updateQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ items: [] });
    }

    const item = cart.items.find(
      i => i.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


/* ================= REMOVE ITEM ================= */
export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.json({ items: [] });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate("items.product");

    res.json({ items: cart.items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
