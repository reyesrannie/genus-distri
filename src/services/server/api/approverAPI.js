import { serverAPI } from "../request/serverAPI";

export const orderingAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    approver: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approval`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Approver"],
    }),

    approveOrder: builder.mutation({
      query: (payload) => ({
        url: `/approved/transaction/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Approver"],
    }),
    returnOrder: builder.mutation({
      query: (payload) => ({
        url: `/return/transaction/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Approver"],
    }),
    rejectOrder: builder.mutation({
      query: (payload) => ({
        url: `/reject/transaction/${payload?.id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["Approver"],
    }),
  }),
});

export const {
  useApproverQuery,
  useApproveOrderMutation,
  useReturnOrderMutation,
  useRejectOrderMutation,
} = orderingAPI;
