import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import "../styles/auth.css";

export default function VerifyResetOtp() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const verify = async () => {
    if (!otp) {
      Swal.fire("Enter OTP", "OTP is required", "warning");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/verify-reset-otp", {
        token,
        otp
      });

      Swal.fire(
        "Success",
        "Password updated successfully",
        "success"
      );

      navigate("/login");
    } catch (err) {
      Swal.fire(
        "Invalid OTP",
        err.response?.data?.message || "OTP expired or incorrect",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box">
      <h2>Verify OTP</h2>

      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />

      <button onClick={verify} disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}

