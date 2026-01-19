import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* ================= FETCH CART ================= */
export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async () => {
    const res = await api.get("/cart");
    return res.data.items || [];
  }
);

/* ================= ADD ================= */
export const addToCart = createAsyncThunk(
  "cart/add",
  async ({ productId, quantity }) => {
    const res = await api.post("/cart", { productId, quantity });
    return res.data.items;
  }
);

/* ================= UPDATE ================= */
export const updateQty = createAsyncThunk(
  "cart/update",
  async ({ productId, quantity }) => {
    const res = await api.put("/cart", { productId, quantity });
    return res.data.items;
  }
);

/* ================= REMOVE ================= */
export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data.items;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false 
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
   
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateQty.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  }
});


export default cartSlice.reducer;



