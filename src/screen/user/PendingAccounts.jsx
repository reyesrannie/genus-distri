import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

import { usePendingUsersQuery } from "../../services/server/api/usersAPI";

import AppSearch from "../../components/custom/AppSearch";
import TableGrid from "../../components/custom/TableGrid";
import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import CustomPagination from "../../components/custom/CustomPagination";

import { useDispatch, useSelector } from "react-redux";
import {
  setImport,
  setUser,
  setUserModal,
} from "../../services/server/slice/modalSlice";
import UserModal from "../../components/modal/UserModal";
import { useSnackbar } from "notistack";

import MenuPopper from "../../components/custom/MenuPopper";

import MenuOptions from "../../components/custom/MenuOptions";

import UserCard from "../../components/pages/accounts/UserCard";
import OrderStatusChanger from "../../components/custom/OrderStatusChanger";
import useParamsHookTransaction from "../../services/hooks/useParamsHookTransaction";

const PendingAccounts = () => {
  const isLaptop = useMediaQuery("(min-width:1024px)");

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);

  const {
    params,
    onStatusChange,
    onPageChange,
    onSearchData,
    onRowChange,
    onSelectPage,
  } = useParamsHookTransaction();
  const { data, isFetching, isError, isSuccess } = usePendingUsersQuery(params);

  const { enqueueSnackbar } = useSnackbar();

  const userData = useSelector((state) => state.modal.user);

  const header = [
    {
      name: "ID",
      value: "id",
    },
    {
      name: "Prefix",
      value: "id_prefix",
    },
    {
      name: "ID No.",
      value: "id_no",
    },
    {
      name: "Username",
      value: "username",
    },
    {
      name: "First Name",
      value: "first_name",
    },
    {
      name: "Middle Name",
      value: "middle_name",
    },
    {
      name: "Last Name",
      value: "last_name",
    },
    {
      name: "Suffix",
      value: "suffix",
    },
  ];

  const statusHeader = [{ value: "pending", label: "Pending" }];

  return (
    <Box sx={{ marginLeft: isLaptop ? 2 : 0 }}>
      <Stack gap={1}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            color="text.primary"
            sx={{
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            Pending Accounts
          </Typography>
        </Stack>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <OrderStatusChanger
            params={params}
            onStatusChange={onStatusChange}
            header={statusHeader}
          />
          <AppSearch onSearch={onSearchData} />
        </Stack>

        {isLaptop ? (
          isFetching ? (
            <MobileLoading />
          ) : isError ? (
            <NoDataFound />
          ) : (
            <TableGrid
              header={header}
              items={data?.result}
              onView={(v) => {
                dispatch(setUser(v));
                dispatch(setUserModal(true));
              }}
              onSelect={(e, i) => {
                dispatch(setUser({ ...i, status: "Pending" }));
                dispatch(setUserModal(true));
              }}
            />
          )
        ) : (
          <>
            <UserCard
              onSelect={(e, i) => {
                dispatch(setUser({ ...i, status: "Pending" }));
                setAnchorEl({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
              type={"user"}
            />
            {isFetching && <p>Loading more...</p>}
          </>
        )}
      </Stack>
      {isSuccess && isLaptop && (
        <CustomPagination
          data={data?.result}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}
      <UserModal />

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setUserModal(true));
          setAnchorE2(null);
        }}
        importOption={() => {
          dispatch(setImport(true));
          setAnchorE2(null);
        }}
      />
    </Box>
  );
};

export default PendingAccounts;
