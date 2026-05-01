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
  setUom,
  setUomModal,
  setImport,
  setImportErrorMessage,
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

import { readExcelItems } from "../../../services/functions/reusableFunctions";
import ImportErrorModal from "../../../components/modal/ImportErrorModal";
import ImportModal from "../../../components/modal/ImportModal";
import MenuOptions from "../../../components/custom/MenuOptions";
import {
  useArchiveUomMutation,
  useImportUomMutation,
  useUomQuery,
} from "../../../services/server/api/uomAPI";
import UomModal from "../../../components/modal/UomModal";

const Uom = () => {
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
  const { data, isFetching, isError, isSuccess } = useUomQuery(params);
  const { enqueueSnackbar } = useSnackbar();

  const [archiveUom, { isLoading: loadingArchive }] = useArchiveUomMutation();

  const [importUom, { isLoading: loadingImport }] = useImportUomMutation();

  const isLaptop = useMediaQuery("(min-width:1024px)");
  const archive = useSelector((state) => state.prompt.archive);
  const uom = useSelector((state) => state.modal.uom);
  const importData = useSelector((state) => state.modal.importData);

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
      name: "Description",
      value: "description",
    },
    { name: "Date Modified", value: "updated_at", type: "date" },
  ];

  const importHeader = [
    { name: "code", value: "Code" },
    { name: "description", value: "Description" },
  ];

  const errorHeader = [
    {
      name: "Code",
      value: "code",
    },
    {
      name: "Description",
      value: "description",
    },
  ];

  const handleArchive = async () => {
    try {
      await archiveUom(uom).unwrap();
      enqueueSnackbar(
        `Uom has been ${params?.status === "active" ? "archived" : "restored"}`,
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
    try {
      const res = await importUom(mapped).unwrap();
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
            Uom
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
              dispatch(setUom(v));
              dispatch(setUomModal(true));
            }}
            onSelect={(e, i) => {
              dispatch(setUom(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
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
      <UomModal />

      <ImportModal
        title="Uom"
        importDataHandler={handleImport}
        loading={loadingImport}
      />

      <ImportErrorModal items={mapped} header={errorHeader} />

      <MenuOptions
        anchorEl={anchorE2}
        setAnchorEl={setAnchorE2}
        addOption={() => {
          dispatch(setUomModal(true));
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
          dispatch(setUomModal(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} uom?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this uom?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={handleArchive}
        isLoading={loadingArchive}
      />
    </Box>
  );
};

export default Uom;
