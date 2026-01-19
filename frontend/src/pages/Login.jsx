import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { GoogleLogin } from "@react-oauth/google";
import api from "../api/axios";
import { loginUser } from "../app/slices/authSlice";
import "../styles/auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useSelector(state => state.auth);

  const from = location.state?.from?.pathname || "/";

  const submit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(
        loginUser({ email, password })
      ).unwrap();

      Swal.fire({
        icon: "success",
        title: "Login successful",
        timer: 1200,
        showConfirmButton: false
      });

      navigate(from, { replace: true });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: err || "Invalid credentials"
      });
    }
  };

   const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await api.post("/auth/google-login", 
      {token: credentialResponse.credential});

      localStorage.setItem("token", res.data.token);

      dispatch({
        type: "auth/login/fulfilled",
        payload: res.data
      });

      Swal.fire("Success", "Logged in with Google", "success");
      navigate("/");
    } catch  {
      Swal.fire("Error", "Google login failed", "error");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>

      <form onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

       <div className="divider">OR</div>

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => Swal.fire("Error", "Google login failed", "error")}
      />
    

      <p
        className="forgot-link"
        onClick={() => navigate("/forgot-password")}
      >
        Forgot Password?
      </p>

      <p className="auth-footer">
        Not registered?{" "}
        <Link to="/register" className="register-link">
          Register here
        </Link>
      </p>
    </div>
  );
};

export default Login;




