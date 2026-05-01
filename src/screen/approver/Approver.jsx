import { Box, Button, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";

import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import TableGrid from "../../components/custom/TableGrid";
import BreadCrumbs from "../../components/custom/BreadCrumbs";

import "../../components/styles/MasterList.scss";
import { useOrderQuery } from "../../services/server/api/orderingAPI";
import AppSearch from "../../components/custom/AppSearch";
import useParamsHookTransaction from "../../services/hooks/useParamsHookTransaction";
import OrderStatusChanger from "../../components/custom/OrderStatusChanger";
import {
  setApproveOrdering,
  setOrdering,
  setPrintableModal,
  setViewOrdering,
} from "../../services/server/slice/modalSlice";
import OrderingModal from "../../components/modal/OrderingModal";
import CustomPagination from "../../components/custom/CustomPagination";
import { useApproverQuery } from "../../services/server/api/approverAPI";
import TransactionPrint from "../../components/custom/TransactionPrint";

const Approver = () => {
  const dispatch = useDispatch();
  const {
    params,
    onStatusChange,
    onPageChange,
    onSelectPage,
    onRowChange,
    onSearchData,
  } = useParamsHookTransaction();

  const { data, isLoading, isFetching, isError, isSuccess } =
    useApproverQuery(params);

  const header = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "reject", label: "Reject" },
    { value: "return", label: "Returned" },
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
          Approver
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
        <AppSearch onSearch={onSearchData} />
      </Stack>

      {isFetching ? (
        <MobileLoading />
      ) : isError ? (
        <NoDataFound />
      ) : (
        <TableGrid
          header={tableHeader}
          items={data?.result}
          {...(params?.status === "pending"
            ? {
                onSelect: (e, i) => {
                  dispatch(setOrdering(i));
                  dispatch(setApproveOrdering(true));
                },
              }
            : {
                onSelect: (e, i) => {
                  dispatch(setOrdering(i));
                  dispatch(setPrintableModal(true));
                },
              })}
        />
      )}

      {isSuccess && (
        <CustomPagination
          data={data?.result}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}

      <OrderingModal />
      <TransactionPrint />
    </Box>
  );
};

export default Approver;
