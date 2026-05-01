import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  TextField as MuiTextField,
  Stack,
} from "@mui/material";
import React, { useEffect } from "react";
import { set, useForm } from "react-hook-form";
import * as Yup from "yup";

import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import AppTextBox from "./AppTextBox";
import { useSelector } from "react-redux";

const EnterRemarks = ({ submitData, open, setOpen, currentValue }) => {
  const createOrdering = useSelector((state) => state.modal.createOrdering);
  const updateOrdering = useSelector((state) => state.modal.updateOrdering);
  const orders = useSelector((state) => state.modal.orders);

  const schema = Yup.object({
    remarks: Yup.string().required("This is required"),
  }).required();

  const {
    control,
    watch,
    reset,
    setValue: setRemarksValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      remarks: "",
    },
  });

  const handleSetValue = () => {
    const data = watch("remarks");
    submitData(data);
    setOpen(false);
    reset();
  };

  useEffect(() => {
    if (orders?.remarks !== "" && open) {
      setRemarksValue("remarks", orders?.remarks || null);
    }
    if (currentValue !== "") {
      setRemarksValue("remarks", currentValue || null);
    }
  }, [open, orders, currentValue]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        reset();
        setOpen(false);
      }}
    >
      <DialogContent sx={{ width: "500px", minHeight: "200px" }}>
        <AppTextBox
          disabled={!createOrdering && !updateOrdering}
          control={control}
          name={"remarks"}
          label={"Remarks"}
          sx={{
            "& .MuiInputBase-root": {
              minHeight: "auto",
            },
          }}
          multiline
        />
      </DialogContent>
      <DialogActions>
        <Stack
          display="flex"
          flexDirection="row"
          gap={1}
          alignSelf={"flex-end"}
        >
          <Button
            disabled={
              watch("remarks") === null || (!createOrdering && !updateOrdering)
            }
            className="change-password-button"
            loadingPosition="start"
            startIcon={<SwapHorizontalCircleOutlinedIcon />}
            variant="contained"
            size="small"
            color="success"
            onClick={() => {
              handleSetValue();
            }}
          >
            Submit
          </Button>
          <Button
            className="change-password-button"
            onClick={() => {
              setOpen(false);
              reset();
            }}
            loadingPosition="start"
            startIcon={<DoDisturbAltOutlinedIcon />}
            variant="contained"
            size="small"
            color="error"
          >
            Cancel
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default EnterRemarks;
