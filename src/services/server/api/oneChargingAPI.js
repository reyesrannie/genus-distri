import { serverAPI } from "../request/serverAPI";
import { setChargingData } from "../slice/valuesSlice";

export const authAPI = serverAPI.injectEndpoints({
  endpoints: (builder) => ({
    oneCharging: builder.query({
      transformResponse: (response) => response,
      query: (payload) => ({
        url: `/charging`,
        method: "GET",
        params: payload,
      }),
      providesTags: ["OneCharging"],
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.result?.data) dispatch(setChargingData(data?.result?.data));
          else dispatch(setChargingData(data?.result));
        } catch (error) {}
      },
    }),
    syncCharging: builder.mutation({
      query: (payload) => ({
        url: `/sync_charging`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OneCharging"],
    }),
  }),
});

export const {
  useOneChargingQuery,
  useLazyOneChargingQuery,
  useSyncChargingMutation,
} = authAPI;
