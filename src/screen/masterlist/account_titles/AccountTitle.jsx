import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

import useParamsHook from "../../../services/hooks/useParamsHook";
import StatusFilter from "../../../components/custom/StatusFilter";
import AppSearch from "../../../components/custom/AppSearch";
import TableGrid from "../../../components/custom/TableGrid";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import CustomPagination from "../../../components/custom/CustomPagination";
import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";

import { useDispatch, useSelector } from "react-redux";
import {
  setAccountTitle,
  setAccountTitleModal,
} from "../../../services/server/slice/modalSlice";

import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import {
  useAccountTitleQuery,
  useArchiveAccountTitleMutation,
  useImportAccountTitleMutation,
} from "../../../services/server/api/accountTitleAPI";
import { useLazyOneTitleSyncQuery } from "../../../services/server/request/oneChargingAPI";

const AccountTitle = () => {
  const dispatch = useDispatch();

  const {
    params,
    onStatusChange,
    onPageChange,
    onSearchData,
    onRowChange,
    onSelectPage,
  } = useParamsHook();
  const { data, isFetching, isError, isSuccess } = useAccountTitleQuery(params);
  const { enqueueSnackbar } = useSnackbar();

  const [importAccountTitle, { isLoading: loadingSync }] =
    useImportAccountTitleMutation();

  const [getOneTitle, { isLoading: fetchingSync }] = useLazyOneTitleSyncQuery();

  const isLaptop = useMediaQuery("(min-width:1024px)");

  const header = [
    {
      name: "Id",
      value: "id",
    },
    {
      name: "Code",
      value: "code",
    },
    {
      name: "Name",
      value: "name",
    },
    { name: "Date Modified", value: "updated_at", type: "date" },
  ];

  const handleSyncOneCharging = async () => {
    try {
      const one = await getOneTitle().unwrap();
      const transformedArray = (one?.data || []).map(
        ({ id, created_at, deleted_at, updated_at, ...rest }) => ({
          sync_id: id,

          ...rest,
        }),
      );
      const res = await importAccountTitle(transformedArray).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box sx={{ marginLeft: 2 }}>
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
            Account Title
          </Typography>
          {params?.status === "active" && (
            <Button
              loading={fetchingSync || loadingSync}
              sx={{ textTransform: "capitalize" }}
              size="small"
              color="info"
              variant="contained"
              startIcon={<CloudSyncOutlinedIcon />}
              onClick={() => {
                handleSyncOneCharging();
              }}
            >
              Sync
            </Button>
          )}
        </Stack>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <StatusFilter params={params} onStatusChange={onStatusChange} />
          <AppSearch onSearch={onSearchData} />
        </Stack>

        {isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : (
          <TableGrid header={header} items={data?.result} />
        )}
      </Stack>
      {isSuccess && (
        <CustomPagination
          data={data?.result}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}
    </Box>
  );
};

export default AccountTitle;
