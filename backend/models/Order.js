// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // 🔐 LINK LOGGED-IN USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

   

    // 📦 PURCHASED PRODUCTS (SNAPSHOT)
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product"
        },
        name: String,
        image: String,
        price: Number,
        quantity: Number
      }
    ],

    // 📍 DELIVERY DETAILS
  address: {
  doorNo: String,
  street: String,
  line1: String,
  line2: String,
  pincode: String
},


    // 💳 PAYMENT
    paymentMode: {
  type: String,
  enum: ["COD", "ONLINE"],   // 🔥 lowercase
  required: true
},


    deliveryFee: {
      type: Number,
      default: 0
    },

    grandTotal: {
      type: Number,
      required: true
    },

    // ✅ ORDER STATUS
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);


