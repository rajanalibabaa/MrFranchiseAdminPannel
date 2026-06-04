// investorThunk.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:5000/api/v1/instantapply/all";

export const getInvestorEnquiries = createAsyncThunk(
  "investorEnquiry/getAll",
  async (
    {
      page = 1,
      limit = 20,
      search = "",
      category = "",
      industry = "",
      investmentRange = "",
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(API, {
        params: {
          page,
          limit,
          ...(search && { search }),
          ...(category && { category }),
          ...(industry && { industry }),
          ...(investmentRange && { investmentRange }),
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);