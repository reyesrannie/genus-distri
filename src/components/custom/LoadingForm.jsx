import { DialogActions, DialogContent, Skeleton, Stack } from "@mui/material";
import React from "react";

const LoadingForm = () => {
  return (
    <Stack>
      <DialogContent>
        <Stack gap={0.5}>
          <Stack
            gap={0.5}
            display="grid"
            gridTemplateColumns="repeat(2, minmax(250px, 1fr))"
            rowGap={1}
            columnGap={2}
            sx={{
              borderRadius: 2,
            }}
          >
            <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
            <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
            <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
            <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
          </Stack>
          <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
          <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
          <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Stack
          display="flex"
          flexDirection="row"
          gap={1}
          alignSelf={"flex-end"}
          padding={1}
        >
          <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
          <Skeleton variant="rectangular" sx={{ fontSize: "15px" }} />
        </Stack>
      </DialogActions>
    </Stack>
  );
};

export default LoadingForm;
