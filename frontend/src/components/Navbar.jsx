import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import {logout} from "../app/slices/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../app/slices/cartSlice";
import "../styles/navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* ================= REDUX ================= */
  const cartItems = useSelector(state => state.cart?.items ?? []);
  const user = useSelector(state => state.auth.user);

  /* ================= FETCH CART ================= */
  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  /* ================= CART COUNT ================= */
  const cartCount = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
  }, [cartItems]);

  /* ================= UI STATE ================= */
  const [showProducts, setShowProducts] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const productsRef = useRef(null);
  const userRef = useRef(null);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = e => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setShowProducts(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setShowUser(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= LOGOUT ================= */
 const logoutHandler = () => {
  dispatch(logout());     
  navigate("/login");     
};

  return (
    <div className="nav">
      {/* LOGO */}
      <div className="logo" onClick={() => navigate("/")}>
        FlipShop
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {/* PRODUCTS */}
        <div className="products-menu" ref={productsRef}>
          <span
            className="products-btn"
            onClick={() => setShowProducts(p => !p)}
          >
            Products ▾
          </span>

          {showProducts && (
            <div className="dropdown">
              <Link to="/shirts">Shirts</Link>
              <Link to="/shoes">Shoes</Link>
              <Link to="/watches">Watches</Link>
              <Link to="/bottles">Bottles</Link>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="nav-right">
          {/* CART */}
          <div className="cart-icon" onClick={() => navigate("/cart")}>
            🛒
            {cartCount > 0 && (
              <span className="badge">{cartCount}</span>
            )}
          </div>

          {/* USER MENU */}
          {user && (
            <div className="user-menu" ref={userRef}>
              <span
                className="user-btn"
                onClick={() => setShowUser(p => !p)}
              >
                👤 {user.name} ▾
              </span>

              {showUser && (
                <div className="dropdown user-dropdown">
                  {/* PROFILE */}
                  <button
                    onClick={() => {
                      setShowUser(false);
                      navigate("/profile");
                    }}
                  >
                    Profile
                  </button>

                  {/* EMAIL (DISPLAY ONLY) */}
                  <div className="user-info">
                    <p className="user-email">{user.email}</p>
                  </div>

                  <div className="dropdown-divider"></div>

                  {/* ORDERS */}
                  <Link to="/orders" onClick={() => setShowUser(false)}>
                    My Orders
                  </Link>

                  {/* LOGOUT */}
                  <button
                    className="logout-btn"
                    onClick={logoutHandler}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;


