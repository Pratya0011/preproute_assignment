import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedInUserDetails: {},
  sidebarOpen: true,
};

export const commonStore = createSlice({
  name: "common",
  initialState,
  reducers: {
    handleUserDetails: (state, actions) => {
      state.loggedInUserDetails = actions.payload;
    },
    handleSidebarToggle: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { handleUserDetails, handleSidebarToggle } = commonStore.actions;
export default commonStore.reducer;
