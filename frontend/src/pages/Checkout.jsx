import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/checkout.css";

export default function Checkout() {
  const navigate = useNavigate();

  /* ================= REDUX CART ================= */
  const cartItems = useSelector(state => state.cart?.items ?? []);

  /* ================= TOTAL ================= */
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  /* ================= ADDRESS ================= */
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    doorNo: "",
    street: "",
    line1: "",
    line2: "",
    pincode: ""
  });

  /* ================= FETCH ADDRESSES ================= */
  useEffect(() => {
    api.get("/user/me")
      .then(res => {
        const addrs = res.data.addresses || [];
        setAddresses(addrs);

        const def = addrs.find(a => a.isDefault) || addrs[0];
        setSelectedId(def?._id || "");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading checkout...</h2>;
  if (!cartItems.length)
    return <h2 style={{ padding: 30 }}>No items to checkout</h2>;

  const selectedAddress = addresses.find(
    a => a._id === selectedId
  );

  /* ================= FORM HANDLERS ================= */
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveAddress = async () => {
    const res = await api.post("/user/address", form);
    setAddresses(res.data);

    const last = res.data[res.data.length - 1];
    setSelectedId(last._id);

    setForm({
      doorNo: "",
      street: "",
      line1: "",
      line2: "",
      pincode: ""
    });

    setShowForm(false);
  };

  return (
    <div className="checkout-page">
      {/* ================= LEFT ================= */}
      <div className="checkout-left">
        <h3>Delivery Address</h3>

        {addresses.map(addr => (
          <label key={addr._id} className="address-card">
            <input
              type="radio"
              checked={selectedId === addr._id}
              onChange={() => setSelectedId(addr._id)}
            />

            <div>
              <p>{addr.doorNo}, {addr.street}</p>
              <small>
                {addr.line1}, {addr.line2} – {addr.pincode}
              </small>

              {addr.isDefault && (
                <span className="default-badge">DEFAULT</span>
              )}
            </div>
          </label>
        ))}

        {!showForm && (
          <button
            className="add-address-btn"
            onClick={() => setShowForm(true)}
          >
            + Add New Address
          </button>
        )}

        {showForm && (
          <div className="address-form">
            <h4>Add Delivery Address</h4>

            <input name="doorNo" placeholder="Door No" value={form.doorNo} onChange={handleChange} />
            <input name="street" placeholder="Street" value={form.street} onChange={handleChange} />
            <input name="line1" placeholder="Area / Line 1" value={form.line1} onChange={handleChange} />
            <input name="line2" placeholder="Landmark / Line 2" value={form.line2} onChange={handleChange} />
            <input name="pincode" placeholder="Pincode" value={form.pincode} onChange={handleChange} />

            <div className="address-actions">
              <button onClick={saveAddress}>Save Address</button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: 20 }}>Order Summary</h3>

        {cartItems.map(item => (
          <div key={item.product._id} className="checkout-item">
            <img src={item.product.image} alt={item.product.name} />
            <div>
              <p>{item.product.name}</p>
              <p>Qty: {item.quantity}</p>
              <p>₹{item.product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT ================= */}
      <div className="checkout-right">
        <h3>Price Details</h3>
        <p>Total Items: {cartItems.length}</p>
        <p>Total Amount: ₹{totalPrice}</p>

        <button
          className="continue-btn"
          disabled={!selectedAddress}
          onClick={() =>
            navigate("/payment", {
              state: {
                addressId: selectedId,
                totalAmount: totalPrice
              }
            })
          }
        >
          CONTINUE TO PAYMENT
        </button>

        {!selectedAddress && (
          <p className="warning-text">
            Please select a delivery address
          </p>
        )}
      </div>
    </div>
  );
}




