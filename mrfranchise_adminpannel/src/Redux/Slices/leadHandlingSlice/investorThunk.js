import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API =
  "http://localhost:5000/api/v1/instantapply/all";

export const getInvestorEnquiries =
  createAsyncThunk(
    "investorEnquiry/getAll",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(API);

        return response.data?.data || [];
      } catch (error) {
        return rejectWithValue(
          error.response?.data?.message ||
            error.message
        );
      }
    }
  );