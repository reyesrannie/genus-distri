import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_ONE_CHARGING_BASE_URL;
const apiKey = import.meta.env.VITE_ONE_CHARGING_KEY;

export const oneChargingAPI = createApi({
  reducerPath: "oneChargingAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    mode: "cors",
    prepareHeaders: (headers) => {
      headers.set("API_KEY", `${apiKey}`);
      headers.set("Accept", "application/json");
      return headers;
    },
  }),
  tagTypes: ["ONECHARGING"],
  endpoints: (builder) => ({
    oneChargingSync: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/charging_api?per_page=10&page=1&pagination=none`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ONECHARGING"],
    }),
    oneTitleSync: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account_title_external?per_page=10&page=1&pagination=none`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ONETITLE"],
    }),
  }),
});

export const { useLazyOneChargingSyncQuery, useLazyOneTitleSyncQuery } =
  oneChargingAPI;
