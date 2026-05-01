import { serverAPI } from "../request/serverAPI";

export const uomAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    uom: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/uom`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Uom"],
    }),
    createUom: builder.mutation({
      query: (payload) => ({
        url: `/uom`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
    updateUom: builder.mutation({
      query: (payload) => ({
        url: `/uom/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
    archiveUom: builder.mutation({
      query: (payload) => ({
        url: `/uom/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
    importUom: builder.mutation({
      query: (payload) => ({
        url: `/import/uom`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Uom"],
    }),
  }),
});

export const {
  useUomQuery,
  useLazyUomQuery,
  useCreateUomMutation,
  useUpdateUomMutation,
  useArchiveUomMutation,
  useImportUomMutation,
} = uomAPI;
