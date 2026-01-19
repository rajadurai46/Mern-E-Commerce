import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../app/hooks";
import { verifyProfileOtp } from "../app/slices/authSlice";
import "../styles/auth.css";

export default function VerifyPasswordOtp() {
  const [otp, setOtp] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const submit = async () => {
    if (otp.length !== 6) {
      Swal.fire("Invalid OTP", "Enter 6-digit OTP", "warning");
      return;
    }

    try {
     await dispatch(verifyProfileOtp({ otp })).unwrap();
      Swal.fire("Success", "Password updated", "success")
        .then(() => navigate("/profile"));
    } catch (err) {
      Swal.fire("Error", err || "Invalid OTP", "error");
    }
  };

  return (
    <div className="auth-box">
      <h2>Verify OTP</h2>

      <input
        maxLength={6}
        value={otp}
        onChange={e => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter OTP"
      />

      <button onClick={submit}>
        Verify & Update
      </button>
    </div>
  );
}

