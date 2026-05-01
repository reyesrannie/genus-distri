import { serverAPI } from "../request/serverAPI";

export const approvalSetupAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    approvalSetup: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/approver_setup`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["ApprovalSetup"],
    }),
    createApprovalSetup: builder.mutation({
      query: (payload) => ({
        url: `/approver_setup`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ApprovalSetup"],
    }),
    updateApprovalSetup: builder.mutation({
      query: (payload) => ({
        url: `/approver_setup/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ApprovalSetup"],
    }),
    archiveApprovalSetup: builder.mutation({
      query: (payload) => ({
        url: `/approver_setup/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["ApprovalSetup"],
    }),
    importApprovalSetup: builder.mutation({
      query: (payload) => ({
        url: `/import/approver_setup`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ApprovalSetup"],
    }),
  }),
});

export const {
  useApprovalSetupQuery,
  useLazyApprovalSetupQuery,
  useCreateApprovalSetupMutation,
  useUpdateApprovalSetupMutation,
  useArchiveApprovalSetupMutation,
  useImportApprovalSetupMutation,
} = approvalSetupAPI;
