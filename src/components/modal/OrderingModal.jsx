import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
  TextField as MuiTextField,
  IconButton,
  Divider,
  Box,
  Chip,
  DialogActions,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setHasRun,
  setSelectedIndex,
} from "../../services/server/slice/modalSlice";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";

import "../styles/ChangePassword.scss";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import orderingSchema from "../schema/orderingSchema";

import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import UpdateOutlinedIcon from "@mui/icons-material/UpdateOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import CloseIcon from "@mui/icons-material/Close";

import { decodeUser, getCustomer } from "../../services/functions/saveUser";

import EnterRemarks from "../custom/EnterRemarks";

import { hasOrderChanged } from "../../services/functions/reusableFunctions";

import {
  mapOrderingData,
  mapOrderingPayload,
} from "../../services/functions/dataMapping";

import { enqueueSnackbar } from "notistack";
import {
  setApprove,
  setArchive,
  setCreate,
  setIsNotMatch,
  setPayloadData,
  setReset,
  setServe,
  setUpdate,
} from "../../services/server/slice/promptSlice";
import CreateOrderPrompt from "../custom/CreateOrderPrompt";
import {
  clearCustomerData,
  setChargingData,
} from "../../services/server/slice/valuesSlice";
import {
  useLazyOneChargingQuery,
  useOneChargingQuery,
} from "../../services/server/api/oneChargingAPI";

import warningImg from "../../assets/svg/warning.svg";
import AppPrompt from "../custom/AppPrompt";
import {
  resetPrompt,
  setWarning,
} from "../../services/server/slice/promptSlice";

import { FetchDataFn } from "../../services/functions/FetchDataFn";
import {
  useLazyCustomerQuery,
  useLazyProductQuery,
  useLazyTdoQuery,
} from "../../services/server/api/arcana/arcanaAPI";
import { OrderingFields } from "../pages/order/OrderingFields";
import OrderingProducts from "../pages/order/OrderingProducts";
import MobileLoading from "../custom/MobileLoading";

const OrderingModal = () => {
  const dispatch = useDispatch();
  const { multipleOrderFetch } = FetchDataFn();

  const [openRemarks, setOpenRemarks] = useState(false);

  const customers = getCustomer();
  const user = decodeUser();
  const access = user?.role?.access_permission?.map((item) => item?.trim());
  const createOrdering = useSelector((state) => state.modal.createOrdering);
  const updateOrdering = useSelector((state) => state.modal.updateOrdering);
  const approveOrdering = useSelector((state) => state.modal.approveOrdering);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);
  const productData = useSelector((state) => state.values.productData);
  const tdoData = useSelector((state) => state.values.tdoData);

  const hasRun = useSelector((state) => state.modal.hasRun);

  const viewOrdering = useSelector((state) => state.modal.viewOrdering);
  const ordering = useSelector((state) => state.modal.ordering);
  const selectedIndex = useSelector((state) => state.modal.selectedIndex);
  const chargingData = useSelector((state) => state.values.chargingData);
  const warning = useSelector((state) => state.prompt.warning);

  const loadingProduct = useSelector((state) => state.modal.isLoading);

  const { data: charging } = useOneChargingQuery({
    status: "active",
    pagination: "none",
  });

  const [getCharging, { data: chargingFetch }] = useLazyOneChargingQuery();

  const [getProduct, { reset: resetProduct }] = useLazyProductQuery();

  const [getTdo, { isLoading: loadingTDO, reset: resetTDO }] =
    useLazyTdoQuery();

  const [getClient, { isLoading: loadingClient, reset: resetClient }] =
    useLazyCustomerQuery();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(orderingSchema),
    defaultValues: {
      order_no: "",
      rush: "",
      reason: "",
      charging: null,
      type: null,
      tdo: null,
      customer: null,
      date_needed: null,
      customer_address: "",
      branch_name: "",
      delivery_address: "",
      tin: "",
      reg_discount: "",
      sp_discount: "",
      po_number: "",
      order: [
        {
          id: new Date(),
          material: null,
          price: "",
          quantity: "",
          selling_price: "",
          remarks: "",
        },
      ],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "order",
  });

  const submitHandler = async (submitData) => {
    const items = {
      ...submitData,
      charging: approveOrdering
        ? submitData?.charging
        : chargingData?.find(
            (charge) => charge?.code === submitData?.charging?.charging_code,
          ),
    };
    const payload = {
      ...mapOrderingPayload(items),
      id: ordering !== null ? ordering?.id : null,
    };

    dispatch(setPayloadData(payload));
    createOrdering && dispatch(setCreate(true));
    updateOrdering && dispatch(setUpdate(true));
    approveOrdering && dispatch(setApprove(true));
  };

  const handleServe = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      id: ordering !== null ? ordering?.id : null,
    };

    dispatch(setIsNotMatch(hasOrderChanged(ordering?.order, payload?.order)));
    dispatch(setPayloadData(payload));
    dispatch(setServe(true));
  };

  const handleReturn = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setReset(true));
  };

  const handleReject = async () => {
    const payload = {
      ...mapOrderingPayload(getValues()),
      customer: { ...ordering?.customer },

      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setArchive(true));
  };

  const mapTransaction = (product, tdo, customerData) => {
    if (hasRun) return;

    const data = {
      ...mapOrderingData(
        ordering,
        customers,
        [...product, ...productData],
        tdo,
        customerData,
      ),
    };

    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });

    dispatch(setHasRun(true));
  };

  const handleCheckMaterial = async (fetchedCustomer) => {
    const priceMode = fetchedCustomer?.find(
      (cust) => cust?.id?.toString() === ordering?.customer?.code,
    );
    if (!ordering?.order || ordering.order.length === 0) {
      return { isValid: false, fetchedMaterials: [] };
    }

    const newlyFetchedMaterials = [];

    try {
      const results = await Promise.all(
        ordering.order.map(async (mats) => {
          const productName = mats?.material?.name;
          const productCode = mats?.material?.code;

          if (productData?.some((item) => item?.itemCode === productCode)) {
            return true;
          }

          try {
            const firstAttempt = await getProduct({
              isActive: true,
              search: productName,
              PriceModeId: priceMode?.priceModeId,
            }).unwrap();

            const matchedItem = firstAttempt?.value?.items?.find(
              (item) => item?.itemCode === productCode,
            );

            if (matchedItem) {
              newlyFetchedMaterials.push(matchedItem);
              return true;
            }
            throw new Error("No exact match by name");
          } catch (error) {
            enqueueSnackbar(
              `Product "${productName}" not found or ambiguous, retrying with code...`,
              { variant: "info" },
            );

            try {
              const secondAttempt = await getProduct({
                isActive: true,
                search: productCode,
                PriceModeId: priceMode?.priceModeId,
              }).unwrap();

              const matchedItemCode = secondAttempt?.value?.items?.find(
                (item) => item?.itemCode === productCode,
              );

              if (matchedItemCode) {
                newlyFetchedMaterials.push(matchedItemCode);
                return true;
              }
              return false;
            } catch (secondError) {
              enqueueSnackbar(`Product "${productCode}" completely missing.`, {
                variant: "error",
              });
              dispatch(resetModal());
              return false;
            }
          }
        }),
      );

      const isValid = results.every((res) => res === true);

      return { isValid, fetchedMaterials: newlyFetchedMaterials };
    } catch (err) {
      return { isValid: false, fetchedMaterials: [] };
    }
  };

  const handleCheckCustomer = async () => {
    try {
      const getDistributionTypeId = tdoData?.find(
        (tdo) => tdo?.id === user?.tdo,
      )?.distributionTypeId;

      const fetchedTdo = await getTdo({
        isActive: true,
        distributionTypeId: getDistributionTypeId,
      }).unwrap();

      const fetchedCustomer = await getClient({
        isActive: true,
        DistriTypeId: getDistributionTypeId,
      }).unwrap();

      return {
        isValid: true,
        fetchedTdo: [...fetchedTdo?.value?.tdos],
        fetchedCustomer: [...fetchedCustomer?.value?.clients],
      };
    } catch (error) {
      console.error("Failed fetching Customer or TDO data", error);
      enqueueSnackbar("Failed to fetch required customer/TDO data.", {
        variant: "error",
      });
      return { isValid: false, fetchedTdo: null, fetchedCustomer: null };
    }
  };

  useEffect(() => {
    if (charging?.result) {
      dispatch(setChargingData(charging?.result));
    }
    if (chargingFetch?.result?.data) {
      dispatch(setChargingData(chargingFetch?.result?.data));
    }
  }, [charging, chargingFetch]);

  useEffect(() => {
    if (!ordering && tdoData?.length !== 0) {
      setValue(
        "tdo",
        tdoData?.find((tdo) => tdo?.id === user?.tdo),
      );
      setValue("type", {
        id: watch("tdo")?.distributionTypeId,
        name: watch("tdo")?.distributionType,
      });
    }
  }, [ordering, tdoData]);

  useEffect(() => {
    const initializeOrderData = async () => {
      if (!ordering) return;

      const { isValid, fetchedTdo, fetchedCustomer } =
        await handleCheckCustomer();
      if (!isValid) return;

      const { isValid: isMaterialValid, fetchedMaterials } =
        await handleCheckMaterial(fetchedCustomer);
      if (!isMaterialValid) return;

      if (
        !hasRun &&
        (viewOrdering ||
          createOrdering ||
          updateOrdering ||
          approveOrdering ||
          serveOrdering)
      ) {
        mapTransaction(fetchedMaterials, fetchedTdo, fetchedCustomer);
      }
    };

    initializeOrderData();
  }, [
    ordering,
    viewOrdering,
    createOrdering,
    updateOrdering,
    approveOrdering,
    serveOrdering,
  ]);

  useEffect(() => {
    if (
      !viewOrdering &&
      !createOrdering &&
      !updateOrdering &&
      !approveOrdering
    ) {
      reset();
    }
  }, [viewOrdering, createOrdering, updateOrdering, approveOrdering]);

  useEffect(() => {
    if (customers?.length === 1 && !hasRun && createOrdering) {
      setValue("charging", customers[0]);

      getCharging({
        status: "active",
        search: customers[0]?.charging_code,
      });

      dispatch(setHasRun(true));
    }
  }, [customers, hasRun, createOrdering]);

  useEffect(() => {
    if (viewOrdering || createOrdering || updateOrdering || approveOrdering) {
      runGetTDO();
    }
  }, [viewOrdering, createOrdering, updateOrdering, approveOrdering]);

  const runGetTDO = async () => {
    try {
      const res = await getTdo({
        isActive: true,
        search: user?.tdo_name,
      }).unwrap();
    } catch (error) {
      enqueueSnackbar("Failed to establish a connection to Arcana.", {
        variant: "warning",
      });
    }
  };

  const handleClose = () => {
    dispatch(clearCustomerData());
    resetClient();
    resetTDO();
    resetProduct();
  };

  return (
    <Dialog
      open={
        viewOrdering ||
        createOrdering ||
        updateOrdering ||
        approveOrdering ||
        serveOrdering
      }
      onClose={() => {
        handleClose();
        dispatch(setHasRun(false));
        viewOrdering && reset();
        !viewOrdering && dispatch(setWarning(true));
        viewOrdering && dispatch(resetModal());
      }}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "80%",
          // minHeight: "%",
          maxHeight: "88%",
          borderRadius: 2,
          paddingTop: 2,
        },
      }}
    >
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack position={"absolute"} top={0} right={2}>
            <IconButton
              onClick={() => {
                dispatch(setWarning(true));
              }}
            >
              <CloseIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Stack>
          <Stack gap={1}>
            <Divider orientation="horizontal" />
            {loadingTDO || loadingClient ? (
              <MobileLoading />
            ) : (
              <OrderingFields
                control={control}
                errors={errors}
                watch={watch}
                setValue={setValue}
              />
            )}

            {loadingTDO || loadingClient || loadingProduct ? (
              <MobileLoading />
            ) : (
              <OrderingProducts
                watch={watch}
                control={control}
                errors={errors}
                setValue={setValue}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Stack
            position={"sticky"}
            bottom={15}
            right={0}
            alignItems={"flex-end"}
            padding={1}
          >
            {(createOrdering || updateOrdering) &&
              !loadingTDO &&
              !loadingClient && (
                <Stack flexDirection={"row"} gap={1} alignItems="center">
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    disabled={
                      fields.length === 0 ||
                      (watch("order") || []).some(
                        (item) =>
                          !item?.material ||
                          item?.quantity === null ||
                          item?.quantity === "",
                      ) ||
                      watch("order_no") === "" ||
                      watch("date_needed") === null ||
                      watch("charging") === null ||
                      watch("customer") === null ||
                      loadingProduct
                    }
                    startIcon={<ShoppingCartCheckoutOutlinedIcon />}
                    size="small"
                    sx={{
                      textTransform: "uppercase",
                    }}
                  >
                    Check out
                  </Button>
                  {updateOrdering && !loadingTDO && !loadingClient && (
                    <Button
                      disabled={loadingProduct}
                      variant="contained"
                      color="error"
                      startIcon={<DeleteForeverOutlinedIcon />}
                      size="small"
                      sx={{
                        textTransform: "uppercase",
                      }}
                      onClick={() => {
                        handleReject();
                      }}
                    >
                      Archive
                    </Button>
                  )}
                </Stack>
              )}

            {approveOrdering && !loadingTDO && !loadingClient && (
              <Stack flexDirection={"row"} gap={2} alignItems="center">
                <Button
                  disabled={loadingProduct}
                  variant="contained"
                  color="success"
                  type="submit"
                  startIcon={<ThumbUpOutlinedIcon />}
                  size="small"
                >
                  Approve
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<UpdateOutlinedIcon />}
                  size="small"
                  onClick={() => {
                    handleReturn();
                  }}
                >
                  Return
                </Button>
                <Button
                  disabled={loadingProduct}
                  variant="contained"
                  color="error"
                  startIcon={<RemoveCircleOutlineOutlinedIcon />}
                  size="small"
                  onClick={() => {
                    handleReject();
                  }}
                >
                  Reject
                </Button>
              </Stack>
            )}

            {serveOrdering && !loadingTDO && !loadingClient && (
              <Stack flexDirection={"row"} gap={2} alignItems="center">
                {access?.includes("order_taker") && (
                  <Button
                    disabled={loadingProduct}
                    variant="contained"
                    color="success"
                    startIcon={<ThumbUpOutlinedIcon />}
                    size="small"
                    onClick={() => {
                      handleServe();
                    }}
                  >
                    Consolidate
                  </Button>
                )}
              </Stack>
            )}
          </Stack>
        </DialogActions>
      </form>

      <EnterRemarks
        currentValue={watch(`order.${selectedIndex}.remarks`)}
        open={openRemarks}
        submitData={(e) => {
          setValue(`order.${selectedIndex}.remarks`, e);
        }}
        setOpen={setOpenRemarks}
      />

      <CreateOrderPrompt resetFn={handleClose} />

      <AppPrompt
        open={warning}
        image={warningImg}
        title={`Warning`}
        message={`All changes that have not been saved will be discarded upon closing.`}
        confirmButton={`Yes, Close it!`}
        cancelButton={`No, Keep it! `}
        confirmOnClick={() => {
          handleClose();
          dispatch(resetPrompt());
          reset();
          dispatch(resetModal());
        }}
      />
    </Dialog>
  );
};

export default OrderingModal;
