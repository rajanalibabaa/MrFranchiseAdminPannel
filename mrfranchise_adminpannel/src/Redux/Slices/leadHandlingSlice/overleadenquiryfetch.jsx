import {
  createSlice,
} from "@reduxjs/toolkit";

import {
  getInvestorEnquiries,
} from "./investorThunk";

const initialState = {
  loading: false,
  enquiries: [],
  filteredEnquiries: [],
  error: null,
};

const investorSlice = createSlice({
  name: "investorEnquiry",

  initialState,

  reducers: {
    applyFilters: (state, action) => {
      const filters = action.payload;

      let filtered = [...state.enquiries];

      // Search
      if (filters.search) {
        const search =
          filters.search.toLowerCase();

        filtered = filtered.filter(
          (item) =>
            item.investorName
              ?.toLowerCase()
              .includes(search) ||
            item.investorEmail
              ?.toLowerCase()
              .includes(search) ||
            item.investorPhone
              ?.toLowerCase()
              .includes(search) ||
            item.brandName
              ?.toLowerCase()
              .includes(search)
        );
      }

      // State
      if (filters.state) {
        filtered = filtered.filter(
          (item) =>
            item.state === filters.state
        );
      }

      // Category
      if (filters.category) {
        filtered = filtered.filter(
          (item) =>
            item.category ===
            filters.category
        );
      }

      // Industry
      if (filters.industry) {
        filtered = filtered.filter(
          (item) =>
            item.industry ===
            filters.industry
        );
      }

      // Investment Range
      if (filters.investmentRange) {
        filtered = filtered.filter(
          (item) =>
            item.investmentRange ===
            filters.investmentRange
        );
      }

      // Status
      if (filters.status) {
        filtered = filtered.filter(
          (item) =>
            item.status ===
            filters.status
        );
      }

      state.filteredEnquiries =
        filtered;
    },

    clearFilters: (state) => {
      state.filteredEnquiries =
        state.enquiries;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(
        getInvestorEnquiries.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getInvestorEnquiries.fulfilled,
        (state, action) => {
          state.loading = false;

          state.enquiries =
            action.payload;

          state.filteredEnquiries =
            action.payload;
        }
      )

      .addCase(
        getInvestorEnquiries.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload;
        }
      );
  },
});

export const {
  applyFilters,
  clearFilters,
} = investorSlice.actions;

export default investorSlice.reducer;