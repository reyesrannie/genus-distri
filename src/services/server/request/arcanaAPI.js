import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const arcanaMTBaseApi = createApi({
  reducerPath: "arcanaMTApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_ARCANA_MT_URL,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const arcanaKey = import.meta.env.VITE_ARCANA_API_KEY;
      headers.set("api-key", arcanaKey);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
