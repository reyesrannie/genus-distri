import {
  Box,
  ButtonBase,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DoubleArrowOutlinedIcon from "@mui/icons-material/DoubleArrowOutlined";

import React from "react";

const AppCard = ({ onClick, title }) => {
  const isTablet = useMediaQuery("(min-width:800px)");

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        minWidth: isTablet ? "200px" : "100%",
        display: "block",
      }}
    >
      <Box bgcolor={"background.paper"} borderRadius={2}>
        <Stack
          padding={2}
          borderRadius={2}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack alignItems={"flex-start"} width={"80%"}>
            <Typography fontWeight={500} fontSize={"14px"}>
              {title}
            </Typography>
          </Stack>
          <Stack>
            <DoubleArrowOutlinedIcon sx={{ fontSize: "12px" }} />
          </Stack>
        </Stack>
      </Box>
    </ButtonBase>
  );
};

export default AppCard;
