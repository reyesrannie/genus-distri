import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

import useParamsHook from "../../../services/hooks/useParamsHook";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import StatusFilter from "../../../components/custom/StatusFilter";
import AppSearch from "../../../components/custom/AppSearch";
import TableGrid from "../../../components/custom/TableGrid";
import MobileLoading from "../../../components/custom/MobileLoading";
import NoDataFound from "../../../components/custom/NoDataFound";
import CustomPagination from "../../../components/custom/CustomPagination";

import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setApprovalSetup,
  setApprovalSetupModal,
  setImport,
  setImportErrorMessage,
  setMultipleData,
  setMutipleView,
} from "../../../services/server/slice/modalSlice";

import MenuPopper from "../../../components/custom/MenuPopper";
import AppPrompt from "../../../components/custom/AppPrompt";
import {
  resetPrompt,
  setArchive,
} from "../../../services/server/slice/promptSlice";
import warning from "../../../assets/svg/warning.svg";
import { useSnackbar } from "notistack";
import { singleError } from "../../../services/functions/errorResponse";
import {
  useApprovalSetupQuery,
  useArchiveApprovalSetupMutation,
  useImportApprovalSetupMutation,
} from "../../../services/server/api/approvalSetupAPI";
import {
  groupByCharging,
  readExcelItems,
} from "../../../services/functions/reusableFunctions";
import { mapPayloadApproverImport } from "../../../services/functions/dataMapping";

import ImportErrorModal from "../../../components/modal/ImportErrorModal";
import ImportModal from "../../../components/modal/ImportModal";
import MenuOptions from "../../../components/custom/MenuOptions";
import ApprovalSetupModal from "../../../components/modal/ApprovalSetupModal";
import MultipleViewApprovalModal from "../../../components/modal/MultipleViewApprovalModal";
import { useOneChargingQuery } from "../../../services/server/api/oneChargingAPI";

const ApprovalSetup = () => {
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
  } = useParamsHook();
  const { data, isFetching, isError, isSuccess } =
    useApprovalSetupQuery(params);
  const { enqueueSnackbar } = useSnackbar();

  const { data: charging } = useOneChargingQuery({
    status: "active",
    pagination: "none",
  });

  const [archiveApprovalSetup, { isLoading: loadingArchive }] =
    useArchiveApprovalSetupMutation();

  const [importApprovalSetup, { isLoading: loadingImport }] =
    useImportApprovalSetupMutation();

  const isLaptop = useMediaQuery("(min-width:1024px)");
  const archive = useSelector((state) => state.prompt.archive);
  const approvalSetup = useSelector((state) => state.modal.approvalSetup);
  const importData = useSelector((state) => state.modal.importData);

  const header = [
    {
      name: "Id",
      value: "id",
    },
    {
      name: "Approver",

      type: "multiple",
    },
    {
      name: "Charging",
      value: "charging_name",
    },
    { name: "Date Modified", value: "updated_at", type: "date" },
  ];

  const importHeader = [
    { name: "approver_id", value: "Approver ID" },
    { name: "approver_name", value: "Approver Name" },
    { name: "charging_code", value: "Charging Code" },
    { name: "charging_name", value: "Charging Name" },
    { name: "company_code", value: "Company Code" },
    { name: "company_name", value: "Company Name" },
    { name: "business_code", value: "Business Code" },
    { name: "business_name", value: "Business Name" },
    { name: "department_code", value: "Department Code" },
    { name: "department_name", value: "Department Name" },
    { name: "unit_code", value: "Unit Code" },
    { name: "unit_name", value: "Unit Name" },
    { name: "subunit_code", value: "Subunit Code" },
    { name: "subunit_name", value: "Subunit Name" },
    { name: "location_code", value: "Location Code" },
    { name: "location_name", value: "Location Name" },
  ];

  const errorHeader = [
    { name: "Approver ID", value: "approver_id" },
    { name: "Approver Name", value: "approver_name" },
    { name: "Charging Code", value: "charging_code" },
    { name: "Charging Name", value: "charging_name" },
    { name: "Company Code", value: "company_code" },
    { name: "Company Name", value: "company_name" },
    { name: "Business Code", value: "business_code" },
    { name: "Business Name", value: "business_name" },
    { name: "Department Code", value: "department_code" },
    { name: "Department Name", value: "department_name" },
    { name: "Unit Code", value: "unit_code" },
    { name: "Unit Name", value: "unit_name" },
    { name: "Subunit Code", value: "subunit_code" },
    { name: "Subunit Name", value: "subunit_name" },
    { name: "Location Code", value: "location_code" },
    { name: "Location Name", value: "location_name" },
  ];

  const handleArchive = async () => {
    try {
      await archiveApprovalSetup(approvalSetup).unwrap();
      enqueueSnackbar(
        `Approver has been ${params?.status === "active" ? "archived" : "restored"}`,
        { variant: "success" },
      );
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleImport = async () => {
    const mapped = readExcelItems(importData, importHeader);

    const payload = mapped.map((item) => ({
      ...mapPayloadApproverImport(item, charging?.result),
    }));

    const items = groupByCharging(payload);

    try {
      const res = await importApprovalSetup(items).unwrap();
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

  const mapped = readExcelItems(importData, importHeader);

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
            Approval Setup
          </Typography>
          {params?.status === "active" && (
            <Button
              loading={loadingArchive}
              sx={{ textTransform: "capitalize" }}
              size="small"
              color="info"
              variant="contained"
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

        {isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : (
          <TableGrid
            header={header}
            items={data?.result}
            onView={(v) => {
              dispatch(setApprovalSetup(v));
              dispatch(setApprovalSetupModal(true));
            }}
            onSelect={(e, i) => {
              dispatch(setApprovalSetup(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
            multipleView={(v) => {
              dispatch(setMultipleData(v?.approver));
              dispatch(setMutipleView(true));
            }}
          />
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
      <ApprovalSetupModal />

      <MultipleViewApprovalModal />

      <ImportModal
        title="Approver"
        importDataHandler={handleImport}
        loading={loadingImport}
      />

      <ImportErrorModal items={mapped} header={errorHeader} />

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setApprovalSetupModal(true));
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
        update={() => {
          setAnchorEl(null);
          dispatch(setApprovalSetupModal(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} approver?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this approver?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={handleArchive}
        isLoading={loadingArchive}
      />
    </Box>
  );
};

export default ApprovalSetup;
