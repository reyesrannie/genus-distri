import { Box } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const isDrawerOpen = useSelector((state) => state.drawer.isDrawerOpen);

  return (
    <Box
      display={"flex"}
      bgcolor={"background.paper"}
      mx={2}
      my={2}
      px={1}
      py={1}
      borderRadius={3}
    >
      Dashboard
    </Box>
  );
};

export default Dashboard;
