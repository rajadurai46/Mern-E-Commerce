import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import api from "../api/axios";
import "../styles/payment.css";
import { fetchCart } from "../app/slices/cartSlice";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
const cartItems = useSelector(state => state.cart?.items ?? []);


  /* ================= STATE ================= */
  const [method, setMethod] = useState("");
  const [orderCompleted, setOrderCompleted] = useState(false);

  const addressId = location.state?.addressId;

  /* ================= TOTAL ================= */
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const deliveryFee = method === "COD" ? 3 : 0;
  const finalAmount = totalPrice + deliveryFee;

  /* ================= ACCESS GUARDS ================= */
  useEffect(() => {
    if (orderCompleted) return;

    if (!addressId) {
      Swal.fire({
        icon: "info",
        title: "Select Address",
        text: "Please select a delivery address",
        confirmButtonColor: "#2874f0"
      }).then(() => navigate("/checkout"));
      return;
    }

    if (cartItems.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Cart is empty",
        confirmButtonColor: "#2874f0"
      }).then(() => navigate("/"));
    }
  }, [addressId, cartItems.length, navigate, orderCompleted]);

  if (!addressId || cartItems.length === 0) return null;

  /* ================= SAVE ORDER ================= */
  const placeOrder = async () => {
    const res = await api.post("/orders", {
      addressId,
      paymentMode: method
      // ❗ cart is taken from backend user cart
    });

    if (!res.data?.success) {
      throw new Error("Order failed");
    }
  };

  /* ================= SUCCESS ================= */
  const onOrderSuccess = async () => {
    setOrderCompleted(true);

    await Swal.fire({
      icon: "success",
      title: "Order Placed Successfully!",
      confirmButtonColor: "#2874f0"
    });

    // Refresh cart from server (cart will now be empty)
    dispatch(fetchCart());

    navigate("/success");
  };

  /* ================= RAZORPAY ================= */
  const handleRazorpayPayment = async () => {
    try {
      const { data: razorOrder } = await api.post(
        "/payment/razorpay/order",
        { amount: finalAmount }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorOrder.amount,
        currency: "INR",
        name: "FlipShop",
        description: "Order Payment",
        order_id: razorOrder.id,
        handler: async () => {
          await placeOrder();
          await onOrderSuccess();
        },
        theme: { color: "#2874f0" }
      };

      new window.Razorpay(options).open();
    } catch {
      Swal.fire("Payment Failed", "Please try again", "error");
    }
  };

  /* ================= PAY ================= */
  const handlePayNow = async () => {
    if (!method) {
      Swal.fire("Select Payment Method", "", "warning");
      return;
    }

    try {
      if (method === "COD") {
        await placeOrder();
        await onOrderSuccess();
      } else {
        await handleRazorpayPayment();
      }
    } catch {
      Swal.fire("Order Failed", "Something went wrong", "error");
    }
  };

  return (
    <div className="payment-page">
      <h2>Payment Options</h2>

      <div className="methods">
        <label>
          <input
            type="radio"
            name="pay"
            onChange={() => setMethod("ONLINE")}
          />
          Card / UPI (Free Delivery)
        </label>

        <label>
          <input
            type="radio"
            name="pay"
            onChange={() => setMethod("COD")}
          />
          Cash on Delivery (+ ₹3)
        </label>
      </div>

      <h3>Total Payable: ₹{finalAmount}</h3>

      <button disabled={!method} onClick={handlePayNow}>
        PAY NOW
      </button>
    </div>
  );
}




