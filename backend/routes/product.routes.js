import express from "express";
import Product from "../models/Product.js";
import { sendResponse } from "../utils/sendResponse.js";

const router = express.Router();

// GET PRODUCTS (FILTER BY CATEGORY)
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};

    // ✅ IMPORTANT: exact category match
    if (category) {
      filter.category = category.toLowerCase();
    }

    const products = await Product.find(filter);
    if (!products) {
      sendResponse(res, true, 200, "Data not found", [], {}, {});
    } else {
      sendResponse(res, true, 200, "Shirt List", products, {}, {});
    }
  } catch (error) {
    sendResponse(res, false, 500, "Server Error", [], {}, error);
  }
});

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;

    let filter = {};
    if (category && category !== "all") {
      filter.category = category;
    }
    const products = await Product.find(filter);

    if (!products) {
      sendResponse(res, true, 200, "Data not found", [], {}, {});
    } else {
      sendResponse(res, true, 200, "All List Success", products, {}, {});
    }
  } catch (error) {
    sendResponse(res, false, 500, "Server Error", [], {}, error);
  }
  //   const products = await Product.find(filter);
  //   res.json({ success: true, products });
  // } catch (error) {
  //   res.status(500).json({ success: false, message: error.message });
  // }
});

export default router;
