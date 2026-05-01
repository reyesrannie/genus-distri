import { createSlice } from "@reduxjs/toolkit";
import { decodeUser } from "../../functions/saveUser";

const userData = decodeUser();

const initialState = {
  token: userData?.token,
  userData: userData,
  changePass: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setChangePass: (state, action) => {
      state.changePass = action.payload;
    },
    resetAuth: () => {
      return initialState;
    },
  },
});

export const { setToken, setUserData, setChangePass, resetAuth } =
  authSlice.actions;

export default authSlice.reducer;
