import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setImportData,
  setImportError,
  setIsLoading,
} from "../../services/server/slice/modalSlice";
import image from "../../assets/svg/import.svg";
import fileError from "../../assets/svg/file-error.svg";
import excel from "../../assets/svg/excel.svg";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import { useSnackbar } from "notistack";
import { readExcelFile } from "../../services/functions/reusableFunctions";

const ImportModal = ({ title, importDataHandler, loading }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [fileName, setFileName] = useState("");
  const open = useSelector((state) => state.modal.import);
  const isLoading = useSelector((state) => state.modal.isLoading);
  const importData = useSelector((state) => state.modal.importData);
  const importError = useSelector((state) => state.modal.importError);

  const fileInputRef = useRef(null);

  const readFile = async (e) => {
    setFileName(null);
    dispatch(setImportError(false));
    dispatch(setImportData(null));
    const filesArray = Array.from(e.target.files);
    setFileName(filesArray[0]?.name);
    try {
      dispatch(setIsLoading(true));
      const read = await readExcelFile(filesArray);
      dispatch(setImportData(read));
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportError(true));
    }
    dispatch(setIsLoading(false));
  };

  const readFileDrop = async (e) => {
    e.preventDefault();
    setFileName(null);
    dispatch(setImportError(false));
    dispatch(setImportData(null));
    const filesArray = e?.dataTransfer?.files;
    setFileName(filesArray[0]?.name);
    try {
      dispatch(setIsLoading(true));
      const read = await readExcelFile(filesArray);
      dispatch(setImportData(read));
    } catch (error) {
      enqueueSnackbar("This file is not supported", { variant: "error" });
      dispatch(setImportError(true));
    }
    dispatch(setIsLoading(false));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        dispatch(resetModal());
      }}
    >
      <DialogTitle>
        <Typography fontWeight={700}>Import</Typography>
        <Typography fontSize={14}>
          Upload a CSV to import {title?.toLowerCase()} data to database
        </Typography>
      </DialogTitle>
      <DialogContent
        onClick={() => fileInputRef?.current?.click()}
        onDragOver={handleDragOver}
        onDrop={readFileDrop}
      >
        <Box
          sx={{
            height: "200px",
            border: "2px dashed #E0E0E0",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={importError ? fileError : importData ? excel : image}
            alt="import"
            className="import-list"
            draggable="false"
          />
          {importError ? (
            <Typography fontSize={12}>File Not Supported</Typography>
          ) : importData ? (
            <Typography fontSize={12}>
              Click import to upload {fileName}
            </Typography>
          ) : (
            <>
              <Typography fontSize={12}>Drag & Drop</Typography>
              <Typography fontSize={12}>or Browse</Typography>
              <Typography fontSize={12}>only supports .xlsx</Typography>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={readFile}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Stack flexDirection={"row"} gap={1}>
          <Button
            variant="contained"
            color="error"
            startIcon={<ClearOutlinedIcon />}
            onClick={() => {
              dispatch(resetModal());
            }}
          >
            Close
          </Button>
          <Button
            disabled={!importData || importError}
            loading={isLoading || loading}
            variant="contained"
            loadingPosition="start"
            startIcon={<ImportExportOutlinedIcon />}
            color="success"
            onClick={() => importDataHandler()}
          >
            Import
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ImportModal;
