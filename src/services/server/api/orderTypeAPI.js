import { serverAPI } from "../request/serverAPI";

export const orderTypeAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    orderType: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/order_type`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["OrderType"],
    }),
    createOrderType: builder.mutation({
      query: (payload) => ({
        url: `/order_type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrderType"],
    }),
    updateOrderType: builder.mutation({
      query: (payload) => ({
        url: `/order_type/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["OrderType"],
    }),
    archiveOrderType: builder.mutation({
      query: (payload) => ({
        url: `/order_type/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["OrderType"],
    }),
    importOrderType: builder.mutation({
      query: (payload) => ({
        url: `/import/order_type`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrderType"],
    }),
  }),
});

export const {
  useLazyOrderTypeQuery,
  useOrderTypeQuery,
  useCreateOrderTypeMutation,
  useUpdateOrderTypeMutation,
  useArchiveOrderTypeMutation,
  useImportOrderTypeMutation,
} = orderTypeAPI;
