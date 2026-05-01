import { Box, Divider, Stack, Typography } from "@mui/material";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import React from "react";
import { useSelector } from "react-redux";

const StatusFilter = ({ pending, onStatusChange, params }) => {
  const mode = useSelector((state) => state.theme.mode);

  return (
    <Box width={"fit-content"}>
      <Stack flexDirection="row" overflow={"hidden"} borderRadius={1}>
        {pending && (
          <>
            <Box
              backgroundColor={
                params?.status === "pending"
                  ? "background.paper"
                  : mode === "dark"
                    ? "background.paper"
                    : "white"
              }
              padding={1}
              sx={{
                cursor:
                  params?.status === "pending" ? "not-allowed" : "pointer",
              }}
              onClick={() => {
                onStatusChange("pending");
              }}
            >
              <Stack
                flexDirection="row"
                gap={1}
                sx={{
                  opacity: params?.status === "pending" ? 1 : 0.2,
                }}
                alignItems={"center"}
              >
                <CheckCircleOutlineOutlinedIcon
                  sx={{
                    color: params?.status === "pending" ? "#299826" : "#000000",
                  }}
                />
                <Typography
                  color={
                    params?.status === "pending" ? "textPrimary" : "#000000"
                  }
                >
                  Pending
                </Typography>
              </Stack>
            </Box>
            <Divider orientation="vertical" flexItem />
          </>
        )}

        <Box
          backgroundColor={
            params?.status === "active"
              ? "background.paper"
              : mode === "dark"
                ? "background.paper"
                : "white"
          }
          padding={1}
          sx={{
            cursor: params?.status === "active" ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            onStatusChange("active");
          }}
        >
          <Stack
            flexDirection="row"
            gap={1}
            sx={{
              opacity: params?.status === "active" ? 1 : 0.2,
            }}
            alignItems={"center"}
          >
            <CheckCircleOutlineOutlinedIcon
              sx={{
                color: params?.status === "active" ? "#299826" : "#000000",
              }}
            />
            <Typography
              color={params?.status === "active" ? "textPrimary" : "#000000"}
            >
              Active
            </Typography>
          </Stack>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          backgroundColor={
            params?.status === "inactive"
              ? "background.paper"
              : mode === "dark"
                ? "background.paper"
                : "white"
          }
          padding={1}
          sx={{
            cursor: params?.status === "inactive" ? "not-allowed" : "pointer",
          }}
          onClick={() => {
            onStatusChange("inactive");
          }}
        >
          <Stack
            flexDirection="row"
            gap={1}
            sx={{
              opacity: params?.status === "inactive" ? 1 : 0.2,
            }}
            alignItems={"center"}
          >
            <CancelOutlinedIcon
              sx={{
                color: params?.status === "inactive" ? "#299826" : "#000000",
              }}
            />
            <Typography
              color={params?.status === "inactive" ? "textPrimary" : "#000000"}
            >
              InActive
            </Typography>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default StatusFilter;
