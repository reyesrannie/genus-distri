import { Stack, Typography, useTheme } from "@mui/material";
import React from "react";
import noData from "../../assets/svg/no-data.svg";
import "../styles/NoDataFound.scss";

const NoDataFound = () => {
  const theme = useTheme();
  return (
    <Stack alignItems={"center"}>
      <img src={noData} className="no-data-svg-icon" />
      <Typography
        variant="h5"
        fontWeight={"bold"}
        color={theme.palette.text.secondary}
      >
        Data not found
      </Typography>
    </Stack>
  );
};

export default NoDataFound;
