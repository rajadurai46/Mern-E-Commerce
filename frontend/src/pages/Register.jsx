import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../styles/register.css";
import { encrypt } from "../utils/responseEncryptDycrypt";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    doorNo: "",
    street: "",
    line1: "",
    line2: "",
    pincode: ""
  });

  /* ================= PASSWORD STRENGTH ================= */
  const passwordStrength = useMemo(() => {
    const p = form.password;
    if (!p) return { label: "", percent: 0, color: "#ddd" };

    if (p.length < 6)
      return { label: "Weak", percent: 30, color: "#d32f2f" };

    if (!/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Medium", percent: 65, color: "#f9a825" };

    return { label: "Strong", percent: 100, color: "#2e7d32" };
  }, [form.password]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (passwordStrength.label === "Weak") {
      Swal.fire("Weak Password", "Use a stronger password", "warning");
      return;
    }

    try {
      setLoading(true);

      const encryptedData = encrypt(form);

      const res = await axios.post(
        "https://mern-e-commerce-pkk4.onrender.com/api/auth/register",
        { data: encryptedData }
      );

      /* ✅ AUTO LOGIN */
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }

      await Swal.fire({
        icon: "success",
        title: "Account Created 🎉",
        text: "Welcome to FlipShop!",
        confirmButtonColor: "#2874f0"
      });

      navigate("/");

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.message || "Something went wrong",
        confirmButtonColor: "#d32f2f"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-box">
      <h2>Create Account</h2>

      <form onSubmit={submit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {/* PASSWORD STRENGTH */}
        {form.password && (
          <div className="password-strength">
            <div
              className="strength-bar"
              style={{
                width: `${passwordStrength.percent}%`,
                background: passwordStrength.color
              }}
            />
            <small style={{ color: passwordStrength.color }}>
              {passwordStrength.label}
            </small>
          </div>
        )}

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <h4 style={{ marginTop: 12 }}>Address</h4>

        <input
          name="doorNo"
          placeholder="Door No"
          value={form.doorNo}
          onChange={handleChange}
          required
        />

        <input
          name="street"
          placeholder="Street"
          value={form.street}
          onChange={handleChange}
          required
        />

        <input
          name="line1"
          placeholder="Area / Line 1"
          value={form.line1}
          onChange={handleChange}
          required
        />

        <input
          name="line2"
          placeholder="Landmark / Line 2"
          value={form.line2}
          onChange={handleChange}
        />

        <input
          name="pincode"
          placeholder="Pincode"
          value={form.pincode}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>
      </form>

      <p className="register-footer">
        Already have an account?{" "}
        <Link to="/login" className="register-link">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;

