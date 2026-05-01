import { serverAPI } from "../request/serverAPI";

export const accountTitleAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    accountTitle: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/account_title`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["AccountTitle"],
    }),
    createAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    updateAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    archiveAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/account_title/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
    importAccountTitle: builder.mutation({
      query: (payload) => ({
        url: `/import/account_title`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["AccountTitle"],
    }),
  }),
});

export const {
  useAccountTitleQuery,
  useLazyAccountTitleQuery,
  useCreateAccountTitleMutation,
  useUpdateAccountTitleMutation,
  useArchiveAccountTitleMutation,
  useImportAccountTitleMutation,
} = accountTitleAPI;
