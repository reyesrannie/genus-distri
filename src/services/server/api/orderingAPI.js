import { serverAPI } from "../request/serverAPI";

export const orderingAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    order: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/transaction`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Order"],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Order"],
    }),
    updateOrder: builder.mutation({
      query: (payload) => ({
        url: `/transaction/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Order"],
    }),
    archiveOrder: builder.mutation({
      query: (payload) => ({
        url: `/transaction/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Order"],
    }),
    importOrder: builder.mutation({
      query: (payload) => ({
        url: `/import/transaction`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Order"],
    }),
  }),
});

export const {
  useOrderQuery,
  useLazyOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useArchiveOrderMutation,
  useImportOrderMutation,
} = orderingAPI;
