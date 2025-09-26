import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  adminData: localStorage.getItem("adminData")
    ? JSON.parse(localStorage.getItem("adminData"))
    : [],
};

const authSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    Login: (state, action) => {
      state.adminData = action.payload;
      localStorage.setItem("adminData", JSON.stringify(action.payload));
    },
    Logout: (state) => {
      state.adminData = [];
      localStorage.removeItem("adminData");
    },
  },
});

export const { Login, Logout } = authSlice.actions;
export default authSlice.reducer;
