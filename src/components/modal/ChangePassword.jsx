import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  resetAuth,
  setChangePass,
} from "../../services/server/slice/authSlice";
import { usePasswordChangeMutation } from "../../services/server/api/authAPI";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import changePasswordSchema from "../schema/changePasswordSchema";
import AppTextBox from "../custom/AppTextBox";
import password from "../../assets/svg/password.svg";
import "../styles/ChangePassword.scss";
import { useSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";
import { loginUser } from "../../services/functions/loginServices";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userData = useSelector((state) => state.auth.userData);
  const changePass = useSelector((state) => state.auth.changePass);

  const [passwordChange, { isLoading }] = usePasswordChangeMutation();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    defaultValues: {
      old_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const changePasswordHandler = async (submitData) => {
    const payload = {
      ...submitData,
      id: userData?.id,
    };

    try {
      const res = await passwordChange(payload).unwrap();
      loginUser(userData);
      enqueueSnackbar(res?.message, { variant: "success" });
      navigate("/");
      dispatch(setChangePass(false));
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Dialog open={changePass} onClose={() => dispatch(resetAuth())}>
      <form onSubmit={handleSubmit(changePasswordHandler)}>
        <DialogTitle
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={password}
            alt="Password"
            draggable="false"
            className="password-change-modal-image"
          />
          <Typography fontWeight="700"> Change Password</Typography>
        </DialogTitle>
        <DialogContent>
          <Stack gap={2} display="flex" alignItems="center" paddingTop={1}>
            <AppTextBox
              secure={watch("old_password") !== ""}
              type="password"
              control={control}
              name="old_password"
              label="Old Password"
              icon={<LockOutlinedIcon />}
              error={Boolean(errors?.old_password)}
              helperText={errors?.old_password?.message}
            />
            <AppTextBox
              secure={watch("password") !== ""}
              type="password"
              control={control}
              name="password"
              label="Password"
              icon={<LockOpenOutlinedIcon />}
              error={Boolean(errors?.password)}
              helperText={errors?.password?.message}
            />
            <AppTextBox
              secure={watch("password_confirmation") !== ""}
              type="password"
              control={control}
              name="password_confirmation"
              label="Confirm Password"
              icon={<VerifiedOutlinedIcon />}
              error={Boolean(errors?.password_confirmation)}
              helperText={errors?.password_confirmation?.message}
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
              disabled={
                watch("old_password") === "" ||
                watch("password") === "" ||
                watch("password_confirmation") === ""
              }
              className="change-password-button"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              Submit
            </Button>
            <Button
              className="change-password-button"
              disabled={isLoading}
              onClick={() => dispatch(setChangePass(false))}
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
    </Dialog>
  );
};

export default ChangePassword;
