import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

/* FETCH PROFILE */
export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/user/me");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: { profile: null, loading: false, error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProfile.pending, s => { s.loading = true; })
      .addCase(fetchProfile.fulfilled, (s,a)=>{s.loading=false;s.profile=a.payload})
      .addCase(fetchProfile.rejected, (s,a)=>{s.loading=false;s.error=a.payload});
  }
});

export default userSlice.reducer;

