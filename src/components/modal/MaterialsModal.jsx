import React, { useCallback, useEffect, useRef } from "react";

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
import material from "../../assets/svg/roles.svg";
import AppTextBox from "../custom/AppTextBox";

import { objectError } from "../../services/functions/errorResponse";
import { useSnackbar } from "notistack";

import {
  useCreateMaterialsMutation,
  useUpdateMaterialsMutation,
} from "../../services/server/api/materialsAPI";
import materialsSchema from "../schema/materialsSchema";
import Autocomplete from "../custom/AutoComplete";
import { useCategoryQuery } from "../../services/server/api/categoryAPI";
import useParamsHook from "../../services/hooks/useParamsHook";
import {
  setCategoryData,
  setUomData,
  setWarehouseData,
} from "../../services/server/slice/valuesSlice";
import { handleScroll } from "../../services/functions/reusableFunctions";
import { useUomQuery } from "../../services/server/api/uomAPI";
import { useWarehouseQuery } from "../../services/server/api/warehouseAPI";
import {
  useAccountTitleQuery,
  useLazyAccountTitleQuery,
} from "../../services/server/api/accountTitleAPI";
import { FetchDataFn } from "../../services/functions/FetchDataFn";
import LoadingForm from "../custom/LoadingForm";

import warningImg from "../../assets/svg/warning.svg";
import AppPrompt from "../custom/AppPrompt";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

const MaterialsModal = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const debounceTimeout = useRef(null);
  const running = useRef(null);

  const warning = useSelector((state) => state.prompt.warning);
  const materialsModal = useSelector((state) => state.modal.materialsModal);
  const materials = useSelector((state) => state.modal.materials);
  const categoryData = useSelector((state) => state.values.categoryData);
  const uomData = useSelector((state) => state.values.uomData);
  const warehouseData = useSelector((state) => state.values.warehouseData);
  const accountTitleData = useSelector(
    (state) => state.values.accountTitleData
  );

  const {
    params: paramsCategory,
    onSelectPage: onSelectPageCategory,
    onSearchData: onSearchCategory,
    onReset: resetCategory,
  } = useParamsHook();

  const {
    params: paramsUom,
    onSelectPage: onSelectPageUom,
    onSearchData: onSearchUom,
    onReset: resetUom,
  } = useParamsHook();

  const {
    params: paramsWarehouse,
    onSelectPage: onSelectPageWarehouse,
    onSearchData: onSearchWarehouse,
    onReset: resetWarehouse,
  } = useParamsHook();

  const {
    params: paramsAccountTitle,
    onSelectPage: onSelectPageAccountTitle,
    onSearchData: onSearchAccountTitle,
    onReset: resetAccountTitle,
  } = useParamsHook();

  const {
    data: category,
    isLoading: loadingCategory,
    isError: errorCategory,
  } = useCategoryQuery(paramsCategory);

  const {
    data: uom,
    isLoading: loadingUom,
    isError: errorUom,
  } = useUomQuery(paramsUom);

  const {
    data: warehouse,
    isLoading: loadingWareHouse,
    isError: errorWarehouse,
  } = useWarehouseQuery(paramsWarehouse);

  const {
    data: accountTitle,
    isLoading: loadingAccountTitle,
    isError: errorAccountTitle,
  } = useAccountTitleQuery(paramsAccountTitle);

  const [getAccountTitle] = useLazyAccountTitleQuery();
  const [createMaterials, { isLoading: loadingCreate }] =
    useCreateMaterialsMutation();
  const [updateMaterials, { isLoading: loadingUpdate }] =
    useUpdateMaterialsMutation();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(materialsSchema),
    defaultValues: {
      code: "",
      name: "",
      category_id: null,
      uom_id: null,
      warehouse_id: null,
    },
  });

  const submitHandler = async (submitData) => {
    const payload = {
      code: submitData?.code,
      name: submitData?.name,
      category_id: submitData?.category_id?.id,
      uom_id: submitData?.uom_id?.id,
      warehouse_id: submitData?.warehouse_id?.id,

      id: materials !== null ? materials?.id : null,
    };

    try {
      const res =
        materials === null
          ? await createMaterials(payload).unwrap()
          : await updateMaterials(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetModal());
      reset();
    } catch (error) {
      objectError(error, setError, enqueueSnackbar);
    }
  };

  const handleCheckUom = () => {
    const matched = uomData?.some(
      (atd) => atd?.description === materials?.uom?.description
    );
    return matched;
  };

  const mapMaterialsToForm = () => {
    const mapped = {
      code: materials?.code || "",
      name: materials?.name || "",
      category_id:
        categoryData?.find((item) => item?.id === materials?.category?.id) ||
        null,
      uom_id: uomData?.find((item) => item?.id === materials?.uom?.id) || null,
      warehouse_id:
        warehouseData?.find((item) => item?.id === materials?.warehouse?.id) ||
        null,
    };

    Object.entries(mapped).forEach(([key, value]) => setValue(key, value));
  };

  const getValue = useCallback((e, func) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      func(e.target.value);
    }, 500);
  }, []);

  useEffect(() => {
    if (category?.result?.data) {
      dispatch(setCategoryData(category?.result?.data));
    }
    if (uom?.result?.data) {
      dispatch(setUomData(uom?.result?.data));
    }
    if (warehouse?.result?.data) {
      dispatch(setWarehouseData(warehouse?.result?.data));
    }
  }, [category, uom, warehouse]);

  useEffect(() => {
    if (
      materials &&
      materialsModal &&
      accountTitleData &&
      uomData &&
      warehouseData &&
      categoryData &&
      handleCheckUom()
    ) {
      mapMaterialsToForm();
    }
  }, [
    materialsModal,
    materials,
    accountTitleData,
    uomData,
    warehouseData,
    categoryData,
  ]);

  useEffect(() => {
    if (materials !== null) {
      onSearchUom(materials?.uom?.description);
      onSearchCategory(materials?.category?.name);
    }
  }, [materials]);

  return (
    <Dialog
      open={materialsModal}
      onClose={() => {
        dispatch(setWarning(true));
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: "450px",
          justifyContent: "center",
        }}
      >
        <Stack position={"absolute"} top={0} right={2}>
          <IconButton onClick={() => dispatch(setWarning(true))}>
            <CloseIcon sx={{ fontSize: "20px" }} />
          </IconButton>
        </Stack>
        <img
          src={material}
          alt="materials"
          draggable="false"
          className="password-change-modal-image"
        />
        <Typography fontWeight="700">Materials</Typography>
      </DialogTitle>
      {!running.current ? (
        <form onSubmit={handleSubmit(submitHandler)}>
          <DialogContent>
            <Stack gap={1.3}>
              <AppTextBox
                control={control}
                name="code"
                label="Code"
                error={Boolean(errors?.code)}
                helperText={errors?.code?.message}
              />
              <AppTextBox
                control={control}
                name="name"
                label="Name"
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
              <Autocomplete
                loading={loadingCategory}
                control={control}
                name={"category_id"}
                options={categoryData || []}
                getOptionLabel={(option) => `${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                scrollChange={(e) =>
                  handleScroll(e, () =>
                    onSelectPageCategory(paramsCategory?.page + 1)
                  )
                }
                onKeyUp={(e) => {
                  if (e?.target?.value === "") {
                    resetCategory();
                  } else {
                    getValue(e, onSearchCategory);
                  }
                }}
                noOptionsText={
                  errorCategory ? "No category found" : "Searching category..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Category"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.category_id)}
                    helperText={errors.category_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingUom}
                control={control}
                name={"uom_id"}
                options={uomData || []}
                getOptionLabel={(option) =>
                  `${option?.code} - ${option?.description}`
                }
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                scrollChange={(e) =>
                  handleScroll(e, () => onSelectPageUom(paramsUom?.page + 1))
                }
                onKeyUp={(e) => {
                  if (e?.target?.value === "") {
                    resetUom();
                  } else {
                    getValue(e, onSearchUom);
                  }
                }}
                noOptionsText={errorUom ? "No uom found" : "Searching uom..."}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Uom"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.uom_id)}
                    helperText={errors.uom_id?.message}
                  />
                )}
              />
              <Autocomplete
                loading={loadingWareHouse}
                control={control}
                name={"warehouse_id"}
                options={warehouseData || []}
                getOptionLabel={(option) => `${option?.code} - ${option?.name}`}
                isOptionEqualToValue={(option, value) =>
                  option?.id === value?.id
                }
                scrollChange={(e) =>
                  handleScroll(e, () =>
                    onSelectPageWarehouse(paramsWarehouse?.page + 1)
                  )
                }
                onKeyUp={(e) => {
                  if (e?.target?.value === "") {
                    resetWarehouse();
                  } else {
                    getValue(e, onSearchWarehouse);
                  }
                }}
                noOptionsText={
                  errorWarehouse
                    ? "No warehouse found"
                    : "Searching warehouse..."
                }
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label="Warehouse"
                    size="small"
                    variant="outlined"
                    error={Boolean(errors.warehouse_id)}
                    helperText={errors.warehouse_id?.message}
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
                  watch("code") === "" ||
                  watch("name") === "" ||
                  watch("category_id") === null ||
                  watch("uom_id") === null ||
                  watch("warehouse_id") === null
                }
                className="change-password-button"
                loading={loadingCreate || loadingUpdate}
                loadingPosition="start"
                startIcon={<SwapHorizontalCircleOutlinedIcon />}
                variant="contained"
                size="small"
                color="success"
              >
                {materials === null ? "Submit" : "Update"}
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
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default MaterialsModal;
