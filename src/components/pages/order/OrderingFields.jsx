import { Stack, TextField as MuiTextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import AppTextBox from "../../custom/AppTextBox";
import Autocomplete from "../../custom/AutoComplete";
import { getCustomer } from "../../../services/functions/saveUser";
import { useDispatch, useSelector } from "react-redux";
import {
  useLazyOneChargingQuery,
  useOneChargingQuery,
} from "../../../services/server/api/oneChargingAPI";
import useParamsHook from "../../../services/hooks/useParamsHook";
import {
  clearCustomerData,
  setChargingData,
  setProductData,
  setTypeData,
} from "../../../services/server/slice/valuesSlice";
import {
  useLazyCustomerQuery,
  useLazyProductQuery,
  useLazyTdoQuery,
  useLazyTypeQuery,
  useTypeQuery,
} from "../../../services/server/api/arcana/arcanaAPI";
import useArcanaParamsHook from "../../../services/hooks/useArcanaParamsHook";
import { useDebounceCallback } from "../../../services/hooks/useDebounceCallBack";
import { Controller } from "react-hook-form";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";

export const OrderingFields = ({ control, errors, watch, setValue }) => {
  const dispatch = useDispatch();
  const [openPicker, setOpenPicker] = useState(false);

  const chargingUser = getCustomer();
  const chargingData = useSelector((state) => state.values.chargingData);
  const customerData = useSelector((state) => state.values.customerData);

  const tdoData = useSelector((state) => state.values.tdoData);

  const approveOrdering = useSelector((state) => state.modal.approveOrdering);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);
  const viewOrdering = useSelector((state) => state.modal.viewOrdering);

  const { params: paramsCharging } = useParamsHook();
  const { params: paramsType } = useArcanaParamsHook();

  const [getCharging, { data: chargingFetch }] = useLazyOneChargingQuery();
  const { data: charging } = useOneChargingQuery(paramsCharging);
  const { data: type } = useTypeQuery(paramsType);
  const [getType, { data: typeFetch }] = useLazyTypeQuery();
  const [getTdo, { isFetching: tdoFetch }] = useLazyTdoQuery();

  const [getCustomerArcana, { isFetching: fetchArcanaCustomer }] =
    useLazyCustomerQuery();
  const [getProduct, { isError: errorProduct }] = useLazyProductQuery();

  useEffect(() => {
    if (charging?.result?.data) {
      dispatch(setChargingData(charging?.result?.data));
    }
    if (chargingFetch?.result?.data) {
      dispatch(setChargingData(chargingFetch?.result?.data));
    }
  }, [charging, chargingFetch]);

  useEffect(() => {
    if (type?.value?.distributionTypes) {
      dispatch(setTypeData(type?.value?.distributionTypes));
    }
    if (typeFetch?.value?.distributionTypes) {
      dispatch(setTypeData(typeFetch?.value?.distributionTypes));
    }
  }, [type, typeFetch]);

  useEffect(() => {
    if (errorProduct) {
      enqueueSnackbar("Failed to fetch products.", {
        variant: "warning",
      });
    }
  }, [errorProduct]);

  const handleSearchArcana = useDebounceCallback((searchValue) => {
    getType({
      isActive: true,
      search: searchValue,
    });
  }, 500);

  const handleSearchArcanaCustomer = useDebounceCallback((searchValue) => {
    getCustomerArcana({
      isActive: true,
      search: searchValue,
      PageSize: 100,
    });
  }, 500);

  const autoFillFields = (data) => {
    const mappedData = {
      branch_name: data?.businessName,
      customer_address: `${data?.businessAddress?.houseNumber || ""} ${data?.businessAddress?.streetName || ""} ${data?.businessAddress?.barangayName || ""} ${data?.businessAddress?.city || ""} ${data?.businessAddress?.province || ""}`,
      delivery_address: `${data?.deliveryAddress?.houseNumber || ""} ${data?.deliveryAddress?.streetName || ""} ${data?.deliveryAddress?.barangayName || ""} ${data?.deliveryAddress?.city || ""} ${data?.deliveryAddress?.province || ""}`,
      tin: data?.tinNumber,
      reg_discount: data?.fixedDiscount ? `${data?.fixedDiscount}%` : "",
      sp_discount: data?.sp ? `${data?.fixedDiscount}%` : "",
    };
    Object.entries(mappedData).forEach(([key, value]) => setValue(key, value));
  };

  return (
    <Stack
      gap={2}
      display="grid"
      gridTemplateColumns="repeat(3, minmax(250px, 1fr))"
      rowGap={1.5}
      columnGap={2}
      sx={{
        borderRadius: 2,
      }}
    >
      <AppTextBox
        disabled={approveOrdering || viewOrdering || serveOrdering}
        control={control}
        name="order_no"
        label="Order No."
        error={Boolean(errors?.order_no)}
        helperText={errors?.order_no?.message}
      />
      <Autocomplete
        disabled={approveOrdering || viewOrdering || serveOrdering}
        control={control}
        name={"charging"}
        options={
          approveOrdering || viewOrdering ? chargingData : chargingUser || []
        }
        getOptionLabel={(option) => {
          const optName =
            approveOrdering || viewOrdering || serveOrdering
              ? option?.name
              : option?.charging_name;
          const optCode =
            approveOrdering || viewOrdering || serveOrdering
              ? option?.code
              : option?.charging_code;

          return `${optCode} - ${optName}`;
        }}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        onClose={() => {
          getCharging({
            status: "active",
            search: watch("charging")?.charging_name,
          });
          getTdo({
            isActive: "true",
            distributionTypeId: watch("tdo")?.distributionTypeId,
          });
          getCustomerArcana({
            isActive: true,
            PageSize: 100,
            DistriTypeId: watch("tdo")?.distributionTypeId,
            TDOId: watch("tdo")?.id,
          });
        }}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label="Charging"
            size="small"
            variant="outlined"
            error={Boolean(errors.charging)}
            helperText={errors.charging?.message}
          />
        )}
      />

      <Autocomplete
        disabled={
          approveOrdering ||
          viewOrdering ||
          serveOrdering ||
          watch("charging") === null
        }
        loading={tdoFetch}
        control={control}
        name={"tdo"}
        options={tdoData || []}
        getOptionLabel={(option) => option?.fullname}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        onKeyUp={(e) => {
          handleSearchArcana(e?.target?.value);
        }}
        onClose={() => {
          setValue("type", {
            id: watch("tdo")?.distributionTypeId,
            name: watch("tdo")?.distributionType,
          });

          setValue("customer", null);
          [
            "branch_name",
            "tin",
            "reg_discount",
            "sp_discount",
            "po_number",
          ].forEach((field) => setValue(field, ""));

          getCustomerArcana({
            isActive: true,
            PageSize: 100,
            DistriTypeId: watch("tdo")?.distributionTypeId,
            TDOId: watch("tdo")?.id,
          });
        }}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label="Officer"
            size="small"
            variant="outlined"
            error={Boolean(errors.charging)}
            helperText={errors.charging?.message}
          />
        )}
      />
      <Autocomplete
        disabled={
          approveOrdering ||
          viewOrdering ||
          serveOrdering ||
          watch("charging") === null ||
          watch("tdo") === null
        }
        loading={fetchArcanaCustomer}
        control={control}
        name={"customer"}
        options={
          customerData?.filter((cust) => cust?.tdoId === watch("tdo")?.id) || []
        }
        getOptionDisabled={(option) => {
          if (!option) return "";
          let statusText = false;

          const isCOD = option?.creditType === null;

          const {
            creditType,
            remainingCredits: c,
            remainingDays: d,
          } = option || {};

          if (isCOD) {
            statusText = false;
          } else if (creditType === "Credit - Days") {
            statusText = d <= 0 ? true : false;
          } else if (
            creditType === "Regular Credit" ||
            creditType === "Credit - Amount"
          ) {
            const limitReached =
              c <= 0 || (creditType === "Regular Credit" && d <= 0);
            statusText = limitReached ? true : false;
          }

          return statusText;
        }}
        getOptionLabel={(option) => {
          if (!option) return "";

          const isCOD = option?.creditType === null;

          const {
            creditType,
            remainingCredits: c,
            remainingDays: d,
          } = option || {};
          let statusText = "";

          if (isCOD) {
            statusText = "COD";
          } else if (creditType === "Credit - Days") {
            statusText = d <= 0 ? "Limit Reached" : `${d} day(s) left`;
          } else if (
            creditType === "Regular Credit" ||
            creditType === "Credit - Amount"
          ) {
            const limitReached =
              c <= 0 || (creditType === "Regular Credit" && d <= 0);
            statusText = limitReached
              ? "Limit Reached"
              : `₱${c?.toLocaleString()}`;
          }

          return statusText
            ? `${option?.branchName} - ${statusText}`
            : option?.branchName;
        }}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        onKeyUp={(e) => {
          handleSearchArcanaCustomer(e?.target?.value);
        }}
        onClose={async () => {
          dispatch(setProductData([]));
          autoFillFields(watch("customer"));

          getProduct({
            isActive: true,
            PageSize: 100,
            PriceModeId: watch("customer")?.priceModeId,
          });
        }}
        renderInput={(params) => (
          <MuiTextField
            {...params}
            label="Branch Name"
            size="small"
            variant="outlined"
            error={Boolean(errors.charging)}
            helperText={errors.charging?.message}
          />
        )}
      />
      <Controller
        disabled={approveOrdering || viewOrdering || serveOrdering}
        control={control}
        name="date_needed"
        render={({ field }) => (
          <MobileDatePicker
            disabled={approveOrdering || viewOrdering || serveOrdering}
            disableHighlightToday
            open={openPicker}
            onOpen={() => setOpenPicker(true)}
            onClose={() => setOpenPicker(false)}
            minDate={dayjs().add(5, "day")}
            maxDate={dayjs().add(1, "year")}
            label="Date Needed"
            value={field.value}
            onChange={(newValue) => {
              field.onChange(newValue);
            }}
            slotProps={{
              textField: {
                size: "small",
                InputProps: {
                  style: {
                    fontSize: "12px",
                    paddingTop: "3px",
                    paddingBottom: "3px",

                    borderRadius: "6px",
                  },
                },
                onClick: () =>
                  !approveOrdering && !viewOrdering && setOpenPicker(true),
                error: Boolean(errors?.date_needed),
                helperText: errors?.date_needed?.message,
              },
            }}
          />
        )}
      />
      <AppTextBox
        disabled={true}
        control={control}
        name="branch_name"
        label="Business Name"
        error={Boolean(errors?.branch_name)}
        helperText={errors?.branch_name?.message}
      />

      <AppTextBox
        disabled={true}
        control={control}
        name="tin"
        label="Tin No."
        error={Boolean(errors?.tin)}
        helperText={errors?.tin?.message}
      />
      <AppTextBox
        disabled={true}
        control={control}
        name="reg_discount"
        label="Reg. discount"
        error={Boolean(errors?.reg_discount)}
        helperText={errors?.reg_discount?.message}
      />
      <AppTextBox
        disabled={true}
        control={control}
        name="sp_discount"
        label="Sp. Discount"
        error={Boolean(errors?.sp_discount)}
        helperText={errors?.sp_discount?.message}
      />
      <AppTextBox
        disabled={approveOrdering || viewOrdering || serveOrdering}
        control={control}
        name="po_number"
        label="PO No."
        error={Boolean(errors?.po_number)}
        helperText={errors?.po_number?.message}
      />
      <AppTextBox
        disabled={true}
        control={control}
        name="customer_address"
        label="Customer Address"
        multiline
        error={Boolean(errors?.customer_address)}
        helperText={errors?.customer_address?.message}
        sx={{ gridColumn: "1 / -1" }}
      />
      <AppTextBox
        disabled={true}
        control={control}
        name="delivery_address"
        label="Delivery Address"
        error={Boolean(errors?.delivery_address)}
        helperText={errors?.delivery_address?.message}
        sx={{ gridColumn: "1 / -1" }}
      />
    </Stack>
  );
};
