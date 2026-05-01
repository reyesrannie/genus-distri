import { Skeleton, Stack } from "@mui/material";
import React from "react";

const MobileLoading = () => {
  return [...Array(5)].map((_, index) => (
    <Stack flexDirection={"row"} gap={1} key={index}>
      <Stack>
        <Skeleton variant="circular" width={40} height={40} />
      </Stack>
      <Stack gap={1} width={"100%"}>
        <Skeleton variant="rectangular" height={10} />
        <Skeleton variant="rectangular" height={10} />
        <Skeleton variant="rectangular" height={10} />
      </Stack>
    </Stack>
  ));
};

export default MobileLoading;
