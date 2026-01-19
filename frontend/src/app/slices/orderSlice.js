import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= FETCH ORDERS ================= */
export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/orders/my-orders");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    list: [],
    loading: false
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrders.pending, state => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchOrders.rejected, state => {
        state.loading = false;
      });
  }
});

export default orderSlice.reducer;
