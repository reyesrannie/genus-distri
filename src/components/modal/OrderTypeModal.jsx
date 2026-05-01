import React, { useEffect } from "react";

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
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "../styles/ChangePassword.scss";
import rolesImage from "../../assets/svg/roles.svg";
import AppTextBox from "../custom/AppTextBox";

import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";

import AppPrompt from "../custom/AppPrompt";
import warningImg from "../../assets/svg/warning.svg";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";
import defaultSchema from "../schema/defaultSchema";
import {
  useCreateOrderTypeMutation,
  useUpdateOrderTypeMutation,
} from "../../services/server/api/orderTypeAPI";
import uomSchema from "../schema/uomSchema";

const OrderTypeModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const orderTypeModal = useSelector((state) => state.modal.orderTypeModal);
  const orderType = useSelector((state) => state.modal.orderType);
  const warning = useSelector((state) => state.prompt.warning);

  const [createOrderType, { isLoading: loadingCreate }] =
    useCreateOrderTypeMutation();
  const [updateOrderType, { isLoading: loadingUpdate }] =
    useUpdateOrderTypeMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(uomSchema),
    defaultValues: {
      code: "",
      description: "",
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      code: submitData?.code,
      description: submitData?.description,
      id: orderType !== null ? orderType?.id : null,
    };

    try {
      const res =
        orderType === null
          ? await createOrderType(payload).unwrap()
          : await updateOrderType(payload).unwrap();

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (orderType !== null) {
      Object.entries(orderType).forEach(([key, value]) => setValue(key, value));
    } else {
      reset();
    }
  }, [orderType]);

  return (
    <Dialog
      open={orderTypeModal}
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
          alt="orderType"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Order Type</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={1.3}>
            <AppTextBox
              control={control}
              name="code"
              label="Code"
              error={Boolean(errors?.code)}
              helperText={errors?.code?.message}
            />
            <AppTextBox
              control={control}
              name="description"
              label="Name"
              error={Boolean(errors?.description)}
              helperText={errors?.description?.message}
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
              disabled={watch("code") === "" || watch("name") === ""}
              className="change-password-button"
              loading={loadingCreate || loadingUpdate}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              {orderType === null ? "Submit" : "Update"}
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

export default OrderTypeModal;
