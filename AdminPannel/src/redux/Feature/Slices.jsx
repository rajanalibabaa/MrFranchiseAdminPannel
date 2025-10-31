import { createSlice } from "@reduxjs/toolkit";




const adminSlice = createSlice({
    name: "investor",
    initialState: {},
    reducers: {
       
        getAllInvestor: (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.isLoggedIn = true;
        },
    },
    });

export const { getAllInvestor } =  adminSlice.actions;
export default adminSlice.reducer; 