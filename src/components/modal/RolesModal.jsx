import React, { useEffect } from "react";

import {
  Button,
  Checkbox,
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
import { userRoles } from "../../services/constant/systemConstants";
import rolesSchema from "../schema/rolesSchema";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../services/server/api/rolesAPI";
import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";
import AppPrompt from "../custom/AppPrompt";
import warningImg from "../../assets/svg/warning.svg";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

const RolesModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const rolesModal = useSelector((state) => state.modal.rolesModal);
  const roles = useSelector((state) => state.modal.roles);
  const warning = useSelector((state) => state.prompt.warning);

  const [createRole, { isLoading: loadingCreate }] = useCreateRoleMutation();
  const [updateRole, { isLoading: loadingUpdate }] = useUpdateRoleMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(rolesSchema),
    defaultValues: {
      name: "",
      access_permission: [],
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      name: submitData?.name,
      access_permission: submitData?.access_permission,
      id: roles !== null ? roles?.id : null,
    };
    try {
      const res =
        roles === null
          ? await createRole(payload).unwrap()
          : await updateRole(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (roles !== null) {
      const validAccessValues = userRoles?.flatMap((role) =>
        role?.child?.map((child) => child.value.trim())
      );
      const filteredAccess = roles?.access_permission
        ?.map((item) => item?.trim())
        ?.filter((item) => validAccessValues?.includes(item));

      const newData = {
        ...roles,
        access_permission: filteredAccess,
      };

      Object.entries(newData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [roles]);

  const handleCheckBoxAll = (values) => {
    const currentValue = watch("access_permission") || [];
    const checkValue = values?.every((access) =>
      currentValue.includes(access?.value)
    );
    const allValues = values?.map((access) => access?.value);
    if (checkValue) {
      const newValue = currentValue.filter(
        (v) => !values?.some((access) => access?.value === v)
      );
      setValue("access_permission", newValue);
    } else {
      setValue(
        "access_permission",
        Array.from(new Set([...currentValue, ...allValues]))
      );
    }
  };

  const handleUpsertRole = (value) => {
    const access = watch("access_permission");
    if (access?.includes(value)) {
      setValue(
        "access_permission",
        access?.filter((item) => item !== value)
      );
    } else {
      setValue("access_permission", [...access, value]);
    }
  };

  return (
    <Dialog
      open={rolesModal}
      onClose={() => {
        dispatch(setWarning(true));
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
        <Typography fontWeight="700">Roles</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={1}>
            <AppTextBox
              control={control}
              name="name"
              label="Name"
              error={Boolean(errors?.name)}
              helperText={errors?.name?.message}
            />
            <Stack
              display="grid"
              gridTemplateColumns="repeat(2, minmax(150px, 1fr))"
              rowGap={1}
              columnGap={0}
              sx={{
                border: "1px solid #d0d0d0",
                borderRadius: 2,
                padding: 1,
              }}
            >
              {userRoles?.map((parent, index) => {
                return (
                  <Stack flexDirection={"row"} alignItems="center" key={index}>
                    <Checkbox
                      checked={parent?.child?.some((access) =>
                        watch("access_permission")?.includes(access?.value)
                      )}
                      onChange={() => handleCheckBoxAll(parent?.child)}
                    />
                    <Typography>{parent?.name}</Typography>
                  </Stack>
                );
              })}
            </Stack>
            {userRoles?.map((parent, index) => {
              return (
                parent?.child?.some((access) =>
                  watch("access_permission")?.includes(access.value)
                ) && (
                  <Stack
                    sx={{
                      border: "1px solid #d0d0d0",
                      borderRadius: 2,
                      padding: 1,
                    }}
                    key={index}
                  >
                    <Stack flexDirection={"row"} alignItems={"center"}>
                      <Checkbox
                        checked={parent?.child?.every((access) =>
                          watch("access_permission")?.includes(access?.value)
                        )}
                        indeterminate={
                          parent?.child?.some((access) =>
                            watch("access_permission")?.includes(access?.value)
                          ) &&
                          !parent?.child?.every((access) =>
                            watch("access_permission")?.includes(access?.value)
                          )
                        }
                        onChange={() => handleCheckBoxAll(parent?.child)}
                      />
                      <Typography>{parent?.name}</Typography>
                    </Stack>
                    <Stack
                      display="grid"
                      gridTemplateColumns="repeat(2, minmax(150px, 1fr))"
                      rowGap={1}
                      columnGap={0}
                      ml={5}
                    >
                      {parent?.child?.map((child, i) => {
                        return (
                          <Stack
                            flexDirection={"row"}
                            alignItems={"center"}
                            key={i}
                          >
                            <Checkbox
                              checked={watch("access_permission")?.includes(
                                child?.value
                              )}
                              onChange={() => handleUpsertRole(child?.value)}
                            />
                            <Typography>{child?.name}</Typography>
                          </Stack>
                        );
                      })}
                    </Stack>
                  </Stack>
                )
              );
            })}
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
                watch("name") === "" || watch("access_permission")?.length === 0
              }
              loading={loadingCreate || loadingUpdate}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              {roles === null ? "Submit" : "Update"}
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

export default RolesModal;
