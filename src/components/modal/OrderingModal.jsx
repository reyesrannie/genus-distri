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
  DialogTitle,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setForApproval,
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
  setProductData,
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
import { canUpdateOrder } from "../../services/constant/checkValue";

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
  const poOrder = useSelector((state) => state.modal.poOrder);

  const productData = useSelector((state) => state.values.productData);
  const tdoData = useSelector((state) => state.values.tdoData);

  const hasRun = useSelector((state) => state.modal.hasRun);

  const viewOrdering = useSelector((state) => state.modal.viewOrdering);
  const ordering = useSelector((state) => state.modal.ordering);
  const selectedIndex = useSelector((state) => state.modal.selectedIndex);
  const chargingData = useSelector((state) => state.values.chargingData);
  const warning = useSelector((state) => state.prompt.warning);
  const forApproval = useSelector((state) => state.modal.forApproval);

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
      last_date_delivery: null,
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
      order_type: poOrder ? "BATCHING" : "REGULAR",
      charging: approveOrdering
        ? submitData?.charging
        : chargingData?.find(
            (charge) => charge?.code === submitData?.charging?.charging_code,
          ),
    };

    const payload = {
      ...mapOrderingPayload({
        ...items,
      }),
      id: ordering !== null ? ordering?.id : null,
    };

    dispatch(setPayloadData(payload));
    createOrdering && dispatch(setCreate(true));
    updateOrdering && dispatch(setUpdate(true));
    approveOrdering && dispatch(setApprove(true));
  };

  const handleServe = async () => {
    const payload = {
      ...mapOrderingPayload({
        ...getValues(),
        order_type: poOrder ? "BATCHING" : "REGULAR",
      }),
      id: ordering !== null ? ordering?.id : null,
    };

    dispatch(setIsNotMatch(hasOrderChanged(ordering?.order, payload?.order)));
    dispatch(setPayloadData(payload));
    dispatch(setServe(true));
  };

  const handleReturn = async () => {
    const payload = {
      ...mapOrderingPayload({
        ...getValues(),
        order_type: poOrder ? "BATCHING" : "REGULAR",
      }),
      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setReset(true));
  };

  const handleReject = async () => {
    const payload = {
      ...mapOrderingPayload({
        ...getValues(),
        order_type: poOrder ? "BATCHING" : "REGULAR",
      }),
      customer: { ...ordering?.customer },

      id: ordering !== null ? ordering?.id : null,
    };
    dispatch(setPayloadData(payload));
    dispatch(setArchive(true));
  };

  const mapTransaction = (tdo, customerData) => {
    if (hasRun) return;

    const data = {
      ...mapOrderingData(
        ordering,
        customers,
        customerData?.clientItems,
        tdo,
        customerData,
      ),
    };
    Object.entries(data).forEach(([key, value]) => {
      setValue(key, value);
    });
    handleItemForApproval();
    dispatch(setHasRun(true));
  };

  const handleCheckMaterial = async (fetchedCustomer) => {
    dispatch(setProductData(watch("customer")?.clientItems));
    return true;
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
        PageSize: 100,
        DistriTypeId: getDistributionTypeId,
        TDOId: user?.tdo,
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

      getClient({
        isActive: true,
        PageSize: 100,
        DistriTypeId: watch("tdo")?.distributionTypeId,
        TDOId: watch("tdo")?.id,
      });
    }
  }, [ordering, tdoData]);

  useEffect(() => {
    const initializeOrderData = async () => {
      if (!ordering) return;

      const { isValid, fetchedTdo, fetchedCustomer } =
        await handleCheckCustomer();
      if (!isValid) return;

      // const { isValid: isMaterialValid, fetchedMaterials } =
      //   await handleCheckMaterial(fetchedCustomer);
      // if (!isMaterialValid) return;

      if (
        !hasRun &&
        (viewOrdering ||
          createOrdering ||
          updateOrdering ||
          approveOrdering ||
          serveOrdering)
      ) {
        mapTransaction(
          fetchedTdo,
          fetchedCustomer?.find(
            (cust) =>
              cust?.id?.toString() === ordering?.customer?.code.toString(),
          ),
        );
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

  const handleItemForApproval = () => {
    const discountPercentage =
      Number(String(watch("reg_discount") || "0").replace(/%/g, "")) +
      Number(String(watch("sp_discount") || "0").replace(/%/g, ""));

    const projectedTotalAmount = watch("order")?.reduce((sum, item, idx) => {
      const itemPrice = Number(String(item?.price || "0").replace(/,/g, ""));
      const itemQty = Number(String(item?.quantity || "0").replace(/,/g, ""));
      return sum + itemPrice * itemQty;
    }, 0);

    const projectedDiscount = projectedTotalAmount * (discountPercentage / 100);
    const total = projectedTotalAmount - projectedDiscount;

    const {
      creditType,
      remainingCredits: c,
      remainingDays: d,
      creditLimit,
      remainigDayAllowance,
      remainingDayLimit,
      remainingCreditLimit,
      remainingCreditAllowance,
    } = watch("customer") || {};

    const isCOD = watch("customer")?.creditType === null;
    if (isCOD) {
      dispatch(setForApproval(false));
    } else if (creditType === "Credit - Days") {
      dispatch(
        setForApproval(
          d <= 0 && remainigDayAllowance <= 0 && remainingDayLimit <= 0
            ? true
            : false,
        ),
      );
    } else if (
      creditType === "Regular Credit" ||
      creditType === "Credit - Amount"
    ) {
      dispatch(
        setForApproval(
          (c <= 0 &&
            remainingCreditLimit <= 0 &&
            remainingCreditAllowance <= 0) ||
            (creditType === "Regular Credit" &&
              d <= 0 &&
              remainigDayAllowance <= 0 &&
              remainingDayLimit <= 0) ||
            total > c
            ? true
            : false,
        ),
      );
    }
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
          maxHeight: "88%",
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "primary.main",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 600,
            color: "white",
          }}
        >
          {poOrder ? "PO Order" : "Order"}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack position={"absolute"} top={0} right={2}>
            <IconButton
              sx={{
                color: "white",
              }}
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
                      !canUpdateOrder(watch("date_needed")) ||
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
                      loadingProduct ||
                      (poOrder && watch("last_date_delivery") === null)
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
