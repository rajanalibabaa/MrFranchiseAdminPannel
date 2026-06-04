import { createSlice } from "@reduxjs/toolkit";

import { getInvestorEnquiries } from "./investorThunk";

const initialState = {
  loading: false,
  enquiries: [],
  error: null,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  limit: 20,
};



const investorSlice = createSlice({
  name: "investorEnquiry",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getInvestorEnquiries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getInvestorEnquiries.fulfilled, (state, action) => {
        state.loading = false;
        state.enquiries = action.payload.data || [];
        state.total = action.payload.total || 0;
        // ✅ Calculate totalPages from total and limit
        state.totalPages = Math.ceil(
          (action.payload.total || 0) / (action.payload.limit || 20)
        );
        state.currentPage = action.payload.page || 1;
        state.limit = action.payload.limit || 20;
        state.error = null;
      })
      .addCase(getInvestorEnquiries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default investorSlice.reducer;