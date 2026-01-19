import mongoose from "mongoose";
import Product from "../models/Product.js";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const cloud = process.env.CLOUD_NAME;

const categories = {
  shirts: 20,
  shoes: 45,
  watches: 60,
  bottles: 12
};

const insert = async () => {
  await Product.deleteMany();

  const products = [];

  for (const cat in categories) {
    for (let i = 1; i <= 30; i++) {
      products.push({
        name: `${cat.slice(0,-1)} product ${i}`,
        category: cat,
        price: categories[cat] + i,
        quantity: 30,
        description: `Premium ${cat} product`,
        image: `https://res.cloudinary.com/${cloud}/image/upload/products/${cat}/${cat}${i}.jpg`
      });
    }
  }

  await Product.insertMany(products);
  console.log("✅ 120 Products inserted");
  process.exit();
};

insert();
