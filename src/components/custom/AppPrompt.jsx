import { Box, Button, Dialog, Stack, Typography } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import "../styles/Modal.scss";
import { resetPrompt } from "../../services/server/slice/promptSlice";

const AppPrompt = ({
  open = false,
  image,
  title,
  subTitle,
  message,
  nextLineMessage,
  confirmButton,
  cancelButton,
  confirmOnClick,
  isLoading = false,
}) => {
  const dispatch = useDispatch();

  return (
    <Dialog open={open}>
      <Box maxWidth={400} overflow={"hidden"} padding={2}>
        <Stack gap={2}>
          <Stack alignItems={"center"} gap={1}>
            <img
              src={image}
              alt="Password"
              className="system-modal-image"
              draggable="false"
            />
            <Typography fontWeight={700}>{title}</Typography>
            <Typography fontWeight={300}>{subTitle}</Typography>
            <Typography>{message}</Typography>
            <Typography>{nextLineMessage}</Typography>
          </Stack>
          <Stack
            overflow={"hidden"}
            flexDirection={"row"}
            gap={1}
            alignSelf={"flex-end"}
          >
            <Button
              loading={isLoading}
              loadingPosition="start"
              variant="contained"
              color="warning"
              onClick={() => confirmOnClick()}
            >
              {confirmButton}
            </Button>
            <Button
              disabled={isLoading}
              variant="contained"
              color="primary"
              onClick={() => {
                dispatch(resetPrompt());
              }}
            >
              {cancelButton}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default AppPrompt;
