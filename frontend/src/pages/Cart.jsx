import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateQty,
  removeFromCart
} from "../app/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ SAFE SELECTOR
const items = useSelector(state => state.cart.items);

const total = items.reduce(
  (sum, item) => sum + item.product.price * item.quantity,
  0
);



  // Fetch cart once
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);





  if (!items.length) {
    return <h2 style={{ padding: 20 }}>Your cart is empty</h2>;
  }

  return (
    <div style={{ padding: 20 }}>
      {items.map(item => {
        // 🔥 HARD GUARD
        if (!item.product) return null;

        const qty = Number(item.quantity) || 1;

        return (
          <div
            key={item.product._id}
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              marginBottom: 20,
              borderBottom: "1px solid #ddd",
              paddingBottom: 10
            }}
          >
            {/* IMAGE */}
           {item.product.image && (
  <img
    src={item.product.image}
    alt={item.product.name}
    width={80}
  />
)}


            {/* INFO */}
            <div style={{ flex: 1 }}>
              <h4>{item.product.name}</h4>
              <p>₹{item.product.price}</p>
            </div>

            {/* QUANTITY CONTROLS */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                onClick={() => {
                  if (qty <= 1) {
                    dispatch(removeFromCart(item.product._id));
                  } else {
                    dispatch(
                      updateQty({
                        productId: item.product._id,
                        quantity: qty - 1
                      })
                    );
                  }
                }}
              >
                −
              </button>

              {/* ✅ NEVER NaN */}
              <span>{qty}</span>

              <button
                onClick={() =>
                  dispatch(
                    updateQty({
                      productId: item.product._id,
                      quantity: item.quantity + 1
                    })
                  )
                }
              >
                +
              </button>
            </div>

            {/* REMOVE */}
            <button
              onClick={() => dispatch(removeFromCart(item.product._id))}
              style={{ color: "red" }}
            >
              Remove
            </button>
          </div>
        );
      })}

      {/* TOTAL */}
      <h3>Total: ₹{total}</h3>

      <button
        onClick={() => navigate("/checkout")}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#2874f0",
          color: "#fff",
          border: "none",
          cursor: "pointer"
        }}
      >
        PLACE ORDER
      </button>
    </div>
  );
}








