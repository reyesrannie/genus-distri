import { serverAPI } from "../request/serverAPI";

export const customerAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    customer: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/customer`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Customer"],
    }),
    createCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    updateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    archiveCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
    importCustomer: builder.mutation({
      query: (payload) => ({
        url: `/import/customer`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Customer"],
    }),
  }),
});

export const {
  useLazyCustomerQuery,
  useCustomerQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useArchiveCustomerMutation,
  useImportCustomerMutation,
} = customerAPI;
