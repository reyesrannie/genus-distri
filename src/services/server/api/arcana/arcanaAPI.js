import { arcanaMTBaseApi } from "../../request/arcanaAPI";
import { setIsLoading } from "../../slice/modalSlice";
import {
  setCustomerData,
  setProductData,
  setTdoData,
} from "../../slice/valuesSlice";

export const arcanaMTApi = arcanaMTBaseApi.injectEndpoints({
  endpoints: (builder) => ({
    type: builder.query({
      query: (payload) => ({
        url: `/DistributionType/external`,
        method: "GET",
        params: payload,
      }),
    }),
    tdo: builder.query({
      query: (payload) => ({
        url: `/TDO/external`,
        method: "GET",
        params: payload,
      }),
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.value?.tdos) dispatch(setTdoData(data?.value?.tdos));
          else dispatch(setTdoData(data));
        } catch (error) {}
      },
    }),
    customer: builder.query({
      query: (payload) => ({
        url: `/ClientX/external`,
        method: "GET",
        params: payload,
      }),
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.value?.clients)
            dispatch(setCustomerData(data?.value?.clients));
          else dispatch(setCustomerData(data));
        } catch (error) {}
      },
    }),
    product: builder.query({
      query: (payload) => ({
        url: `/ItemsX/external`,
        method: "GET",
        params: payload,
      }),
      async onQueryStarted(payload, { dispatch, getState, queryFulfilled }) {
        dispatch(setIsLoading(true));
        try {
          const { data } = await queryFulfilled;
          if (data?.value?.items) dispatch(setProductData(data?.value?.items));
          else dispatch(setProductData(data));
        } catch (error) {}
        dispatch(setIsLoading(false));
      },
    }),
  }),
});

export const {
  useTypeQuery,
  useLazyTypeQuery,
  useLazyTdoQuery,
  useTdoQuery,
  useCustomerQuery,
  useLazyCustomerQuery,
  useLazyProductQuery,
  useProductQuery,
} = arcanaMTApi;
