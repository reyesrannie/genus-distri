import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    resetTheme: () => {
      return initialState;
    },
  },
});

export const { resetTheme, setMode } = themeSlice.actions;

export default themeSlice.reducer;
