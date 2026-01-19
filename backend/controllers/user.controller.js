import User from "../models/User.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/* ================================
   GET LOGGED-IN USER PROFILE
   GET /api/user/me
   ================================ */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE PROFILE
   PUT /api/user/update
   ================================ */
export const updateProfile = async (req, res) => {
  const { name, email, phone, addresses } = req.body;

  const updateData = { name, email, phone, addresses };

  

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true }
  ).select("-password");

  res.json(user);
};


/* ================================
   ADD NEW ADDRESS
   POST /api/user/address
   ================================ */
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = req.body;

    if (
      !address.doorNo ||
      !address.street ||
      !address.line1 ||
      !address.pincode
    ) {
      return res.status(400).json({
        message: "Required address fields missing"
      });
    }

    // First address becomes default
    address.isDefault = user.addresses.length === 0;

    user.addresses.push(address);
    await user.save();

    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   SET DEFAULT ADDRESS
   PUT /api/user/address/:addressId/default
   ================================ */
export const setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let found = false;

    user.addresses.forEach(addr => {
      if (addr._id.toString() === addressId) {
        addr.isDefault = true;
        found = true;
      } else {
        addr.isDefault = false;
      }
    });

    if (!found) {
      return res.status(404).json({ message: "Address not found" });
    }

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   UPDATE ADDRESS
   PUT /api/user/address/:addressId
   ================================ */
export const updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE ADDRESS
   DELETE /api/user/address/:addressId
   ================================ */
export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const before = user.addresses.length;

    user.addresses = user.addresses.filter(
      addr => addr._id.toString() !== addressId
    );

    if (user.addresses.length === before) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Ensure one default address exists
    if (
      user.addresses.length > 0 &&
      !user.addresses.some(addr => addr.isDefault)
    ) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.status(200).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================================
   DELETE ACCOUNT (FULL CLEANUP)
   DELETE /api/user/delete
   ================================ */
export const deleteAccount = async (req, res) => {
  try {
    await Order.deleteMany({ user: req.user.id });
    await Cart.deleteMany({ user: req.user.id });
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







