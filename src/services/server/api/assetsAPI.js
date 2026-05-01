import { serverAPI } from "../request/serverAPI";

export const accountTitleAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    assets: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/assets`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Assets"],
    }),
    createAssets: builder.mutation({
      query: (payload) => ({
        url: `/assets`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assets"],
    }),
    updateAssets: builder.mutation({
      query: (payload) => ({
        url: `/assets/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Assets"],
    }),
    archiveAssets: builder.mutation({
      query: (payload) => ({
        url: `/assets/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Assets"],
    }),
    importAssets: builder.mutation({
      query: (payload) => ({
        url: `/import/assets`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Assets"],
    }),
  }),
});

export const {
  useAssetsQuery,
  useLazyAssetsQuery,
  useCreateAssetsMutation,
  useUpdateAssetsMutation,
  useArchiveAssetsMutation,
  useImportAssetsMutation,
} = accountTitleAPI;
