import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import "../styles/auth.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!password || password.length < 6) {
      Swal.fire(
        "Weak Password",
        "Password must be at least 6 characters",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token,
        password
      });

      Swal.fire(
        "OTP Sent",
        "Check your email for OTP",
        "success"
      );

      navigate(`/verify-reset-otp/${token}`);
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Invalid or expired link",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Set New Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button onClick={submit} disabled={loading}>
        {loading ? "Processing..." : "Continue"}
      </button>
    </div>
  );
}

