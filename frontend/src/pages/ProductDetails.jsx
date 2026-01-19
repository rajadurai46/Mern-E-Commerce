import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

import api from "../api/axios";
import {
  addToCart,
  updateQty,
  removeFromCart
} from "../app/slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
  const user = useSelector(state => state.auth.user);
  const authLoading = useSelector(state => state.auth.loading);
  const cartItems = useSelector(state => state.cart.items);

  /* ================= LOCAL ================= */
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!product) return <p style={{ padding: 40 }}>Product not found</p>;

  /* ================= CART ITEM ================= */
  const cartItem = cartItems.find(
    item => item.product._id === product._id
  );

  /* ================= LOGIN CHECK ================= */
  const requireLogin = () => {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add items to cart",
      confirmButtonColor: "#2874f0"
    }).then(() => navigate("/login"));
  };

  /* ================= CART ACTIONS ================= */
  const handleAdd = () => {
    if (!user && !authLoading) {
      requireLogin();
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1
      })
    );
  };

  const increase = () => {
    dispatch(
      updateQty({
        productId: product._id,
        quantity: cartItem.quantity + 1
      })
    );
  };

  const decrease = () => {
    if (cartItem.quantity === 1) {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(
        updateQty({
          productId: product._id,
          quantity: cartItem.quantity - 1
        })
      );
    }
  };

  return (
    <div style={{ padding: 40, display: "flex", gap: 40 }}>
      {/* IMAGE */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: 320, objectFit: "contain" }}
        />
      )}

      {/* INFO */}
      <div>
        <h2>{product.name}</h2>
        <h3 style={{ color: "#2874f0" }}>
          ₹{product.price}
        </h3>

        {!cartItem ? (
          <button
            onClick={handleAdd}
            style={{
              padding: "10px 20px",
              background: "#2874f0",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            ADD TO CART
          </button>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10
            }}
          >
            <button onClick={decrease}>−</button>
            <span>{cartItem.quantity}</span>
            <button onClick={increase}>+</button>
          </div>
        )}

        <p style={{ marginTop: 20 }}>
          {product.description}
        </p>
      </div>
    </div>
  );
}


