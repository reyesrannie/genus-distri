import { serverAPI } from "../request/serverAPI";

export const accountTitleAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    cutOff: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/cut_off`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["CutOff"],
    }),
    createCutOff: builder.mutation({
      query: (payload) => ({
        url: `/cut_off`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOff"],
    }),
    updateCutOff: builder.mutation({
      query: (payload) => ({
        url: `/cut_off/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CutOff"],
    }),
    archiveCutOff: builder.mutation({
      query: (payload) => ({
        url: `/cut_off/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["CutOff"],
    }),
    importCutOff: builder.mutation({
      query: (payload) => ({
        url: `/import/cut_off`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CutOff"],
    }),
  }),
});

export const {
  useCutOffQuery,
  useLazyCutOffQuery,
  useCreateCutOffMutation,
  useUpdateCutOffMutation,
  useArchiveCutOffMutation,
  useImportCutOffMutation,
} = accountTitleAPI;
