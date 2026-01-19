import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { loadMe } from "./app/slices/authSlice";
import { fetchCart } from "./app/slices/cartSlice";

/* ================= AUTH ================= */
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyResetOtp from "./pages/VerifyResetOtp";
import VerifyPasswordOtp from "./pages/VerifyPasswordOtp";
import Profile from "./pages/Profile";

/* ================= SHOP ================= */
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import OrderHistory from "./pages/OrderHistory";



/* ================= MAIN CATEGORY PAGES ================= */
import Shirts from "./main/Shirts";
import Shoes from "./main/Shoes";
import Watches from "./main/Watches";
import Bottles from "./main/Bottles";

export default function App() {
  const dispatch = useDispatch();
   const user = useSelector(state => state.auth.user);
    const token = useSelector(state => state.auth.token);

 
 useEffect(() => {
    if (token) {
      dispatch(loadMe());
    }
  }, [token, dispatch]);

   useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  return (
    <>
      <Navbar />

      <Routes>
        {/* ================= DEFAULT ================= */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* ================= AUTH ================= */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-reset-otp/:token" element={<VerifyResetOtp />} />
        <Route path="/verify-password-otp" element={<VerifyPasswordOtp />} />

        {/* ================= PUBLIC SHOP ================= */}
        <Route path="/home" element={<Home />} />
        <Route path="/category/:name" element={<Category />} />

        {/* ================= MAIN CATEGORY ROUTES (FIXED) ================= */}
        <Route path="/:name" element={<Shirts />} />
        <Route path="/:name" element={<Shoes />} />
        <Route path="/:name" element={<Watches />} />
        <Route path="/:name" element={<Bottles />} />

        {/* ================= PROTECTED ================= */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        <Route path="/success" element={<Success />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<Navigate to="/home" />} />

    

      </Routes>
    </>
  );
}



