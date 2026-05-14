import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPrompt } from "../../services/server/slice/promptSlice";

import SwapHorizontalCircleOutlinedIcon from "@mui/icons-material/SwapHorizontalCircleOutlined";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import TableGrid from "./TableGrid";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "../../services/server/api/orderingAPI";
import { useSnackbar } from "notistack";
import { resetModal } from "../../services/server/slice/modalSlice";
import { singleError } from "../../services/functions/errorResponse";
import {
  useApproveOrderMutation,
  useRejectOrderMutation,
  useReturnOrderMutation,
} from "../../services/server/api/approverAPI";
import nameOnlySchema from "../schema/nameOnlySchema";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import AppTextBox from "./AppTextBox";
import {
  useServeOrderMutation,
  useServeUpdateOrderMutation,
} from "../../services/server/api/orderTakerAPI";
import {
  clearCustomerData,
  resetValues,
} from "../../services/server/slice/valuesSlice";

const CreateOrderPrompt = ({ resetFn = () => {} }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const create = useSelector((state) => state.prompt.create);
  const update = useSelector((state) => state.prompt.update);
  const approve = useSelector((state) => state.prompt.approve);
  const serve = useSelector((state) => state.prompt.serve);
  const archive = useSelector((state) => state.prompt.archive);
  const reset = useSelector((state) => state.prompt.reset);
  const isNotMatched = useSelector((state) => state.prompt.isNotMatched);

  const payloadData = useSelector((state) => state.prompt.payloadData);
  const ordering = useSelector((state) => state.modal.ordering);

  const mapOrder = { data: payloadData?.order };

  const [createOrder, { isLoading: loadingCreate }] = useCreateOrderMutation();
  const [updateOrder, { isLoading: loadingUpdate }] = useUpdateOrderMutation();
  const [returnOrder, { isLoading: loadingReturn }] = useReturnOrderMutation();
  const [rejectOrder, { isLoading: loadingReject }] = useRejectOrderMutation();
  const [serveOrder, { isLoading: loadingServe }] = useServeOrderMutation();
  const [updateServeOrder, { isLoading: loadingUpdateServe }] =
    useServeUpdateOrderMutation();

  const [approveOrder, { isLoading: loadingApprove }] =
    useApproveOrderMutation();

  const header = [
    { name: "No.", type: "index" },
    { name: "Code", value: "material", child: "code", type: "parent" },
    { name: "Material", value: "material", child: "name", type: "parent" },
    { name: "Uom", value: "uom", child: "description", type: "parent" },
    { name: "Quantity", value: "quantity" },
    { name: "Remarks", value: "remarks" },
  ];

  const {
    control,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(nameOnlySchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = async () => {
    try {
      const res =
        ordering === null
          ? await createOrder({ ...payloadData, status: "PENDING" }).unwrap()
          : await updateOrder({ ...payloadData, status: "PENDING" }).unwrap();
      enqueueSnackbar(res?.message, {
        variant: "success",
      });
      dispatch(clearCustomerData());

      resetFn?.();
      dispatch(resetPrompt());
      dispatch(resetModal());
    } catch (error) {
      console.log(error);
      singleError(error, enqueueSnackbar);
    }
  };

  const handleApproveOrder = async () => {
    const payload = {
      ...payloadData,
    };

    try {
      const res = await approveOrder(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      resetFn?.();
      dispatch(resetPrompt());
      dispatch(resetModal());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handleResetOrder = async () => {
    const payload = {
      ...payloadData,
      reason: watch("name"),
    };

    if (watch("name") === "") {
      setError("name", {
        type: "validation",
        message: "Remarks is required",
      });
    } else {
      try {
        const res = await returnOrder(payload).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetPrompt());
        dispatch(resetModal());
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    }
  };

  const handleRejectOrder = async () => {
    const payload = {
      ...payloadData,
      reason: watch("name"),
    };

    if (watch("name") === "") {
      setError("name", {
        type: "validation",
        message: "Remarks is required",
      });
    } else {
      try {
        const res = await rejectOrder(payload).unwrap();
        enqueueSnackbar(res?.message, { variant: "success" });
        dispatch(resetPrompt());
        dispatch(resetModal());
      } catch (error) {
        singleError(error, enqueueSnackbar);
      }
    }
  };

  const handleServe = async () => {
    const payload = {
      ...payloadData,
    };

    try {
      if (isNotMatched) {
        await updateServeOrder(payload).unwrap();
      }
      const res = await serveOrder(payload).unwrap();
      enqueueSnackbar(res?.message, { variant: "success" });
      dispatch(resetPrompt());
      dispatch(resetModal());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const totalAmount = payloadData?.order?.reduce((sum, item) => {
    const rawPrice = Number(
      String(item?.selling_price || "0").replace(/,/g, ""),
    );
    const rawQty = Number(String(item?.quantity || "0").replace(/,/g, ""));
    return sum + rawPrice * rawQty;
  }, 0);
  const vatAmount = totalAmount * 0.12;

  const discountPercentage =
    Number(String(payloadData?.customer?.discountReg).replace(/%/g, "")) +
    Number(String(payloadData?.customer?.discountSpecial).replace(/%/g, ""));

  const totalDiscount = (totalAmount + vatAmount) * (discountPercentage / 100);
  const grandTotal = totalAmount + vatAmount - totalDiscount;

  return (
    <Dialog
      open={create || update || archive || reset || approve || serve}
      onClose={() => dispatch(resetPrompt())}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "80%",
          borderRadius: 2,
          overflowY: "hidden",
          paddingTop: 2,
        },
      }}
    >
      <DialogContent
        sx={{ minHeight: `${reset || archive ? "400px" : "200px"}` }}
      >
        <Stack gap={1}>
          <Typography fontWeight={700} fontSize={20}>
            {approve && "Approve Order"}
            {create && "Create Order"}
            {update && "Update Order"}
            {reset && "Return Order"}
            {archive && "Archive/Reject Order"}
            {serve && "Serve Order"}
          </Typography>
          <Typography>
            Would you like to {approve && "approve"}
            {create && "create"}
            {update && "update"}
            {reset && "return"}
            {archive && "archive/reject"}
            {serve && "serve"} this order?
          </Typography>

          <TableGrid header={header} items={mapOrder} />
          <Stack>
            <Stack
              justifyContent={"space-between"}
              // flexDirection={"row-reverse"}
            >
              {/* <Box
                sx={{
                  width: "300px",
                  p: 2,
                  bgcolor: "#fff",
                  border: "1px solid #A0A0A0",
                  borderRadius: 1,
                  boxShadow: "0px 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₱{" "}
                      {totalAmount?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2, // <-- Added this
                      })}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      VAT (12%)
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      ₱{" "}
                      {vatAmount?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2, // <-- Added this
                      })}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Total Discount ({discountPercentage}%)
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      color="error.main"
                    >
                      - ₱{" "}
                      {totalDiscount?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2, // <-- Added this
                      })}
                    </Typography>
                  </Stack>

                  <Divider sx={{ my: 1, borderColor: "#d1d1d1" }} />

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle1" fontWeight={700}>
                      Grand Total
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={800}
                      color="primary.main"
                    >
                      ₱{" "}
                      {grandTotal?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2, // <-- Added this
                      })}
                    </Typography>
                  </Stack>
                </Stack>
              </Box> */}
              <Stack>
                <Typography>{`Date Needed: ${payloadData?.date_needed}`}</Typography>
                <Typography>{`Customer Code: ${payloadData?.customer?.code}`}</Typography>
                <Typography>{`Customer: ${payloadData?.customer?.id} - ${payloadData?.customer?.fullName}`}</Typography>
                <Typography>{`Deliver to: ${payloadData?.customer?.businessAddress}`}</Typography>
                <Typography>{`TIN: ${payloadData?.customer?.tinNumber}`}</Typography>

                <Typography>{`P.O. No.: ${payloadData?.customer?.poNumber || ""}`}</Typography>
              </Stack>
            </Stack>
          </Stack>

          {(reset || archive) && (
            <Stack>
              <AppTextBox
                control={control}
                name="name"
                label="Remarks"
                placeholder="Enter remarks here"
                multiline
                rows={2}
                error={Boolean(errors?.name)}
                helperText={errors?.name?.message}
              />
            </Stack>
          )}
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
            onClick={() => {
              (create || update) && handleSubmit();
              reset && handleResetOrder();
              archive && handleRejectOrder();
              approve && handleApproveOrder();
              serve && handleServe();
            }}
            className="change-password-button"
            loading={
              loadingCreate ||
              loadingUpdate ||
              loadingApprove ||
              loadingReject ||
              loadingServe ||
              loadingUpdateServe ||
              loadingReturn
            }
            loadingPosition="start"
            startIcon={<SwapHorizontalCircleOutlinedIcon />}
            variant="contained"
            size="small"
            color="success"
          >
            Yes, {approve && "approve"}
            {create && "create"}
            {update && "update"}
            {reset && "return"}
            {archive && "archive"}
            {serve && "serve"} it!
          </Button>
          <Button
            className="change-password-button"
            disabled={
              loadingCreate ||
              loadingUpdate ||
              loadingApprove ||
              loadingReject ||
              loadingServe ||
              loadingUpdateServe ||
              loadingReturn
            }
            onClick={() => {
              dispatch(resetPrompt());
            }}
            loadingPosition="start"
            startIcon={<DoDisturbAltOutlinedIcon />}
            variant="contained"
            size="small"
            color="error"
          >
            No, discard
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default CreateOrderPrompt;
