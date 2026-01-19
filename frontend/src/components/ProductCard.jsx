import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  updateQty,
  removeFromCart
} from "../app/slices/cartSlice";

import "../styles/productCard.css";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const cartItems = useSelector(state => state.cart.items);
  const user = useSelector(state => state.auth.user);
  const authLoading = useSelector(state => state.auth.loading);

  // Find item directly (NO useMemo)
  const item = cartItems.find(
    i => i.product._id === product._id
  );

  const handleAdd = () => {
    if (!user && !authLoading) {
      alert("Please login to add items to cart");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1
      })
    );
  };

  return (
    <div className="product-card">
      {/* IMAGE (SAFE) */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
        />
      )}

      <p className="name">{product.name}</p>
      <p className="price">₹{product.price}</p>

      {!item ? (
        <button
          className="add-btn"
          onClick={handleAdd}
        >
          ADD TO CART
        </button>
      ) : (
        <div className="qty-box">
          <button
            onClick={() =>
              item.quantity === 1
                ? dispatch(removeFromCart(product._id))
                : dispatch(
                    updateQty({
                      productId: product._id,
                      quantity: item.quantity - 1
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
                  quantity: item.quantity + 1
                })
              )
            }
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

 

