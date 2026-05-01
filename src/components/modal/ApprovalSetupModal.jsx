import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  TextField as MuiTextField,
  IconButton,
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
  useCreateApprovalSetupMutation,
  useUpdateApprovalSetupMutation,
} from "../../services/server/api/approvalSetupAPI";
import approverSchema from "../schema/approverSchema";
import useParamsHook from "../../services/hooks/useParamsHook";
import {
  useLazyUsersQuery,
  useUsersQuery,
} from "../../services/server/api/usersAPI";
import { useOneChargingQuery } from "../../services/server/api/oneChargingAPI";
import {
  setChargingData,
  setUserData,
} from "../../services/server/slice/valuesSlice";
import Autocomplete from "../custom/AutoComplete";
import { mapPayloadApprover } from "../../services/functions/dataMapping";
import { useLazyRoleQuery } from "../../services/server/api/rolesAPI";
import AppPrompt from "../custom/AppPrompt";
import warningImg from "../../assets/svg/warning.svg";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

const ApprovalSetupModal = () => {
  const dispatch = useDispatch();
  const [filteredUsers, setFilteredUsers] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const debounceTimeout = useRef(null);
  const hasRun = useRef(false);
  const approvalSetupModal = useSelector(
    (state) => state.modal.approvalSetupModal
  );
  const approvalSetup = useSelector((state) => state.modal.approvalSetup);
  const userData = useSelector((state) => state.values.userData);
  const chargingData = useSelector((state) => state.values.chargingData);
  const warning = useSelector((state) => state.prompt.warning);

  const {
    params: paramsUser,
    onSelectPage: selectPageUser,
    onSearchData: searchUserData,
    reset: resetUser,
  } = useParamsHook();
  const {
    params: paramsCharging,
    onSearchData: searchCharging,
    reset: resetCharging,
  } = useParamsHook();

  const [searchRole] = useLazyRoleQuery();
  const {
    data: user,
    isLoading: loadingUser,
    isError: errorUser,
  } = useUsersQuery(paramsUser);
  const [searchUser] = useLazyUsersQuery();
  const { data: charging } = useOneChargingQuery(paramsCharging);

  const [createApprover, { isLoading: loadingCreate }] =
    useCreateApprovalSetupMutation();
  const [updateApprover, { isLoading: loadingUpdate }] =
    useUpdateApprovalSetupMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(approverSchema),
    defaultValues: {
      charging: null,
      approver: [],
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      ...mapPayloadApprover(submitData),
      id: approvalSetup !== null ? approvalSetup?.id : null,
    };

    try {
      const res =
        approvalSetup === null
          ? await createApprover(payload).unwrap()
          : await updateApprover(payload).unwrap();

      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
      hasRun.current = false;
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const getValue = useCallback((e, func) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      func(e.target.value);
    }, 500);
  }, []);

  const handleSearchCharging = async (data) => {
    const results = [];
    for (const item of data) {
      if (!handleCheckCharging()) {
        const res = await searchUser({
          status: "active",
          search: item?.approver_name,
        }).unwrap();
        if (res?.result?.data?.length) {
          results.push(...res.result.data);
        }
      }
    }
    dispatch(setUserData(results));
  };

  const handleCheckUser = () => {
    const matched = approvalSetup?.approver?.every((app) =>
      userData?.some((user) => user?.id === app?.approver_id)
    );

    return matched;
  };

  const handleCheckCharging = () => {
    const matched = chargingData?.some(
      (item) => item?.code === approvalSetup?.charging_code
    );

    return matched;
  };

  useEffect(() => {
    if (approvalSetup !== null) {
      handleSearchCharging(approvalSetup?.approver || []);
      searchCharging(approvalSetup?.charging_name);
    }
  }, [approvalSetup]);

  const mapUserForm = () => {
    if (hasRun.current) return;
    const mapUser = {
      approver:
        approvalSetup?.approver?.map((app) =>
          userData?.find((user) => user?.id === app?.approver_id)
        ) || [],
      charging: chargingData?.find(
        (charge) => charge?.code === approvalSetup?.charging_code
      ),
    };

    Object.entries(mapUser).forEach(([key, value]) => {
      setValue(key, value);
    });

    hasRun.current = true;
  };

  useEffect(() => {
    if (user?.result?.data) {
      dispatch(setUserData(user?.result?.data));
    }
    if (charging?.result?.data) {
      dispatch(setChargingData(charging?.result?.data));
    }
  }, [user, charging]);

  useEffect(() => {
    if (
      userData &&
      chargingData &&
      approvalSetup !== null &&
      approvalSetupModal &&
      handleCheckCharging() &&
      handleCheckUser()
    ) {
      mapUserForm();
    }
  }, [userData, approvalSetupModal, approvalSetup, chargingData, userData]);

  useEffect(() => {
    const getFilteredUsers = async () => {
      const res = await searchRole({ status: "active", pagination: "none" });

      const idsWithApprover = res?.data?.result
        ?.filter((item) =>
          item.access_permission
            .split(",")
            .map((p) => p.trim())
            .includes("approver")
        )
        .map((item) => item.id);

      const approverUsers = userData?.filter((user) =>
        idsWithApprover.includes(user.role_id)
      );

      setFilteredUsers(approverUsers || []);
    };

    getFilteredUsers();
  }, [userData]);

  return (
    <Dialog
      open={approvalSetupModal}
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
          alt="approver"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Approver</Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack gap={1.3}>
            <Autocomplete
              loading={loadingUser}
              control={control}
              name={"charging"}
              options={chargingData || []}
              getOptionLabel={(option) => `${option.code} - ${option?.name}`}
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              scrollChange={(e) =>
                handleScroll(e, () => selectPageUser(paramsCategory?.page + 1))
              }
              onKeyUp={(e) => {
                if (e?.target?.value === "") {
                  resetCharging();
                } else {
                  getValue(e, searchCharging);
                }
              }}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Charging"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.charging)}
                  helperText={errors.charging?.message}
                />
              )}
            />
            <Autocomplete
              multiple
              sx={{
                "& .MuiInputBase-root": {
                  minHeight:
                    watch("approver")?.length === 0
                      ? 40
                      : "var(--input-min-height)",
                },
              }}
              loading={loadingUser}
              control={control}
              name={"approver"}
              options={filteredUsers || []}
              getOptionLabel={(option) =>
                `${option.account_code} - ${option?.account_name}`
              }
              isOptionEqualToValue={(option, value) => option?.id === value?.id}
              scrollChange={(e) =>
                handleScroll(e, () => selectPageUser(paramsCategory?.page + 1))
              }
              noOptionsText={
                errorUser ? "No approver found" : "Searching approver..."
              }
              onKeyUp={(e) => {
                if (e?.target?.value === "") {
                  resetUser();
                } else {
                  getValue(e, searchUserData);
                }
              }}
              renderInput={(params) => (
                <MuiTextField
                  {...params}
                  label="Approver"
                  size="small"
                  variant="outlined"
                  error={Boolean(errors.approver)}
                  helperText={errors.approver?.message}
                />
              )}
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
              disabled={
                watch("approver")?.length === 0 || watch("charging") === null
              }
              className="change-password-button"
              loading={loadingCreate || loadingUpdate}
              loadingPosition="start"
              startIcon={<SwapHorizontalCircleOutlinedIcon />}
              variant="contained"
              size="small"
              color="success"
            >
              {approvalSetup === null ? "Submit" : "Update"}
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
          hasRun.current = false;
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default ApprovalSetupModal;
