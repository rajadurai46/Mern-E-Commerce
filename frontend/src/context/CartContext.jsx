import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export const Usecart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const clearCart = () => {
  setCart([]);
};

  const addToCart = (product) => {
    setCart(prev => {
      const item = prev.find(p => p._id === product._id);
      if (item) {
        return prev.map(p =>
          p._id === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const increaseQty = (id) => {
    setCart(prev =>
      prev.map(p =>
        p._id === id ? { ...p, qty: p.qty + 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(prev =>
      prev
        .map(p =>
          p._id === id ? { ...p, qty: p.qty - 1 } : p
        )
        .filter(p => p.qty > 0)
    );
  };




  const CartCount = cart.reduce((sum, p) => sum + p.qty, 0);
  const totalPrice = cart.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty, // ✅ EXPORTED
        CartCount,
        totalPrice,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};


