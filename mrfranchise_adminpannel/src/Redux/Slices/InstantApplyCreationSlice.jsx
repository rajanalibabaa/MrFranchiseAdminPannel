// store/slices/applicationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"; // dynamic base URL

// ================================
// 🟢 Submit Single Application
// ================================
export const submitApplication = createAsyncThunk(
  'applications/submitApplication',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('Submitting application with payload:', payload);

      const { accessToken, ...data } = payload;
      const response = await axios.post(`${BASE_URL}/createlead`, data, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        withCredentials: true,
      });

      console.log('Application submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Application submission error:', error);

      if (error.response) {
        return rejectWithValue({
          message: error.response.data?.message || 'Server error occurred',
          status: error.response.status,
          data: error.response.data,
        });
      } else if (error.request) {
        return rejectWithValue({
          message: 'Network error - please check your connection',
          type: 'network',
        });
      } else {
        return rejectWithValue({
          message: error.message || 'An unexpected error occurred',
          type: 'unknown',
        });
      }
    }
  }
);

// ================================
// 🟠 Bulk Upload Applications
// ================================
export const submitBulkApplications = createAsyncThunk(
  'applications/submitBulkApplications',
  async ({ applications, accessToken }, { rejectWithValue, dispatch }) => {
    try {
      const results = [];

      for (let i = 0; i < applications.length; i++) {
        const currentApp = applications[i];
        try {
          const response = await axios.post(`${BASE_URL}/createlead`, currentApp, {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${accessToken}`,
            },
            withCredentials: true,
          });

          results.push({
            row: i + 1,
            status: 'success',
            data: response.data,
            original: currentApp,
          });

          dispatch(updateUploadProgress({ current: i + 1, total: applications.length }));
        } catch (error) {
          const errorMessage =
            error.response?.data?.message || error.message || 'Unknown error';
          results.push({
            row: i + 1,
            status: 'error',
            error: errorMessage,
            original: currentApp,
          });
        }
      }

      return results;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Bulk upload failed',
        type: 'bulk_upload',
      });
    }
  }
);

// ================================
// ⚙️ Slice Definition
// ================================
const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    isSubmitting: false,
    submitSuccess: false,
    error: null,
    bulkUploadResults: [],
    uploadProgress: { current: 0, total: 0 },
    isUploading: false,
    lastSubmittedApplication: null,
  },
  reducers: {
    resetSubmitState: (state) => {
      state.isSubmitting = false;
      state.submitSuccess = false;
      state.error = null;
    },
    resetBulkUpload: (state) => {
      state.bulkUploadResults = [];
      state.uploadProgress = { current: 0, total: 0 };
      state.isUploading = false;
      state.error = null;
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= Single Application =============
      .addCase(submitApplication.pending, (state) => {
        state.isSubmitting = true;
        state.submitSuccess = false;
        state.error = null;
        console.log('Application submission started');
      })
      .addCase(submitApplication.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = true;
        state.lastSubmittedApplication = action.payload;
        state.error = null;
        console.log('Application submission successful');
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.isSubmitting = false;
        state.submitSuccess = false;
        state.error = action.payload;
        console.log('Application submission failed:', action.payload);
      })

      // ============= Bulk Upload =============
      .addCase(submitBulkApplications.pending, (state) => {
        state.isUploading = true;
        state.error = null;
        state.bulkUploadResults = [];
        state.uploadProgress = { current: 0, total: 0 };
      })
      .addCase(submitBulkApplications.fulfilled, (state, action) => {
        state.isUploading = false;
        state.bulkUploadResults = action.payload;
        state.error = null;
      })
      .addCase(submitBulkApplications.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
        state.bulkUploadResults = [];
      });
  },
});

// ================================
// 🔁 Exports
// ================================
export const {
  resetSubmitState,
  resetBulkUpload,
  updateUploadProgress,
  clearError,
} = applicationSlice.actions;

export default applicationSlice.reducer;
