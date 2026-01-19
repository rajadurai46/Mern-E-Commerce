import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

import "../styles/home.css";
import "../styles/product-card.css";

import {
  addToCart,
  updateQty,
  removeFromCart,
  fetchCart
} from "../app/slices/cartSlice";

import { decrypt } from "../utils/responseEncryptDycrypt.jsx";

const SLIDE_INTERVAL = 3000;

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= REDUX ================= */
  const user = useSelector(state => state.auth.user);
  const authLoading = useSelector(state => state.auth.loading);
  const cartItems = useSelector(state => state.cart.items);
  const cartLoading = useSelector(state => state.cart.loading);

  /* ================= LOCAL ================= */
  const [products, setProducts] = useState([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef(null);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then(res => {
        const decrypted = decrypt(res.data.data);
        setProducts(decrypted?.data || []);
      })
      .catch(console.error);
  }, []);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  /* ================= BANNER ================= */
  const bannerProducts = products.slice(0, 10);

  useEffect(() => {
    if (!bannerProducts.length) return;

    intervalRef.current = setInterval(() => {
      setSlideIndex(prev =>
        prev + 1 >= bannerProducts.length ? 0 : prev + 1
      );
    }, SLIDE_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, [bannerProducts.length]);

  /* ================= LOGIN CHECK ================= */
  const requireLogin = () => {
    Swal.fire({
      icon: "warning",
      title: "Login Required",
      text: "Please login to add items to cart",
      confirmButtonColor: "#2874f0"
    }).then(() => navigate("/login"));
  };

  /* ================= HELPERS ================= */
  const getCartItem = productId =>
    cartItems.find(i => i.product._id === productId);

  return (
    <>
      {/* ================= CART LOADING GATE ================= */}
      {user && cartLoading && (
        <p style={{ padding: 40 }}>Loading products...</p>
      )}

      {/* ================= MAIN CONTENT ================= */}
      {!cartLoading && (
        <>
          {/* ================= BANNER ================= */}
          {bannerProducts.length > 0 && (
            <section className="banner-slider">
              <div
                className="banner-track"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`
                }}
              >
                {bannerProducts.map(p => (
                  <div className="banner-slide" key={p._id}>
                    {p.image && (
                      <img src={p.image} alt={p.name} />
                    )}

                    <div className="banner-box">
                      <h2>{p.name}</h2>
                      <p>Starting at ₹{p.price}</p>

                      <button
                        className="shop-btn"
                        onClick={() => {
                          dispatch(
                            addToCart({
                              productId: p._id,
                              quantity: 1
                            })
                          );
                          navigate("/cart");
                        }}
                      >
                        🛒 Shop Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ================= PRODUCTS ================= */}
          {["shirts", "shoes", "watches", "bottles"].map(category => (
            <section className="home-section" key={category}>
              <h2 className="home-title">
                {category.toUpperCase()}
              </h2>

              <div className="home-grid">
                {products
                  .filter(p => p.category === category)
                  .slice(0, 14)
                  .map(product => {
                    const item = getCartItem(product._id);

                    return (
                      <div className="product-card" key={product._id}>
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                          />
                        )}

                        <div className="product-info">
                          <h3>{product.name}</h3>
                          <p className="price">
                            ₹{product.price}
                          </p>

                          {!item ? (
                            <button
                              className="add-btn"
                              onClick={() => {
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
                              }}
                            >
                              ADD TO CART
                            </button>
                          ) : (
                            <div className="qty-box">
                              <button
                                onClick={() =>
                                  item.quantity === 1
                                    ? dispatch(
                                        removeFromCart(
                                          product._id
                                        )
                                      )
                                    : dispatch(
                                        updateQty({
                                          productId:
                                            product._id,
                                          quantity:
                                            item.quantity - 1
                                        })
                                      )
                                }
                              >
                                −
                              </button>

                              <span>{item.quantity}</span>

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQty({
                                      productId: product._id,
                                      quantity:
                                        item.quantity + 1
                                    })
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
}








