import { Button, Dialog, Paper, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "../../services/server/api/authAPI";
import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setChangePass,
  setToken,
  setUserData,
} from "../../services/server/slice/authSlice";
import { loginUser } from "../../services/functions/loginServices";

import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import loginSchema from "../../components/schema/loginSchema";
import AppTextBox from "../../components/custom/AppTextBox";
import React from "react";
import logo from "../../assets/logoDISTRI.png";

import "../../components/styles/Login.scss";
import ChangePassword from "../../components/modal/ChangePassword";

const Login = () => {
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const {
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const submitHandler = async (submitData) => {
    try {
      const res = await login(submitData).unwrap();
      dispatch(setToken(res?.result?.token));
      dispatch(setUserData(res?.result));
      if (res?.result?.username === submitData?.password) {
        dispatch(setChangePass(true));
      } else {
        loginUser(res?.result);
        navigate("/");
      }
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  return (
    <Paper className="login-paper-container">
      <Stack display="flex" alignItems="center" className="login-left-stack">
        <img src={logo} className="login-logo" />
        <Stack display={"flex"} flexDirection={"row"} gap={0.5}>
          <Typography className="system-title">Genus</Typography>
          <Typography className="system-sub-title">DISTRI</Typography>
        </Stack>
      </Stack>
      <Stack display="flex" alignItems="center" className="login-right-stack">
        <Typography color="text.primary" fontWeight={700} fontSize={14}>
          Sign In
        </Typography>
        <Typography color="text.primary">Please login to continue</Typography>
        <form className="login-form" onSubmit={handleSubmit(submitHandler)}>
          <Stack gap={1} display="flex" alignItems="center">
            <AppTextBox
              control={control}
              name="username"
              label="Username"
              icon={<AccountCircle />}
              error={Boolean(errors?.username)}
              helperText={errors?.username?.message}
            />
            <AppTextBox
              secure={watch("password") !== ""}
              type="password"
              control={control}
              name="password"
              label="Password"
              icon={<LockIcon />}
              error={Boolean(errors?.password)}
              helperText={errors?.password?.message}
              onKeyUp={(e) => {
                if (e.key === "Enter") handleSubmit(submitHandler)();
              }}
            />
            <Button
              type="submit"
              loading={isLoading}
              loadingPosition="start"
              startIcon={<VpnKeyOutlinedIcon />}
              variant="contained"
              size="small"
              color="secondary"
            >
              Login
            </Button>

            <Button
              onClick={() =>
                (window.location.href = "https://genus-aio.rdfmis.ph/")
              }
              loadingPosition="start"
              startIcon={<LogoutOutlinedIcon />}
              variant="text"
              size="small"
              color="text.default"
            >
              Back to portal
            </Button>
          </Stack>
        </form>
      </Stack>
      <ChangePassword />
    </Paper>
  );
};

export default Login;
