// src/Redux/Slices/NotificationsSlice/notificationsSlice.jsx
import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  getNotificationByUUID,
  updateNotificationStatus,
  deleteNotification,
} from "./notificationsThunksUpdation.jsx";
import { socket } from "../../../Utils/SocketNotification.jsx";

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      const exists = state.list.some((n) => n.uuid === action.payload.uuid);
      if (!exists) state.list.unshift(action.payload);
    },
    updateRealtimeNotification: (state, action) => {
      const updated = action.payload;
      const i = state.list.findIndex((n) => n.uuid === updated.uuid);
      if (i > -1) {
        state.list[i] = { ...state.list[i], ...updated };
      } else {
        state.list.unshift(updated);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.list = payload;
      })
      .addCase(fetchNotifications.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // Get one by UUID
      .addCase(getNotificationByUUID.fulfilled, (state, { payload }) => {
        state.current = payload;
      })

      // Update one
      .addCase(updateNotificationStatus.fulfilled, (state, { payload }) => {
        const i = state.list.findIndex((n) => n.uuid === payload.uuid);
        if (i > -1) {
          state.list[i] = payload;
        } else {
          state.list.unshift(payload);
        }
      })

      // Delete one
     .addCase(deleteNotification.fulfilled, (state, { payload }) => {
  state.list = state.list.filter((n) => n.uuid !== payload.uuid);
});


    

  },
});

export const { addNotification, updateRealtimeNotification  } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;

// 🔌 Real-time setup
export const initSocketListeners = (dispatch) => {
  socket.on("newNotification", (data) => {
    console.log("🔔 Real-time new:", data);
    dispatch(addNotification(data));
  });

  socket.on("updateNotification", (data) => {
    console.log("🔁 Real-time update:", data);
    dispatch(updateRealtimeNotification(data));
  });
};
