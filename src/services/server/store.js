import { configureStore } from "@reduxjs/toolkit";
import { serverAPI } from "./request/serverAPI";
import themeSlice from "./slice/themeSlice";
import authSlice from "./slice/authSlice";
import drawerSlice from "./slice/drawerSlice";
import modalSlice from "./slice/modalSlice";
import promptSlice from "./slice/promptSlice";
import valuesSlice from "./slice/valuesSlice";

import { sedarAPI } from "./request/sedarAPI";
import { oneChargingAPI } from "./request/oneChargingAPI";
import { arcanaMTBaseApi } from "./request/arcanaAPI";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    auth: authSlice,
    drawer: drawerSlice,
    modal: modalSlice,
    prompt: promptSlice,
    values: valuesSlice,

    [serverAPI.reducerPath]: serverAPI.reducer,
    [arcanaMTBaseApi.reducerPath]: arcanaMTBaseApi.reducer,

    [sedarAPI.reducerPath]: sedarAPI.reducer,
    [oneChargingAPI.reducerPath]: oneChargingAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      serverAPI.middleware,
      sedarAPI.middleware,
      oneChargingAPI.middleware,
      arcanaMTBaseApi.middleware,
    ),
});
