import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isDrawerOpen: false,
  hiddenNavigation: false,
  isButtomNavActivate: false,
};

const drawerSlice = createSlice({
  name: "drawer",
  initialState,
  reducers: {
    setIsDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setHiddenNavigation: (state, action) => {
      state.hiddenNavigation = action.payload;
    },
    setIsButtomNavActivate: (state, action) => {
      state.isButtomNavActivate = action.payload;
    },
    resetDrawer: () => {
      return initialState;
    },
  },
});

export const {
  resetDrawer,
  setIsDrawerOpen,
  setHiddenNavigation,
  setIsButtomNavActivate,
} = drawerSlice.actions;

export default drawerSlice.reducer;
