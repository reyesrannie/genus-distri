import { serverAPI } from "../request/serverAPI";

export const rolesAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    role: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/role`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["Roles"],
    }),
    createRole: builder.mutation({
      query: (payload) => ({
        url: `/role`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    updateRole: builder.mutation({
      query: (payload) => ({
        url: `/role/${payload?.id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
    archiveRole: builder.mutation({
      query: (payload) => ({
        url: `/role/${payload?.id}`,
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useRoleQuery,
  useLazyRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useArchiveRoleMutation,
} = rolesAPI;
