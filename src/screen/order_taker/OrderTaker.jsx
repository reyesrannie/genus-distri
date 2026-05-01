import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import TableGrid from "../../components/custom/TableGrid";
import BreadCrumbs from "../../components/custom/BreadCrumbs";
import GetAppIcon from "@mui/icons-material/GetApp";

import "../../components/styles/MasterList.scss";
import AppSearch from "../../components/custom/AppSearch";
import OrderStatusChanger from "../../components/custom/OrderStatusChanger";
import {
  setOrdering,
  setPrintableModal,
  setServeOrdering,
  setViewOrdering,
} from "../../services/server/slice/modalSlice";
import OrderingModal from "../../components/modal/OrderingModal";
import CustomPagination from "../../components/custom/CustomPagination";
import {
  useLazyOrderTakerQuery,
  useOrderTakerQuery,
} from "../../services/server/api/orderTakerAPI";
import useParamsHookOrderTaker from "../../services/hooks/useParamsHookOrderTaker";
import TransactionPrint from "../../components/custom/TransactionPrint";
import { exportExcel } from "../../services/functions/reusableFunctions";
import { exportHeader } from "../../services/constant/systemConstants";
import { enqueueSnackbar } from "notistack";
import AppDateFilter from "../../components/custom/AppDateFilter";

const OrderTaker = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);

  const filter = useSelector((state) => state.prompt.filter);

  const {
    params,
    onStatusChange,
    onPageChange,
    onSelectPage,
    onRowChange,
    onSearchData,
    onFilterChange,
    onReset,
  } = useParamsHookOrderTaker();

  const { data, isLoading, isFetching, isError, isSuccess } =
    useOrderTakerQuery(params);

  const [getOrder, { isLoading: loadingExport }] = useLazyOrderTakerQuery();

  const header = [
    { value: "today", label: "Today" },
    { value: "pending", label: "Pending" },
    { value: "history", label: "History" },
  ];

  const tableHeader = [
    {
      name: "Mir",
      value: "id",
    },
    {
      name: "Requestor",
      value: "requestor",
      child: "name",
      type: "parent",
    },
    {
      name: "Customer",
      value: "customer",
      child: "name",
      type: "parent",
    },
    {
      name: "Charge to",
      value: "charging",
      child: "name",
      type: "parent",
    },
    {
      name: "Status",
      type: "status",
      value: "status",
    },
    {
      name: "Date needed",
      value: "date_needed",
      type: "date",
    },
    {
      name: "Date modified",
      value: "updated_at",
      type: "date",
    },
  ];

  const handleExport = async () => {
    try {
      const res = await getOrder({
        status: params?.status,
        pagination: "none",
        ...(filter ?? { search: "" }),
      }).unwrap();

      await exportExcel(
        res?.result,
        exportHeader,
        header?.find((h) => params?.status === h?.value)?.label
      );
    } catch (error) {
      enqueueSnackbar("Something went wrong while exporting data", {
        variant: "error",
      });
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      mx={2}
      my={2}
      px={1}
      py={1}
      borderRadius={3}
    >
      <BreadCrumbs />

      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={2}
      >
        <Typography
          color="text.primary"
          sx={{
            fontSize: "20px",
            fontWeight: "700",
          }}
        >
          Order Taker
        </Typography>
      </Stack>

      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        marginBottom={2}
      >
        <OrderStatusChanger
          params={params}
          onStatusChange={onStatusChange}
          header={header}
        />
        <Stack flexDirection={"row"} gap={1}>
          <AppDateFilter
            onSearch={onSearchData}
            resetFilter={onReset}
            onFilterChange={onFilterChange}
          />
          <AppSearch onSearch={onSearchData} />
        </Stack>
      </Stack>

      {isFetching ? (
        <MobileLoading />
      ) : isError ? (
        <NoDataFound />
      ) : (
        <TableGrid
          header={tableHeader}
          items={data?.result}
          onSelect={(e, i) => {
            dispatch(setOrdering(i));
            dispatch(setServeOrdering(true));
            dispatch(setPrintableModal(true));
          }}
        />
      )}
      {isSuccess && (
        <Stack alignItems={"flex-start"} pt={1}>
          <Button
            loading={loadingExport}
            onClick={() => handleExport()}
            variant="contained"
            startIcon={<GetAppIcon />}
            color="success"
          >
            Export
          </Button>
        </Stack>
      )}
      {isSuccess && (
        <CustomPagination
          data={data?.result}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}

      <TransactionPrint />
    </Box>
  );
};

export default OrderTaker;
