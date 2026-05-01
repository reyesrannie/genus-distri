import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import BreadCrumbs from "../../components/custom/BreadCrumbs";
import "../../components/styles/MasterList.scss";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import AppCard from "../../components/custom/AppCard";
import SystemNavigation from "../../services/constant/SystemNavigation";

const MasterList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { navigation } = SystemNavigation();
  const currentRoute = navigation?.find(
    (item) => item?.route === "/masterlist"
  );

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      mx={2}
      my={2}
      px={1}
      py={1}
      borderRadius={3}
    >
      <BreadCrumbs />
      {location?.pathname === "/masterlist" && (
        <Stack ml={2}>
          <Typography
            color="text.primary"
            className="master-list-title-typography"
          >
            Masterlist
          </Typography>
        </Stack>
      )}
      <Outlet />
      <Stack flexDirection={"row"} gap={2} flexWrap={"wrap"}>
        {location?.pathname === "/masterlist" &&
          currentRoute?.children?.map((item, index) => {
            return (
              <AppCard
                title={item?.title}
                key={index}
                onClick={() => navigate(item?.route)}
              />
            );
          })}
      </Stack>
    </Box>
  );
};

export default MasterList;
