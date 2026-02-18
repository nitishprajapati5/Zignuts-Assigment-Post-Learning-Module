import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      console.log("From Slice",action.payload)
      state.auth = action.payload; 
    },
    clearAuth: (state) => {
      state.auth = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
