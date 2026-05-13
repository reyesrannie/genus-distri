import {
  Stack,
  Typography,
  TextField as MuiTextField,
  Divider,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Autocomplete from "../../custom/AutoComplete";
import { useDispatch, useSelector } from "react-redux";
import { useLazyProductQuery } from "../../../services/server/api/arcana/arcanaAPI";
import { useDebounceCallback } from "../../../services/hooks/useDebounceCallBack";
import AppTextBox from "../../custom/AppTextBox";
import { setSelectedIndex } from "../../../services/server/slice/modalSlice";
import EnterRemarks from "../../custom/EnterRemarks";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";
import { useFieldArray } from "react-hook-form";
import { enqueueSnackbar } from "notistack";

const OrderingProducts = ({ watch, control, errors, setValue }) => {
  const dispatch = useDispatch();
  const [openRemarks, setOpenRemarks] = useState(false);

  const selectedIndex = useSelector((state) => state.modal.selectedIndex);
  const createOrdering = useSelector((state) => state.modal.createOrdering);
  const updateOrdering = useSelector((state) => state.modal.updateOrdering);
  const approveOrdering = useSelector((state) => state.modal.approveOrdering);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);
  const viewOrdering = useSelector((state) => state.modal.viewOrdering);
  const productData = useSelector((state) => state.values.productData);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "order",
  });

  const [getProduct, { data: dataCheck, isFetching: fetchingProductArcana }] =
    useLazyProductQuery();

  const handleSearchArcana = useDebounceCallback((searchValue) => {
    getProduct({
      isActive: true,
      search: searchValue,
      PriceModeId: 1,
    });
  }, 500);

  const currentOrders = watch("order") || [];

  const totalAmount = currentOrders.reduce((sum, item) => {
    const rawPrice = Number(String(item?.price || "0").replace(/,/g, ""));
    const rawQty = Number(String(item?.quantity || "0").replace(/,/g, ""));
    return sum + rawPrice * rawQty;
  }, 0);

  const vatAmount = totalAmount * 0.12;
  const discountPercentage =
    Number(String(watch("reg_discount") || "0").replace(/%/g, "")) +
    Number(String(watch("sp_discount") || "0").replace(/%/g, ""));

  const totalDiscount = (totalAmount + vatAmount) * (discountPercentage / 100);
  const grandTotal = totalAmount + vatAmount - totalDiscount;

  useEffect(() => {
    const currentOrders = watch("order") || [];

    if (currentOrders.length > 0 && productData && productData.length > 0) {
      currentOrders.forEach((item, index) => {
        if (item.material && item.material.itemCode) {
          const updatedProduct = productData.find(
            (p) => p.itemCode === item.material.itemCode,
          );

          if (updatedProduct) {
            const newRawPrice = Number(updatedProduct.currentPrice || 0);

            const rawQty = Number(
              String(item.quantity || "0").replace(/,/g, ""),
            );

            const newTotal = newRawPrice * rawQty;

            setValue(
              `order.${index}.price`,
              newRawPrice.toLocaleString("en-US"),
            );
            setValue(
              `order.${index}.selling_price`,
              newTotal.toLocaleString("en-US"),
            );

            // setValue(`order.${index}.material`, updatedProduct);
          }
        }
      });
    }
  }, [productData, setValue]);

  const customer = watch("customer");

  const isCOD = customer?.terms === "COD";
  const hasAmountLimit = customer?.creditLimit != null;
  const hasDaysLimit = customer?.daysLimit != null;
  const isAmountExceeded = hasAmountLimit && customer?.remainingCredits <= 0;
  const isDaysExceeded = hasDaysLimit && customer?.hasRemainingDays === false;
  const canOrder = isCOD ? true : !(isAmountExceeded || isDaysExceeded);

  return (
    <Stack gap={1}>
      <Stack
        sx={{
          border: "1px solid #A0A0A0",
          display: "flex",
          flexDirection: "column",
          padding: 2,
          bgcolor: "#F5F5F5",
        }}
      >
        <Typography fontWeight={700}>Cart</Typography>

        {fields.map((item, index) => {
          return (
            <Stack key={item?.id} gap={1}>
              <Stack
                paddingLeft={1}
                gap={1}
                flexDirection="row"
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Autocomplete
                  fullWidth
                  disabled={
                    approveOrdering ||
                    viewOrdering ||
                    serveOrdering ||
                    !canOrder
                  }
                  loading={fetchingProductArcana}
                  control={control}
                  name={`order.${index}.material`}
                  options={productData || []}
                  getOptionLabel={(option) =>
                    `${option?.itemCode} - ${option?.itemDescription}`
                  }
                  isOptionEqualToValue={(option, value) =>
                    option?.itemCode === value?.itemCode
                  }
                  getOptionDisabled={(option) => {
                    return watch("order")?.some(
                      (order) => order.material?.itemCode === option.itemCode,
                    );
                  }}
                  onKeyUp={(e) => {
                    handleSearchArcana(e?.target?.value);
                  }}
                  onClose={() => {
                    const selectedMaterial = watch(`order.${index}.material`);
                    const rawPrice = Number(
                      selectedMaterial?.currentPrice || 0,
                    );

                    setValue(
                      `order.${index}.price`,
                      rawPrice.toLocaleString("en-US"),
                    );

                    const rawQty = Number(
                      String(watch(`order.${index}.quantity`) || "0").replace(
                        /,/g,
                        "",
                      ),
                    );

                    const total = rawPrice * rawQty;

                    setValue(
                      `order.${index}.selling_price`,
                      total.toLocaleString("en-US"),
                    );
                    setValue(`order.${index}.uom`, {
                      code: watch(`order.${index}.material`)?.uomCode,
                      description: watch(`order.${index}.material`)
                        ?.uomDescription,
                    });
                  }}
                  renderInput={(params) => (
                    <MuiTextField
                      {...params}
                      size="small"
                      label="Product"
                      variant="filled"
                      error={
                        Boolean(errors.order?.[index]?.material) ||
                        Boolean(errors.order?.[index]?.material?.code)
                      }
                      helperText={
                        errors.order?.[index]?.material?.message ||
                        errors.order?.[index]?.material?.code?.message
                      }
                    />
                  )}
                />
                <AppTextBox
                  price
                  disabled={
                    approveOrdering ||
                    viewOrdering ||
                    serveOrdering ||
                    !canOrder
                  }
                  control={control}
                  name={`order.${index}.price`}
                  size="small"
                  variant="filled"
                  label="Selling Price"
                  sx={{
                    maxWidth: "100px",
                    "& .MuiFilledInput-input": {
                      fontSize: "12px",
                    },
                  }}
                  onKeyUp={(e) => {
                    const rawPrice = Number(
                      String(e.target.value || "0").replace(/,/g, ""),
                    );
                    const rawQty = Number(
                      String(watch(`order.${index}.quantity`) || "0").replace(
                        /,/g,
                        "",
                      ),
                    );

                    const newRowTotal = rawPrice * rawQty;

                    const currentOrdersForProjected = watch("order") || [];
                    const projectedTotalAmount =
                      currentOrdersForProjected.reduce((sum, item, idx) => {
                        if (idx === index) {
                          return sum + newRowTotal;
                        }
                        const itemPrice = Number(
                          String(item?.price || "0").replace(/,/g, ""),
                        );
                        const itemQty = Number(
                          String(item?.quantity || "0").replace(/,/g, ""),
                        );
                        return sum + itemPrice * itemQty;
                      }, 0);

                    const projectedVat = projectedTotalAmount * 0.12;
                    const projectedDiscount =
                      (projectedTotalAmount + projectedVat) *
                      (discountPercentage / 100);
                    const projectedGrandTotal =
                      projectedTotalAmount + projectedVat - projectedDiscount;

                    // --- LOGIC APPLIED HERE AS WELL ---
                    const isCOD = customer?.terms === "COD";
                    const hasAmountLimit = customer?.creditLimit != null;

                    if (
                      !isCOD &&
                      hasAmountLimit &&
                      projectedGrandTotal > customer?.remainingCredits
                    ) {
                      setValue(`order.${index}.quantity`, "");
                      setValue(`order.${index}.selling_price`, "");

                      enqueueSnackbar(
                        `Credit limit reached! Available balance: ₱${customer?.remainingCredits?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                        { variant: "warning" },
                      );
                    } else {
                      const formattedTotal = newRowTotal.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      );
                      setValue(`order.${index}.selling_price`, formattedTotal);
                    }
                  }}
                  icon={<Typography>₱</Typography>}
                  error={Boolean(errors.order?.[index]?.price)}
                  helperText={errors.order?.[index]?.price?.message}
                />
                <AppTextBox
                  price
                  disabled={
                    approveOrdering ||
                    viewOrdering ||
                    serveOrdering ||
                    !canOrder
                  }
                  control={control}
                  name={`order.${index}.quantity`}
                  size="small"
                  variant="filled"
                  label="Quantity"
                  sx={{
                    "& .MuiFilledInput-input": {
                      fontSize: "12px",
                    },
                  }}
                  onKeyUp={(e) => {
                    const rawPrice = Number(
                      String(watch(`order.${index}.price`) || "0").replace(
                        /,/g,
                        "",
                      ),
                    );
                    const rawQty = Number(
                      String(e.target.value || "0").replace(/,/g, ""),
                    );

                    const newRowTotal = rawPrice * rawQty;

                    const currentOrdersForProjected = watch("order") || [];
                    const projectedTotalAmount =
                      currentOrdersForProjected.reduce((sum, item, idx) => {
                        if (idx === index) {
                          return sum + newRowTotal;
                        }
                        const itemPrice = Number(
                          String(item?.price || "0").replace(/,/g, ""),
                        );
                        const itemQty = Number(
                          String(item?.quantity || "0").replace(/,/g, ""),
                        );
                        return sum + itemPrice * itemQty;
                      }, 0);

                    const projectedVat = projectedTotalAmount * 0.12;
                    const projectedDiscount =
                      (projectedTotalAmount + projectedVat) *
                      (discountPercentage / 100);
                    const projectedGrandTotal =
                      projectedTotalAmount + projectedVat - projectedDiscount;

                    // --- LOGIC APPLIED HERE AS WELL ---
                    const isCOD = customer?.terms === "COD";
                    const hasAmountLimit = customer?.creditLimit != null;

                    if (
                      !isCOD &&
                      hasAmountLimit &&
                      projectedGrandTotal > customer?.remainingCredits
                    ) {
                      setValue(`order.${index}.quantity`, "");
                      setValue(`order.${index}.selling_price`, "");

                      enqueueSnackbar(
                        `Credit limit reached! Available balance: ₱${customer?.remainingCredits?.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
                        { variant: "warning" },
                      );
                    } else {
                      const formattedTotal = newRowTotal.toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        },
                      );
                      setValue(`order.${index}.selling_price`, formattedTotal);
                    }
                  }}
                  endIcon={
                    <Typography>
                      {watch(`order.${index}.material`)?.uom?.code}
                    </Typography>
                  }
                  error={Boolean(errors.order?.[index]?.quantity)}
                  helperText={errors.order?.[index]?.quantity?.message}
                />
                <AppTextBox
                  disabled={true}
                  control={control}
                  name={`order.${index}.selling_price`}
                  size="small"
                  variant="filled"
                  label="Amount"
                  sx={{
                    "& .MuiFilledInput-input": {
                      fontSize: "12px",
                    },
                  }}
                  icon={<Typography>₱</Typography>}
                  error={Boolean(errors.order?.[index]?.selling_price)}
                  helperText={errors.order?.[index]?.selling_price?.message}
                />
                <AppTextBox
                  disabled={
                    approveOrdering ||
                    viewOrdering ||
                    serveOrdering ||
                    !canOrder
                  }
                  control={control}
                  name={`order.${index}.remarks`}
                  size="small"
                  variant="filled"
                  sx={{
                    minWidth: "100px",
                    "& .MuiFilledInput-root": {
                      backgroundColor: "#0000001f",
                    },
                    "& .MuiFilledInput-input": {
                      fontSize: "12px",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      cursor: "pointer",
                    },
                  }}
                  label="Remarks"
                  onClick={() => {
                    dispatch(setSelectedIndex(index));
                    setOpenRemarks(true);
                  }}
                  inputProps={{
                    readOnly: true,
                  }}
                  error={Boolean(errors.order?.[index]?.remarks)}
                  helperText={errors.order?.[index]?.remarks?.message}
                />
                {(createOrdering || updateOrdering) && (
                  <IconButton
                    disabled={watch("order")?.length === 1}
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <RemoveCircleOutlineOutlinedIcon
                      color={
                        watch("order")?.length === 1 ? "disabled" : `error`
                      }
                    />
                  </IconButton>
                )}
              </Stack>
              <Divider
                orientation="horizontal"
                sx={{
                  borderColor: "#A0A0A0",
                  marginBottom: 1.5,
                }}
              />
            </Stack>
          );
        })}
        {(createOrdering || updateOrdering) && (
          <Button
            disabled={!canOrder}
            variant="contained"
            onClick={() => {
              append({
                id: new Date(),
              });
            }}
          >
            Add Order
          </Button>
        )}
      </Stack>
      {/* <Stack alignItems="flex-end">
        <Box
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
                {totalAmount.toLocaleString("en-US", {
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
                {vatAmount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2, // <-- Added this
                })}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Total Discount ({discountPercentage}%)
              </Typography>
              <Typography variant="body2" fontWeight={600} color="error.main">
                - ₱{" "}
                {totalDiscount.toLocaleString("en-US", {
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
              <Typography variant="h6" fontWeight={800} color="primary.main">
                ₱{" "}
                {grandTotal.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2, // <-- Added this
                })}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Stack> */}
      <EnterRemarks
        currentValue={watch(`order.${selectedIndex}.remarks`)}
        open={openRemarks}
        submitData={(e) => {
          setValue(`order.${selectedIndex}.remarks`, e);
        }}
        setOpen={setOpenRemarks}
      />
    </Stack>
  );
};

export default OrderingProducts;
