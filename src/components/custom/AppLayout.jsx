import React, { useState } from "react";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { AppProvider } from "@toolpad/core/AppProvider";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  ButtonBase,
  Dialog,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  systemName,
  systemVariant,
} from "../../services/constant/systemConstants";
import SystemNavigation from "../../services/constant/SystemNavigation";
import logo from "../../assets/logoDISTRI.png";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import PowerSettingsNewOutlinedIcon from "@mui/icons-material/PowerSettingsNewOutlined";
import KeyboardDoubleArrowUpOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowUpOutlined";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";

import ChangePassword from "../modal/ChangePassword";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../services/server/api/authAPI";
import { resetTheme, setMode } from "../../services/server/slice/themeSlice";
import {
  resetAuth,
  setChangePass,
} from "../../services/server/slice/authSlice";
import {
  resetDrawer,
  setIsButtomNavActivate,
} from "../../services/server/slice/drawerSlice";
import MobileNavigation from "./MobileNavigation";

import "../styles/AppBar.scss";
import { filterNavigationByAccess } from "../../services/constant/checkValue";
import { decodeUser } from "../../services/functions/saveUser";

const BASE_URL = "/etd"; // Define the base URL

const AppLayout = ({ child }) => {
  const { navigation } = SystemNavigation();
  const userData = decodeUser();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const hiddenNavigation = useSelector(
    (state) => state.drawer.hiddenNavigation,
  );
  const isButtomNavActivate = useSelector(
    (state) => state.drawer.isButtomNavActivate,
  );
  const changePass = useSelector((state) => state.auth.changePass);
  const mode = useSelector((state) => state.theme.mode);

  const fileredNavigation = filterNavigationByAccess(
    navigation,
    userData?.role?.access_permission,
  );

  const [logout, { isLoading }] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      const res = await logout().unwrap();
    } catch (error) {}
    sessionStorage.clear("genusDISTRI");
    dispatch(resetAuth());
    dispatch(resetDrawer());
    dispatch(resetTheme());
    window.location.reload();
  };

  const searchParams = new URLSearchParams(location.search);
  const routerContext = {
    pathname: `${location.pathname}`,
    navigate,
    searchParams,
  };

  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isTablet = useMediaQuery("(min-width:768)");

  const AppTitle = () => {
    return (
      <Stack display={"flex"} alignItems="center" flexDirection={"row"} gap={1}>
        <img src={logo} className="app-bar-logo" />
        <Stack display={"flex"} alignItems="center" flexDirection={"row"}>
          <Typography className="app-bar-system-title">{systemName}</Typography>
          <Typography className="app-bar-system-sub-title">
            {systemVariant}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const AppSettings = () => {
    const [anchorEl, setAnchorEl] = useState(null);

    return (
      <React.Fragment>
        <ButtonBase onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Stack flexDirection="row" gap={1} alignItems={"center"}>
            <Stack>
              <AccountCircleOutlinedIcon sx={{ color: "gray" }} />
            </Stack>
            <Stack alignItems={"flex-start"}>
              <Typography
                sx={{ textTransform: "capitalize", fontSize: "11px" }}
              >
                {userData?.username?.toLowerCase()}
              </Typography>
              <Typography
                color="success"
                sx={{
                  textTransform: "capitalize",
                  fontWeight: "700",
                  fontSize: "11px",
                }}
              >
                {userData?.role?.name}
              </Typography>
            </Stack>
          </Stack>
        </ButtonBase>

        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={(e) => setAnchorEl(null)}
        >
          <MenuItem
            onClick={() =>
              dispatch(setMode(mode === "light" ? "dark" : "light"))
            }
            disabled={isLoading}
          >
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText>
              {mode === "light" ? "Dark Mode" : "Light Mode"}
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => dispatch(setChangePass(true))}
            disabled={isLoading}
          >
            <ListItemIcon>
              <VpnKeyOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Change Password</ListItemText>
          </MenuItem>
          <MenuItem onClick={logoutHandler} disabled={isLoading}>
            <ListItemIcon>
              <PowerSettingsNewOutlinedIcon />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Menu>
      </React.Fragment>
    );
  };

  return (
    <AppProvider
      navigation={fileredNavigation}
      router={routerContext}
      branding={{
        logo: <img src={logo} alt="Logo" className="app-bar-logo" />,
      }}
      theme={theme}
    >
      <DashboardLayout
        slots={{
          appTitle: AppTitle,
          toolbarActions: AppSettings,
        }}
        sidebarExpandedWidth={190}
        hideNavigation={!isLaptop}
      >
        <Outlet />

        {!isLaptop && (
          <Box
            position="fixed"
            bottom={0}
            width="100%"
            flexDirection={"column"}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            {hiddenNavigation && (
              <IconButton
                onClick={() =>
                  dispatch(setIsButtomNavActivate(!isButtomNavActivate))
                }
              >
                {isButtomNavActivate ? (
                  <KeyboardDoubleArrowDownOutlinedIcon />
                ) : (
                  <KeyboardDoubleArrowUpOutlinedIcon />
                )}
              </IconButton>
            )}
            <MobileNavigation />
          </Box>
        )}

        <Dialog open={changePass}>
          <ChangePassword />
        </Dialog>
      </DashboardLayout>
    </AppProvider>
  );
};

export default AppLayout;
