import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  useArchiveUserMutation,
  useImportUserMutation,
  useUserResetMutation,
  useUsersQuery,
} from "../../services/server/api/usersAPI";
import useParamsHook from "../../services/hooks/useParamsHook";

import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import StatusFilter from "../../components/custom/StatusFilter";
import AppSearch from "../../components/custom/AppSearch";
import TableGrid from "../../components/custom/TableGrid";
import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import CustomPagination from "../../components/custom/CustomPagination";
import warning from "../../assets/svg/warning.svg";

import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setImport,
  setUser,
  setUserModal,
} from "../../services/server/slice/modalSlice";
import UserModal from "../../components/modal/UserModal";
import { useSnackbar } from "notistack";
import {
  resetPrompt,
  setArchive,
  setReset,
} from "../../services/server/slice/promptSlice";
import AppPrompt from "../../components/custom/AppPrompt";
import MenuPopper from "../../components/custom/MenuPopper";
import { useOneChargingQuery } from "../../services/server/api/oneChargingAPI";
import ImportErrorModal from "../../components/modal/ImportErrorModal";
import ImportModal from "../../components/modal/ImportModal";
import {
  groupByAccountWithScopeOrderArray,
  readExcelItems,
} from "../../services/functions/reusableFunctions";
import MenuOptions from "../../components/custom/MenuOptions";
import { mapPayloadUserImport } from "../../services/functions/dataMapping";

import UserCard from "../../components/pages/accounts/UserCard";

const UserAccounts = () => {
  const isLaptop = useMediaQuery("(min-width:1024px)");

  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const [allPosts, setAllPosts] = useState([]);

  const {
    params,
    onStatusChange,
    onPageChange,
    onSearchData,
    onRowChange,
    onSelectPage,
  } = useParamsHook(true);
  const { data, isFetching, isError, isSuccess } = useUsersQuery(params);

  const { data: charging } = useOneChargingQuery({
    status: "active",
    pagination: "none",
  });

  const { enqueueSnackbar } = useSnackbar();

  const [archiveUser, { isLoading: loadingArchive }] = useArchiveUserMutation();
  const [userReset, { isLoading: loadingUserReset }] = useUserResetMutation();
  const [importUser, { isLoading: loadingImport }] = useImportUserMutation();

  const archive = useSelector((state) => state.prompt.archive);
  const reset = useSelector((state) => state.prompt.reset);
  const userData = useSelector((state) => state.modal.user);
  const importData = useSelector((state) => state.modal.importData);

  const observer = useRef();

  const header = [
    {
      name: "Profile",
      primary: "id",
      secondary: "account_code",
      third: "account_name",
      fourth: "username",
      fifth: "charging_code",
      sixth: "charging_name",
      type: "stack",
    },
    {
      type: "stackNoStyle",
      name: "Charge of Account",
      primary: "company_name",
      secondary: "business_unit_name",
      third: "department_name",
      fourth: "department_unit_name",
      fifth: "sub_unit_name",
      sixth: "location_name",
    },
  ];

  const importHeader = [
    { name: "account_code", value: "User ID" },
    { name: "account_name", value: "Account Name" },
    { name: "username", value: "Username" },
    { name: "mobile_no", value: "Mobile No." },
    { name: "charging", value: "Charging Code" },
    { name: "scope_order", value: "Customer Code" },
    { name: "role_id", value: "Role Id" },
  ];

  const errorHeader = [
    { value: "account_code", name: "User ID" },
    { value: "account_name", name: "Account Name" },
    { value: "username", name: "Username" },
    { value: "mobile_no", name: "Mobile No." },
    { value: "charging", name: "Charging Code" },
    { value: "scope_order", name: "Customer Code" },
    { value: "role_id", name: "Role Id" },
  ];

  const handleImport = async () => {
    const mapped = readExcelItems(importData, importHeader);

    const payload = mapped.map((item) => ({
      ...mapPayloadUserImport(item, charging?.result),
    }));

    const items = groupByAccountWithScopeOrderArray(payload);

    try {
      await importUser(items).unwrap();
      dispatch(resetModal());
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
    } catch (error) {
      dispatch(setImportErrorMessage(error?.data?.errors));
      enqueueSnackbar("Something went wrong", {
        variant: "error",
      });
    }
  };

  const handleArchive = async () => {
    try {
      await archiveUser(userData).unwrap();
      enqueueSnackbar(
        `User has been ${params?.status === "active" ? "archived" : "restored"}`,
        { variant: "success" },
      );
      dispatch(resetPrompt());
      dispatch(resetModal());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const onResetHandler = async () => {
    try {
      const res = await userReset({ id: userData?.id }).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(resetPrompt());
      dispatch(resetModal());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const lastPostRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          params?.page !== data?.result?.last_page
        ) {
          onPageChange(null, params?.page);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetching],
  );

  const mapped = readExcelItems(importData, importHeader);

  useEffect(() => {
    if (data?.result?.data?.length) {
      setAllPosts((prevPosts) => [...prevPosts, ...data?.result?.data]);
    }
  }, [data]);

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
            User Accounts
          </Typography>
          {params?.status === "active" && (
            <Button
              sx={{ textTransform: "capitalize" }}
              color="info"
              variant="contained"
              size="small"
              startIcon={<LibraryAddOutlinedIcon />}
              onClick={(e) => {
                setAnchorE2({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
            >
              Add
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
                dispatch(setUser(i));
                setAnchorEl({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
            />
          )
        ) : (
          <>
            <UserCard
              onSelect={(e, i) => {
                dispatch(setUser(i));
                setAnchorEl({
                  mouseX: e.clientX,
                  mouseY: e.clientY,
                });
              }}
              ref={lastPostRef}
              items={allPosts}
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

      <ImportModal
        title="Users"
        importDataHandler={handleImport}
        loading={loadingImport}
      />

      <ImportErrorModal items={mapped} header={errorHeader} />

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

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
        add={() => {
          setAnchorEl(null);
          dispatch(setUserModal(true));
        }}
        {...(params.status === "active"
          ? {
              update: () => {
                setAnchorEl(null);
                dispatch(setUserModal(true));
              },
            }
          : {})}
        {...(params.status === "active"
          ? {
              reset: () => {
                setAnchorEl(null);
                dispatch(setReset(true));
              },
            }
          : {})}
      />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} account?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this account?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={handleArchive}
        isLoading={loadingArchive}
      />

      <AppPrompt
        open={reset}
        image={warning}
        title={`Reset password?`}
        message={`Are you sure you want to reset the password?`}
        confirmButton={`Yes, Reset it!`}
        cancelButton={` No, Keep it! `}
        confirmOnClick={onResetHandler}
        isLoading={loadingUserReset}
      />
    </Box>
  );
};

export default UserAccounts;
