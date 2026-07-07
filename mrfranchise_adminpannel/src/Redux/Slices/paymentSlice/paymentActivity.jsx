import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

import axios from "axios";

// ======================================================
// API URL
// ======================================================

const API =
  "https://mrfranchisebackend.mrfranchise.in/api/v1/payment/allpayment/history";

// ======================================================
// FETCH TABLE DATA
// ======================================================

export const fetchPaymentHistory =
  createAsyncThunk(
    "payment/fetchPaymentHistory",

    async (params, thunkAPI) => {
      try {
        const response =
          await axios.get(API, {
            params,
          });

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data ||
            error.message
        );
      }
    }
  );

// ======================================================
// FETCH OVERALL ANALYTICS
// ======================================================

export const fetchAllPaymentAnalytics =
  createAsyncThunk(
    "payment/fetchAllPaymentAnalytics",

    async (_, thunkAPI) => {
      try {
        const response =
          await axios.get(API, {
            params: {
              page: 1,
              limit: 999999,
            },
          });

        return response.data;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          error.response?.data ||
            error.message
        );
      }
    }
  );

// ======================================================
// SLICE
// ======================================================

const paymentSlice =
  createSlice({
    name: "paymentHistory",

    initialState: {
      loading: false,

      payments: [],

      analyticsPayments: [],

      totalPages: 1,

      total: 0,

      error: null,
    },

    reducers: {},

    extraReducers: (
      builder
    ) => {
      // ======================================================
      // TABLE DATA
      // ======================================================

      builder

        .addCase(
          fetchPaymentHistory.pending,
          (state) => {
            state.loading = true;

            state.error = null;
          }
        )

        .addCase(
          fetchPaymentHistory.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            // ======================================================
            // LATEST PAYMENT FIRST
            // ======================================================

            state.payments =
              (
                action.payload
                  ?.data || []
              ).sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ) -
                  new Date(
                    a.createdAt
                  )
              );

            state.totalPages =
              action.payload
                ?.totalPages || 1;

            state.total =
              action.payload
                ?.total || 0;
          }
        )

        .addCase(
          fetchPaymentHistory.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        );

      // ======================================================
      // OVERALL ANALYTICS
      // ======================================================

      builder

        .addCase(
          fetchAllPaymentAnalytics.pending,
          (state) => {
            state.loading = true;
          }
        )

        .addCase(
          fetchAllPaymentAnalytics.fulfilled,
          (
            state,
            action
          ) => {
            state.loading = false;

            // ======================================================
            // OVERALL DATA
            // ======================================================

            state.analyticsPayments =
              (
                action.payload
                  ?.data || []
              ).sort(
                (a, b) =>
                  new Date(
                    b.createdAt
                  ) -
                  new Date(
                    a.createdAt
                  )
              );
          }
        )

        .addCase(
          fetchAllPaymentAnalytics.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload;
          }
        );
    },
  });

export default paymentSlice.reducer;
