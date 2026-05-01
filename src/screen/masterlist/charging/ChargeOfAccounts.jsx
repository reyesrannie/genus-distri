import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";

import { useUsersQuery } from "../../../services/server/api/usersAPI";
import useParamsHook from "../../../services/hooks/useParamsHook";

import CloudSyncOutlinedIcon from "@mui/icons-material/CloudSyncOutlined";
import StatusFilter from "../../../components/custom/StatusFilter";
import AppSearch from "../../../components/custom/AppSearch";
import TableGrid from "../../../components/custom/TableGrid";
import {
  useOneChargingQuery,
  useSyncChargingMutation,
} from "../../../services/server/api/oneChargingAPI";
import CustomPagination from "../../../components/custom/CustomPagination";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import { useLazyOneChargingSyncQuery } from "../../../services/server/request/oneChargingAPI";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";

const ChargeOfAccounts = () => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    params,
    onStatusChange,
    onSearchData,
    onPageChange,
    onSelectPage,
    onRowChange,
  } = useParamsHook();
  const { data, isFetching, isError, isSuccess } = useOneChargingQuery(params);

  const [getOneCharging, { isFetching: fetchingSync }] =
    useLazyOneChargingSyncQuery();
  const [syncCharging, { isLoading: loadingSync }] = useSyncChargingMutation();
  const header = [
    {
      name: "Code",
      value: "code",
    },
    {
      name: "Name",
      value: "name",
    },
    {
      name: "Company",
      value: "company_name",
    },
    {
      name: "Business Unit",
      value: "business_unit_name",
    },
    {
      name: "Department",
      value: "department_name",
    },
    {
      name: "Unit",
      value: "department_unit_name",
    },
    {
      name: "Sub unit",
      value: "sub_unit_name",
    },
    {
      name: "Location",
      value: "location_name",
    },
  ];

  const handleSyncOneCharging = async () => {
    try {
      const res = await syncCharging().unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const isLaptop = useMediaQuery("(min-width:1024px)");
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
            Charge of Accounts
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
      {/* {!isLaptop ? <UserAccordion /> : <UserTable />} */}
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

export default ChargeOfAccounts;
