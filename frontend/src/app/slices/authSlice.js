import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";





const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  loading: false,
  error: null
};

/* =====================================================
   LOGIN
===================================================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);
      return data;
      
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);



/* =====================================================
   LOAD LOGGED-IN USER (/user/me)
===================================================== */
export const loadMe = createAsyncThunk(
  "auth/loadMe",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/user/me");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Unauthorized");
    }
  }
);

/* =====================================================
   SEND OTP FOR PROFILE PASSWORD CHANGE
===================================================== */
export const sendChangePasswordOtp = createAsyncThunk(
  "auth/sendProfileOtp",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/send-profile-otp");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "OTP failed");
    }
  }
);

/* =====================================================
   VERIFY PROFILE OTP & UPDATE PASSWORD
===================================================== */
export const verifyProfileOtp = createAsyncThunk(
  "auth/verifyProfileOtp",
  async ({ otp }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/verify-profile-otp", {
        otp
      });
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "OTP invalid");
    }
  }
);

/* =====================================================
   AUTH SLICE
===================================================== */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    }
  },
  extraReducers: builder => {
    builder

      /* ---------- LOGIN ---------- */
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- LOAD ME ---------- */
      .addCase(loadMe.pending, state => {
        state.loading = true;
      })
      .addCase(loadMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadMe.rejected, state => {
        state.loading = false;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })

      /* ---------- SEND PROFILE OTP ---------- */
      .addCase(sendChangePasswordOtp.pending, state => {
        state.loading = true;
      })
      .addCase(sendChangePasswordOtp.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendChangePasswordOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- VERIFY PROFILE OTP ---------- */
      .addCase(verifyProfileOtp.pending, state => {
        state.loading = true;
      })
      .addCase(verifyProfileOtp.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyProfileOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

/* =====================================================
   EXPORTS
===================================================== */
export const { logout } = authSlice.actions;
export default authSlice.reducer;
