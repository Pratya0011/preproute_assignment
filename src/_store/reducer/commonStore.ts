import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loggedInUserDetails: {},
};

export const commonStore = createSlice({
  name: "common",
  initialState,
  reducers: {
    handleUserDetails: (state, actions) => {
      state.loggedInUserDetails = actions.payload;
    },
  },
});

export const { handleUserDetails } = commonStore.actions;
export default commonStore.reducer;
