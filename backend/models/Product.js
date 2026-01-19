import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["shirt", "shoe", "watch", "bottle"],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    stock: {
      type: Number,
      default: 0
    },

    description: {
      type: String
    },

    image: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);

