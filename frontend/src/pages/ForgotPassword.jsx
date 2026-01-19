import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/axios";
import "../styles/auth.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) {
      Swal.fire("Enter Email", "Email is required", "warning");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/forgot-password", { email });

      Swal.fire(
        "Email Sent",
        "Check your inbox to reset password",
        "success"
      );
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter registered email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </div>
  );
}

