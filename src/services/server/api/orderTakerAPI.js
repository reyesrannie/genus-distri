import { serverAPI } from "../request/serverAPI";

export const orderTakerAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    orderTaker: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/report`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["OrderTaker"],
    }),

    serveOrder: builder.mutation({
      query: (payload) => ({
        url: `/serve/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["OrderTaker"],
    }),
    serveUpdateOrder: builder.mutation({
      query: (payload) => ({
        url: `/report/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["OrderTaker"],
    }),
  }),
});

export const {
  useServeOrderMutation,
  useOrderTakerQuery,
  useServeUpdateOrderMutation,
  useLazyOrderTakerQuery,
} = orderTakerAPI;
