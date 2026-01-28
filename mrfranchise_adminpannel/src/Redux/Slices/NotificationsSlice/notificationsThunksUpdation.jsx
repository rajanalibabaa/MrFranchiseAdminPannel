import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://mrfranchisebackend.mrfranchise.in/api/v1/brandlisting";

// Get all notifications
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/userRequestNotification`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get by UUID
export const getNotificationByUUID = createAsyncThunk(
  "notifications/getByUUID",
  async (uuid, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/userRequestNotificationByUUID${uuid}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update status (view/open/solve)
export const updateNotificationStatus = createAsyncThunk(
  "notifications/updateStatus",
  async ({ uuid, action }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`${BASE_URL}/userRequestNotification/${uuid}`, { action });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (uuid, { rejectWithValue }) => {
    try {
      // If uuid is an object, extract it
      const notificationId = typeof uuid === "object" ? uuid.uuid : uuid;

      const { data } = await axios.delete(
        `${BASE_URL}/userRequestNotification/${notificationId}`
      );

      // Ensure we return the same structure that the slice expects
      return { uuid: notificationId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
