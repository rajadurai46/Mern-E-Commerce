import dotenv from "dotenv";
import express from "express";
import paymentRoutes from "./routes/payment.routes.js";
import connectDB from "./config/db.js";
import cors from "cors";  
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import orderRoutes from "./routes/order.routes.js";
import orderHistoryRoutes from "./routes/orderHistory.routes.js";
import userRoutes from "./routes/user.routes.js";
import passport from "passport";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

dotenv.config({
  path: path.join(__dirname, "../.env")
});


connectDB();

const app = express();

const allowedOrigins = [
  "https://mern-e-commerce-pearl.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

/* 🔥 IMPORTANT: handle preflight with SAME config */
app.options(/.*/, (req, res) => {
  res.sendStatus(200);
});

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  next();
});


app.use(express.json());

app.use(passport.initialize());

app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/orders", orderHistoryRoutes);
app.use("/api/user", userRoutes);

app.listen(5000, () => {
  console.log("✅ Server running on port 5000");
  console.log("MONGO_URI:", process.env.MONGO_URI);
});
