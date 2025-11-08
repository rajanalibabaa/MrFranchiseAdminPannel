import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetApiCall } from "../../api/default/GetApi";
import { Api } from "../../api/apiurl";

// ✅ Thunk with date filter support
export const fetchNewIncomingBrands = createAsyncThunk(
  "brands/fetchNewIncomingBrands",
  async ({ page = 1, startDate, endDate } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({ page, limit: 10 });

      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      const res = await GetApiCall(
        `${Api.admin.brand.getNewIncomingBrands}?${queryParams.toString()}`
      );

      const data = res?.data?.data || {};
      // console.log("res :", data);

      return {
        page,
        brands: data.brands || [],
        total: data.pagination?.total || 0,
        hasNext: data.pagination?.hasNext || false,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ✅ Get brand details
export const fetchBrandById = createAsyncThunk(
  "brands/fetchBrandById",
  async (brandId, { rejectWithValue }) => {
    try {
      const res = await GetApiCall(
        `${Api.admin.brand.getNewIncomingBrandById}/${brandId}`
      );
      return res?.data?.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const newIncomingSlice = createSlice({
  name: "brands",
  initialState: {
    brands: [],
    brandDetails: null,
    totalBrands: 0,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      hasNext: false,
    },
    goToNewIncoming: null,
  },
  reducers: {
    approveBrand: (state, action) => {
      state.brands = state.brands.filter((b) => b.uuid !== action.payload);
      state.totalBrands -= 1;
    },
    deleteBrand: (state, action) => {
      state.brands = state.brands.filter((b) => b.uuid !== action.payload);
      state.totalBrands -= 1;
    },
    clearBrandDetails: (state) => {
      state.brandDetails = null;
    },
    resetBrands: (state) => {
      state.brands = [];
      state.totalBrands = 0;
      state.pagination = {
        currentPage: 1,
        hasNext: false,
      };
    },
    goToNewIncoming: (state, action) => {
      state.goToNewIncoming = action.payload;
      console.log(state.goToNewIncoming, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewIncomingBrands.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNewIncomingBrands.fulfilled, (state, action) => {
        const { page, brands, total, hasNext } = action.payload;

        state.brands =
          page === 1 ? brands : [...state.brands, ...(brands || [])];
        state.totalBrands = total;
        state.pagination = {
          currentPage: page,
          hasNext,
        };
        state.loading = false;
      })
      .addCase(fetchNewIncomingBrands.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchBrandById.fulfilled, (state, action) => {
        state.brandDetails = action.payload;
      });
  },
});

export const {
  approveBrand,
  deleteBrand,
  clearBrandDetails,
  resetBrands,
  goToNewIncoming,
} = newIncomingSlice.actions;

export default newIncomingSlice.reducer;
