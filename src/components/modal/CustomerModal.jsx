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
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../../services/server/api/customerAPI";

const CustomerModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const customerModal = useSelector((state) => state.modal.customerModal);
  const customer = useSelector((state) => state.modal.customer);
  const warning = useSelector((state) => state.prompt.warning);

  const [createCustomer, { isLoading: loadingCreate }] =
    useCreateCustomerMutation();
  const [updateCustomer, { isLoading: loadingUpdate }] =
    useUpdateCustomerMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(defaultSchema),
    defaultValues: {
      code: "",
      name: "",
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      code: submitData?.code,
      name: submitData?.name,
      id: customer !== null ? customer?.id : null,
    };

    try {
      const res =
        customer === null
          ? await createCustomer(payload).unwrap()
          : await updateCustomer(payload).unwrap();

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (customer !== null) {
      Object.entries(customer).forEach(([key, value]) => setValue(key, value));
    } else {
      reset();
    }
  }, [customer]);

  return (
    <Dialog
      open={customerModal}
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
          alt="customer"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Customer</Typography>
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
              name="name"
              label="Name"
              error={Boolean(errors?.name)}
              helperText={errors?.name?.message}
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
              {customer === null ? "Submit" : "Update"}
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

export default CustomerModal;
