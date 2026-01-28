// src/Redux/Slices/AdvertiseHandlingSlices.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://mrfranchisebackend.mrfranchise.in/api/v1/brandadvertise/payment";

// --- Helper for consistent error messages ---
const getErrorMessage = (err) => {
  if (!err) return "Unknown error";
  if (err.response && err.response.data) {
    return (
      err.response.data.message ||
      err.response.data.error ||
      JSON.stringify(err.response.data)
    );
  }
  return err.message || String(err);
};

/* =====================================================
   THUNKS
===================================================== */

// 📦 Fetch all packages
export const fetchPaymentPackages = createAsyncThunk(
  "paymentPackages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(BASE_URL);
      return response.data.data || [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// ✏️ Update package by UUID
export const updatePaymentPackage = createAsyncThunk(
  "paymentPackages/update",
  async ({ uuid, data }, { rejectWithValue }) => {
    try {
      if (!uuid) return rejectWithValue("Missing UUID for update request");

      const response = await axios.put(`${BASE_URL}/${data.uuid}`, data);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

// 🗑️ Delete package by UUID
export const deletePaymentPackage = createAsyncThunk(
  "paymentPackages/delete",
  async (uuid, { rejectWithValue }) => {
    try {
      if (!uuid) return rejectWithValue("Missing UUID for delete request");

      await axios.delete(`${BASE_URL}/${uuid}`);
      return uuid;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err));
    }
  }
);

/* =====================================================
   SLICE
===================================================== */

const initialState = {
  packages: [],
  loading: false,
  updating: false,
  deleting: false,
  error: null,
};

const paymentPackageSlice = createSlice({
  name: "paymentPackages",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ---------- FETCH ---------- */
    builder
      .addCase(fetchPaymentPackages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentPackages.fulfilled, (state, action) => {
        state.loading = false;
        state.packages = action.payload || [];
      })
      .addCase(fetchPaymentPackages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch packages";
      });

    /* ---------- UPDATE ---------- */
    builder
      .addCase(updatePaymentPackage.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updatePaymentPackage.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;
        if (!updated || !updated.uuid) {
          state.error = "Update succeeded but returned unexpected data";
          return;
        }
        state.packages = state.packages.map((pkg) =>
          pkg.uuid === updated.uuid ? updated : pkg
        );
      })
      .addCase(updatePaymentPackage.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload || "Failed to update package";
      });

    /* ---------- DELETE ---------- */
    builder
      .addCase(deletePaymentPackage.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deletePaymentPackage.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedUuid = action.payload;
        state.packages = state.packages.filter(
          (pkg) => pkg.uuid !== deletedUuid
        );
      })
      .addCase(deletePaymentPackage.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || "Failed to delete package";
      });
  },
});

export const { clearError } = paymentPackageSlice.actions;
export default paymentPackageSlice.reducer;
