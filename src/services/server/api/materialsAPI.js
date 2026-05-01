import { serverAPI } from "../request/serverAPI";

export const materialsAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    materials: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/material`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Materials"],
    }),
    createMaterials: builder.mutation({
      query: (payload) => ({
        url: `/material`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Materials"],
    }),
    updateMaterials: builder.mutation({
      query: (payload) => ({
        url: `/material/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Materials"],
    }),
    archiveMaterials: builder.mutation({
      query: (payload) => ({
        url: `/material/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Materials"],
    }),
    importMaterials: builder.mutation({
      query: (payload) => ({
        url: `/import/material`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Materials"],
    }),
  }),
});

export const {
  useMaterialsQuery,
  useLazyMaterialsQuery,
  useCreateMaterialsMutation,
  useUpdateMaterialsMutation,
  useArchiveMaterialsMutation,
  useImportMaterialsMutation,
} = materialsAPI;
