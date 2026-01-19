import mongoose from "mongoose";

/* 🔹 ADDRESS SUB-SCHEMA */
const addressSchema = new mongoose.Schema({
  doorNo: { type: String, required: true },
  street: { type: String, required: true },
  line1: { type: String, required: true },
  line2: String,
  pincode: { type: String, required: true },
  isDefault: { type: Boolean, default: false }
});

/* 🔹 USER SCHEMA */
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },

    addresses: { type: [addressSchema], default: [] },

    /* FORGOT PASSWORD */
    resetToken: String,
    resetTokenExpiry: Date,
    resetOtp: String,
    resetOtpExpiry: Date,

    /* PROFILE CHANGE PASSWORD */
    emailOtp: String,
    emailOtpExpiry: Date,
    tempPassword: String
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);








