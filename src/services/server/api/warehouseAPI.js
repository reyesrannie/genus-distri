import { serverAPI } from "../request/serverAPI";

export const warehouseAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    warehouse: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/warehouse`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Warehouse"],
    }),
    createWarehouse: builder.mutation({
      query: (payload) => ({
        url: `/warehouse`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    updateWarehouse: builder.mutation({
      query: (payload) => ({
        url: `/warehouse/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    archiveWarehouse: builder.mutation({
      query: (payload) => ({
        url: `/warehouse/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Warehouse"],
    }),
    importWarehouse: builder.mutation({
      query: (payload) => ({
        url: `/import/warehouse`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Warehouse"],
    }),
  }),
});

export const {
  useWarehouseQuery,
  useLazyWarehouseQuery,
  useCreateWarehouseMutation,
  useUpdateWarehouseMutation,
  useArchiveWarehouseMutation,
  useImportWarehouseMutation,
} = warehouseAPI;
