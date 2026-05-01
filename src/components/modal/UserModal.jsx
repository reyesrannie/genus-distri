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
  useMediaQuery,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { resetModal, setHasRun } from "../../services/server/slice/modalSlice";
import "../styles/ChangePassword.scss";
import user from "../../assets/svg/user.svg";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import userSchema from "../schema/userSchema";
import AppTextBox from "../custom/AppTextBox";
import Autocomplete from "../custom/AutoComplete";
import { useEmployeeQuery } from "../../services/server/request/sedarAPI";
import {
  useLazyOneChargingQuery,
  useOneChargingQuery,
} from "../../services/server/api/oneChargingAPI";
import useParamsHook from "../../services/hooks/useParamsHook";
import {
  useLazyRoleQuery,
  useRoleQuery,
} from "../../services/server/api/rolesAPI";
import { handleScroll } from "../../services/functions/reusableFunctions";

import { mapPayloadUser } from "../../services/functions/dataMapping";
import {
  setChargingData,
  setRolesData,
  setTdoData,
} from "../../services/server/slice/valuesSlice";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../services/server/api/usersAPI";
import { useSnackbar } from "notistack";
import { objectError } from "../../services/functions/errorResponse";
import LoadingForm from "../custom/LoadingForm";
import { FetchDataFn } from "../../services/functions/FetchDataFn";

import warningImg from "../../assets/svg/warning.svg";
import AppPrompt from "../custom/AppPrompt";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";
import useArcanaParamsHook from "../../services/hooks/useArcanaParamsHook";
import {
  useLazyTdoQuery,
  useTdoQuery,
} from "../../services/server/api/arcana/arcanaAPI";
import { useDebounceCallback } from "../../services/hooks/useDebounceCallBack";
import { useCheckCharging } from "../../services/hooks/useCheckDataHook";

const UserModal = () => {
  const dispatch = useDispatch();
  const debounceTimeout = useRef(null);
  const matched = useCheckCharging();
  const isLaptop = useMediaQuery("(min-width:1024px)");

  const running = useRef(false);
  const { multipleFetch } = FetchDataFn();

  const { enqueueSnackbar } = useSnackbar();
  const { params, onSelectPage, onSearchData, onReset, onRemovePagination } =
    useParamsHook();
  const {
    params: paramsRoles,
    onSelectPage: onSelectPageRoles,
    onSearchData: searchRole,
    onReset: resetRoles,
  } = useParamsHook();

  const {
    params: paramsTDO,
    onSelectPage: onSelectPageTDO,
    onSearchData: searchTDOs,
    onReset: resetTDO,
  } = useArcanaParamsHook();

  const userModal = useSelector((state) => state.modal.userModal);
  const hasRun = useSelector((state) => state.modal.hasRun);
  const userData = useSelector((state) => state.modal.user || null);
  const chargingData = useSelector((state) => state.values.chargingData);
  const rolesData = useSelector((state) => state.values.rolesData);
  const tdoData = useSelector((state) => state.values.tdoData);
  const warning = useSelector((state) => state.prompt.warning);

  const { data: sedarData, isLoading: loadingSedar } = useEmployeeQuery();
  const {
    data: roles,
    isLoading: loadingRoles,
    isError: errorRoles,
  } = useRoleQuery(paramsRoles);
  const {
    data: oneCharging,
    isLoading: loadingCharging,
    isError: errorCharging,
  } = useOneChargingQuery(params);

  const { data: tdo } = useTdoQuery(paramsTDO);

  const [searchCharging, { data: chargingFetch }] = useLazyOneChargingQuery();
  const [searchRoles, { data: rolesFetch }] = useLazyRoleQuery();
  const [searchTDO, { data: tdoFetch }] = useLazyTdoQuery();

  const [createUser, { isLoading: loadingCreate }] = useCreateUserMutation();
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      account_name: "",
      mobile_no: "",
      username: "",
      tdo: null,
      account_code: null,
      role_id: null,
      charging: null,
      scope_order: [],
    },
  });
  const submitHandler = async (submitData) => {
    const payload = {
      ...mapPayloadUser(submitData),
      id:
        userData !== null && userData?.status !== "Pending"
          ? userData?.id
          : null,
      for_syncing: userData?.status === "Pending" && true,
    };

    try {
      const res =
        userData === null || userData?.status === "Pending"
          ? await createUser(payload).unwrap()
          : await updateUser(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      reset();
      dispatch(resetModal());
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const mapUserForm = () => {
    if (hasRun) return;
    const mapUser = {
      account_code: sedarData?.data?.find(
        (item) => item?.general_info?.full_id_number === userData?.account_code,
      ),
      account_name: userData?.account_name,
      mobile_no: userData?.mobile_no,
      username: userData?.username,
      role_id: rolesData?.find((item) => item?.id === userData?.role_id),
      charging: chargingData?.find(
        (item) => item?.sync_id === userData?.charging_id?.toString(),
      ),
      scope_order: userData?.customer?.map((item) =>
        chargingData?.find(
          (chargingItem) => chargingItem?.code === item?.charging_code,
        ),
      ),
      tdo: tdoData?.find((tdo) => tdo?.id === userData?.tdo),
    };

    Object.entries(mapUser).forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  const mapAddPendingForm = () => {
    if (hasRun) return;
    const mapUser = {
      account_code: sedarData?.data?.find(
        (item) =>
          item?.general_info?.full_id_number ===
          `${userData?.id_prefix}-${userData?.id_no}`,
      ),
      account_name: `${userData?.first_name} ${userData?.last_name}`,
      username: userData?.username,
    };
    Object.entries(mapUser).forEach(([key, value]) => {
      setValue(key, value);
    });
    dispatch(setHasRun(true));
  };

  const handleAutoFill = () => {
    const { general_info } = watch("account_code");
    const { first_name, last_name } = general_info || {};

    if (first_name && last_name) {
      const initials = first_name
        .split(" ")
        .map((name) => name.charAt(0).toLowerCase());
      const username =
        initials.join("") + last_name.replace(/\s/g, "").toLowerCase();

      const autoFillData = {
        account_name: `${first_name} ${last_name}`,
        username: username,
      };

      Object.entries(autoFillData).forEach(([key, value]) => {
        setValue(key, value);
      });
    } else {
      setValue("account_code", null);
      setValue("account_name", "");
      setValue("username", "");
    }
  };

  const chargingNoPagination = async (matched) => {
    try {
      if (!matched) {
        const res = await searchCharging({
          status: "active",
          pagination: "none",
        });

        const resTDO = await searchTDO({
          isActive: true,
          search: `${userData?.tdo_name}`,
          PageSize: 1000,
        });

        dispatch(setChargingData(res?.data?.result || []));
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (oneCharging?.result?.data) {
      dispatch(setChargingData(oneCharging?.result?.data));
    }
    if (chargingFetch?.result?.data) {
      dispatch(setChargingData(chargingFetch?.result?.data));
    }
  }, [oneCharging, chargingFetch]);

  useEffect(() => {
    if (roles?.result?.data) {
      dispatch(setRolesData(roles?.result?.data));
    }
    if (rolesFetch?.result?.data) {
      dispatch(setRolesData(rolesFetch?.result?.data));
    }
  }, [roles, rolesFetch]);

  useEffect(() => {
    if (tdo?.value?.tdos) {
      dispatch(setTdoData(tdo?.value?.tdos));
    }
    if (tdoFetch?.value?.tdos) {
      dispatch(setTdoData(tdoFetch?.value?.tdos));
    }
  }, [tdoFetch, tdo]);

  useEffect(() => {
    if (userData !== null) {
      if (userData?.customer?.length > 0) {
        running.current = true;
        chargingNoPagination(matched);
        running.current = false;
      } else if (userData?.status === "Pending") return;
      else {
        multipleFetch(
          userData?.customer,
          matched,
          searchCharging,
          "charging_code",
          setChargingData,
          running,
        );
      }
    }
  }, [userData]);

  useEffect(() => {
    if (userData?.status === "Pending" && sedarData) {
      mapAddPendingForm();
    } else if (sedarData && chargingData && userData !== null && userModal) {
      mapUserForm();
    }
  }, [chargingData, userData, rolesData, userModal, sedarData]);

  const handleSearchRole = useDebounceCallback(async (searchValue) => {
    await searchRoles({
      status: "active",
      search: searchValue,
    });
  }, 500);

  const handleSearchOneCharging = useDebounceCallback(async (searchValue) => {
    await searchCharging({
      status: "active",
      search: searchValue,
    });
  }, 500);

  const handleSearchArcana = useDebounceCallback(async (searchValue) => {
    await searchTDO({
      isActive: true,
      search: searchValue,
      PageSize: 10000,
    });
  }, 500);

  return (
    <Dialog
      open={userModal}
      onClose={() => {
        dispatch(setWarning(true));
      }}
      fullScreen={!isLaptop} // 👈 goes fullscreen if not laptop
      maxWidth={isLaptop ? "md" : false} // optional, so laptop has constrained width
      sx={
        !isLaptop
          ? { height: "100vh", width: "100%" } // fullscreen styling
          : {}
      }
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
          src={user}
          alt="User"
          draggable="false"
          className="user-modal-image-icon"
        />
        <Typography fontWeight="700"> User</Typography>
      </DialogTitle>

      {!loadingCharging &&
      !loadingRoles &&
      !loadingSedar &&
      !running.current ? (
        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogContent>
            <Stack gap={0.5}>
              <Stack
                gap={0.5}
                display={isLaptop ? "grid" : null}
                gridTemplateColumns="repeat(2, minmax(250px, 1fr))"
                rowGap={1}
                columnGap={2}
                sx={{
                  borderRadius: 2,
                }}
              >
                <Autocomplete
                  loading={loadingSedar}
                  control={control}
                  name={"account_code"}
                  options={sedarData?.data || []}
                  getOptionLabel={(option) =>
                    option?.general_info?.full_id_number
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.general_info?.full_id_number ===
                    value?.general_info?.full_id_number
                  }
                  onClose={handleAutoFill}
                  componentsProps={{
                    clearIndicator: {
                      onClick: (event) => {
                        setValue("account_code", null);
                        setValue("account_name", "");
                        setValue("username", "");
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      label="Employee ID"
                      size="small"
                      variant="outlined"
                      error={Boolean(errors.account_code)}
                      helperText={errors.account_code?.message}
                    />
                  )}
                />
                <AppTextBox
                  control={control}
                  disabled
                  name="account_name"
                  label="Complete Name"
                  error={Boolean(errors?.account_name)}
                  helperText={errors?.account_name?.message}
                />
                <AppTextBox
                  control={control}
                  name="mobile_no"
                  label="Mobile Number"
                  error={Boolean(errors?.mobile_no)}
                  helperText={errors?.mobile_no?.message}
                />
                <AppTextBox
                  control={control}
                  name="username"
                  label="Username"
                  error={Boolean(errors?.username)}
                  helperText={errors?.username?.message}
                />
              </Stack>
              <Autocomplete
                loading={loadingRoles}
                control={control}
                name={"role_id"}
                options={rolesData || []}
                getOptionLabel={(option) => `${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                scrollChange={(e) =>
                  handleScroll(e, () =>
                    onSelectPageRoles(paramsRoles?.page + 1),
                  )
                }
                onKeyUp={(e) => {
                  handleSearchRole(e?.target?.value);
                }}
                noOptionsText={
                  errorRoles ? "No roles found" : "Searching roles..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Role"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.role_id)}
                    helperText={errors.role_id?.message}
                  />
                )}
              />

              <Autocomplete
                control={control}
                name={"tdo"}
                options={tdoData || []}
                getOptionLabel={(option) => `${option?.fullname}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                scrollChange={(e) =>
                  handleScroll(e, () =>
                    onSelectPageTDO(paramsTDO?.PageNumber + 1),
                  )
                }
                onKeyUp={(e) => {
                  handleSearchArcana(e?.target?.value);
                }}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Territory Distribution Officer"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.role_id)}
                    helperText={errors.role_id?.message}
                  />
                )}
              />

              <Autocomplete
                loading={loadingCharging}
                control={control}
                name={"charging"}
                options={chargingData || []}
                getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.code === value?.code
                }
                scrollChange={(e) =>
                  handleScroll(e, () => onSelectPage(params?.page + 1))
                }
                onKeyUp={(e) => {
                  handleSearchOneCharging(e.target.value);
                }}
                noOptionsText={
                  errorCharging ? "No charging found" : "Searching charging..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Account Charging"
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
                      watch("scope_order")?.length === 0
                        ? 40
                        : "var(--input-min-height)",
                  },
                }}
                loading={loadingCharging}
                control={control}
                name={"scope_order"}
                options={chargingData || []}
                getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.code === value?.code
                }
                scrollChange={(e) =>
                  handleScroll(e, () => onSelectPage(params?.page + 1))
                }
                onKeyUp={(e) => {
                  handleSearchOneCharging(e.target.value);
                }}
                getOptionDisabled={(option) => {
                  const selected = control._formValues?.scope_order || [];
                  return selected.some((item) => item.id === option.id);
                }}
                noOptionsText={
                  errorCharging ? "No customer found" : "Searching customer..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Customer Charging"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.scope_order)}
                    helperText={errors.scope_order?.message}
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
              padding={1}
            >
              <Button
                type="submit"
                className="change-password-button"
                disabled={
                  watch("account_code") === "" ||
                  watch("account_name") === "" ||
                  watch("username") === "" ||
                  watch("role_id") === null ||
                  watch("charging") === null ||
                  watch("scope_order")?.length === 0 ||
                  watch("mobile_no") === ""
                }
                loading={loadingCreate || loadingUpdate}
                loadingPosition="start"
                startIcon={<SwapHorizontalCircleOutlinedIcon />}
                variant="contained"
                size="small"
                color="success"
              >
                {userData === null || userData?.status === "Pending"
                  ? "Submit"
                  : "Update"}
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
      ) : (
        <LoadingForm />
      )}

      <AppPrompt
        open={warning}
        image={warningImg}
        title={`Warning`}
        message={`All changes that have not been saved will be discarded upon closing.`}
        confirmButton={`Yes, Close it!`}
        cancelButton={`No, Keep it! `}
        confirmOnClick={() => {
          reset();
          dispatch(resetPrompt());
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default UserModal;
