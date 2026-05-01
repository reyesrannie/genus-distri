import React, { useEffect } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import "../styles/ChangePassword.scss";
import rolesImage from "../../assets/svg/roles.svg";
import AppTextBox from "../custom/AppTextBox";

import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";
import {
  useCreateAssetsMutation,
  useUpdateAssetsMutation,
} from "../../services/server/api/assetsAPI";
import assetsSchema from "../schema/assetsSchema";

import AppPrompt from "../custom/AppPrompt";
import warningImg from "../../assets/svg/warning.svg";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

const AssetModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const assetModal = useSelector((state) => state.modal.assetModal);
  const asset = useSelector((state) => state.modal.asset);
  const warning = useSelector((state) => state.prompt.warning);

  const [createAsset, { isLoading: loadingCreate }] = useCreateAssetsMutation();
  const [updateAsset, { isLoading: loadingUpdate }] = useUpdateAssetsMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(assetsSchema),
    defaultValues: {
      asset_tag: "",
      description: "",
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      asset_tag: submitData?.asset_tag,
      description: submitData?.description,
      id: asset !== null ? asset?.id : null,
    };

    try {
      const res =
        asset === null
          ? await createAsset(payload).unwrap()
          : await updateAsset(payload).unwrap();

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (asset !== null) {
      Object.entries(asset).forEach(([key, value]) => setValue(key, value));
    } else {
      reset();
    }
  }, [asset]);

  return (
    <Dialog
      open={assetModal}
      onClose={() => {
        dispatch(setWarning(true));
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "350px",
          justifyContent: "center",
        }}
      >
        <Stack position={"absolute"} top={0} right={2}>
          <IconButton onClick={() => dispatch(setWarning(true))}>
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Stack>
        <img
          src={rolesImage}
          alt="roles"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Asset</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={1.3}>
            <AppTextBox
              control={control}
              name="asset_tag"
              label="Asset Tag"
              error={Boolean(errors?.asset_tag)}
              helperText={errors?.asset_tag?.message}
            />
            <AppTextBox
              control={control}
              name="description"
              label="Description"
              error={Boolean(errors?.description)}
              helperText={errors?.description?.message}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Stack
            display="flex"
            flexDirection="row"
            gap={1}
            alignSelf={"flex-end"}
            padding={2}
          >
            <Button
              type="submit"
              className="change-password-button"
              disabled={
                watch("asset_tag") === "" || watch("description") === ""
              }
              loading={loadingCreate || loadingUpdate}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              {asset === null ? "Submit" : "Update"}
            </Button>
            <Button
              className="change-password-button"
              disabled={loadingCreate || loadingUpdate}
              onClick={() => {
                dispatch(setWarning(true));
              }}
              loadingPosition="start"
              startIcon={<DoDisturbAltOutlinedIcon />}
              variant="contained"
              size="small"
              color="error"
            >
              Cancel
            </Button>
          </Stack>
        </DialogActions>
      </form>

      <AppPrompt
        open={warning}
        image={warningImg}
        title={`Warning`}
        message={`All changes that have not been saved will be discarded upon closing.`}
        confirmButton={`Yes, Close it!`}
        cancelButton={`No, Keep it! `}
        confirmOnClick={() => {
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default AssetModal;
