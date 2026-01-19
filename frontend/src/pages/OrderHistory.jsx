import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/orderHistory.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders/my-orders")
      .then(res => {
        setOrders(res.data || []);
      })
      .catch(err => console.error("Order history error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <h2 className="no-orders">Loading orders...</h2>;
  }

  if (!orders.length) {
    return <h2 className="no-orders">No orders found</h2>;
  }

  return (
    <div className="order-history">
      <h2>My Orders</h2>

      {orders.map(order => (
        <div className="order-card" key={order._id}>
          {/* HEADER */}
          <div className="order-header">
            <span>
              Order Date:{" "}
              {order.createdAt
                ? new Date(order.createdAt).toDateString()
                : "N/A"}
            </span>
            <span>Payment: {order.paymentMode}</span>
          </div>

          {/* PRODUCTS */}
          {order.products?.map((p, i) => (
            <div className="order-product" key={i}>
              <img
                src={
                  p.image?.startsWith("http")
                    ? p.image
                    : `http://localhost:5000${p.image}`
                }
                alt={p.name}
                onError={e => (e.target.src = "/no-image.png")}
              />

              <div className="details">
                <h4>{p.name}</h4>
                <p>Qty: {p.quantity}</p>
                <p>₹{p.price}</p>
              </div>
            </div>
          ))}

          {/* 📍 DELIVERY ADDRESS */}
          {order.address && (
            <div className="order-address">
              <h4>Delivery Address</h4>
              <p>
                {order.address.doorNo}, {order.address.street}
              </p>
              <p>
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
              </p>
              <p>Pincode: {order.address.pincode}</p>
            </div>
          )}

          {/* FOOTER */}
          <div className="order-footer">
            <p>Delivery Fee: ₹{order.deliveryFee ?? 0}</p>
            <h3>Total: ₹{order.grandTotal}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;

