import React, { useEffect, useRef, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";

import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "../styles/ChangePassword.scss";
import rolesImage from "../../assets/svg/roles.svg";
import AppTextBox from "../custom/AppTextBox";

import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";
import {
  useCreateCutOffMutation,
  useUpdateCutOffMutation,
} from "../../services/server/api/cutoffAPI";
import cutOffSchema from "../schema/cutOffSchema";

import AppPrompt from "../custom/AppPrompt";
import warningImg from "../../assets/svg/warning.svg";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

const CutOffModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [openPicker, setOpenPicker] = useState(false);

  const cutOffModal = useSelector((state) => state.modal.cutOffModal);
  const cutOff = useSelector((state) => state.modal.cutOff);
  const warning = useSelector((state) => state.prompt.warning);

  const [createCutOff, { isLoading: loadingCreate }] =
    useCreateCutOffMutation();
  const [updateCutOff, { isLoading: loadingUpdate }] =
    useUpdateCutOffMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(cutOffSchema),
    defaultValues: {
      name: "",
      time: null,
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      time: dayjs(submitData?.time).format("HH:mm:ss"),
      name: submitData?.name,
      id: cutOff !== null ? cutOff?.id : null,
    };

    try {
      const res =
        cutOff === null
          ? await createCutOff(payload).unwrap()
          : await updateCutOff(payload).unwrap();

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (cutOff !== null) {
      const newData = {
        name: cutOff?.name || "",
        time: cutOff?.time
          ? dayjs(`${dayjs().format("YYYY-MM-DD")}T${cutOff.time}`)
          : null,
      };

      Object.entries(newData).forEach(([key, value]) => setValue(key, value));
    } else {
      reset();
    }
  }, [cutOff]);

  return (
    <Dialog
      open={cutOffModal}
      onClose={() => {
        dispatch(setWarning(true));
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "350px",
          justifyContent: "center",
        }}
      >
        <Stack position={"absolute"} top={0} right={2}>
          <IconButton onClick={() => dispatch(setWarning(true))}>
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Stack>
        <img
          src={rolesImage}
          alt="cutoff"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Cutoff</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={1.3}>
            <AppTextBox
              control={control}
              name="name"
              label="Name"
              error={Boolean(errors?.name)}
              helperText={errors?.name?.message}
            />

            <Controller
              control={control}
              name="time"
              render={({ field }) => (
                <MobileTimePicker
                  open={openPicker}
                  onOpen={() => setOpenPicker(true)}
                  onClose={() => setOpenPicker(false)}
                  label="Time"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
                  slotProps={{
                    textField: {
                      onClick: () => setOpenPicker(true),
                      error: Boolean(errors?.time),
                      helperText: errors?.time?.message,
                    },
                  }}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack
            display="flex"
            flexDirection="row"
            gap={1}
            alignSelf={"flex-end"}
            padding={2}
          >
            <Button
              type="submit"
              disabled={watch("time") === "" || watch("name") === ""}
              className="change-password-button"
              loading={loadingCreate || loadingUpdate}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              {cutOff === null ? "Submit" : "Update"}
            </Button>
            <Button
              className="change-password-button"
              disabled={loadingCreate || loadingUpdate}
              onClick={() => {
                dispatch(setWarning(true));
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
      </form>

      <AppPrompt
        open={warning}
        image={warningImg}
        title={`Warning`}
        message={`All changes that have not been saved will be discarded upon closing.`}
        confirmButton={`Yes, Close it!`}
        cancelButton={`No, Keep it! `}
        confirmOnClick={() => {
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default CutOffModal;
