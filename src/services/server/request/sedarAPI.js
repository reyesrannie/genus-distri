import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_SEDAR_BASE_URL;
const token = import.meta.env.VITE_SEDAR_KEY;

export const sedarAPI = createApi({
  reducerPath: "sedarAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      headers.set("Authorization", `Bearer ${token}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["SEDAR"],
  endpoints: (builder) => ({
    employee: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/data/employee/filter/active`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["SEDAR"],
    }),
  }),
});

export const { useEmployeeQuery } = sedarAPI;
