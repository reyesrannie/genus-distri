import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setViewBatch,
} from "../../services/server/slice/modalSlice";
import { useReactToPrint } from "react-to-print";
import logoRdf from "../../assets/logoRdf.png";

import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import CloseIcon from "@mui/icons-material/Close";

import TableGrid from "./TableGrid";
import dayjs from "dayjs";
import {
  usePrintOrderMutation,
  useServeOrderMutation,
} from "../../services/server/api/orderTakerAPI";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/server/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import {
  orderingAPI,
  useLazyUmdQuery,
} from "../../services/server/api/orderingAPI";
import BatchOrders from "./BatchOrders";

const TransactionPrint = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.userData);
  const serveOrdering = useSelector((state) => state.modal.serveOrdering);

  const access = user?.role?.access_permission?.map((item) => item?.trim());
  const printableModal = useSelector((state) => state.modal.printableModal);
  const ordering = useSelector((state) => state.modal.ordering);
  const orders = useSelector((state) => state.prompt.orders);
  const mapOrder = {
    data: ordering?.order?.map((orders) => {
      const umdMatch = ordering?.umd_order?.find(
        (umd) =>
          umd?.item_code?.toString() === orders?.material?.code?.toString(),
      );
      return {
        ...orders,
        quantity_serve: umdMatch ? umdMatch.served : 0,
        remaining: umdMatch ? umdMatch.remaining : orders.quantity,
        move_order_date: umdMatch ? umdMatch.move_order_date : null,
      };
    }),
  };

  const contentRefSingle = useRef();
  const contentRefMultiple = useRef();

  const header = [
    { name: "No.", type: "index" },
    {
      name: "Item",
      type: "order-print",
      children: [
        { value: "material", child: "name", orderBy: 1 },
        { value: "material", child: "code", orderBy: 2 },
        { value: "uom", child: "code", orderBy: 3 },
      ],
    },
    { name: "Qty. Ordered", value: "quantity" },
    ...(ordering?.order_type === "BATCHING"
      ? [{ name: "Qty. Delivered", value: "quantity_serve" }]
      : []),
    ...(ordering?.order_type === "BATCHING"
      ? [{ name: "Actual Remaining", value: "remaining" }]
      : []),

    { name: "Actual Qty.", value: "" },

    { name: "Remarks", value: "remarks" },
  ];

  const [serveOrder, { isLoading }] = useServeOrderMutation();
  const [printOrder, { isLoading: loadingPrint }] = usePrintOrderMutation();

  const handleServe = async () => {
    const payload = {
      id: [ordering?.id],
    };

    try {
      await serveOrder(payload).unwrap();
      enqueueSnackbar("Order consolidated succesfully!", {
        variant: "success",
      });
      dispatch(orderingAPI.util.invalidateTags(["Order"]));
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  const handlePrintSingle = async () => {
    const payload = { id: [ordering?.id] };

    try {
      await printOrder(payload).unwrap();
    } catch (error) {}
    dispatch(resetModal());
    dispatch(resetPrompt());
  };

  const handlePrintMultiple = async () => {
    const payload = { id: orders?.map((items) => items?.id) };

    try {
      await printOrder(payload).unwrap();
    } catch (error) {}
    dispatch(resetModal());
    dispatch(resetPrompt());
  };

  const reactToPrintFn = useReactToPrint({
    contentRef: contentRefSingle,
    onAfterPrint: handlePrintSingle,
  });
  const reactToPrintFnMultiple = useReactToPrint({
    contentRef: contentRefMultiple,
    onAfterPrint: handlePrintMultiple,
  });

  return (
    <Dialog
      open={printableModal}
      onClose={() => dispatch(resetModal())}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "unset",
          width: "800px",
        },
      }}
    >
      {/* --- SINGLE PRINTING --- */}
      {(!orders || orders?.length === 0) && (
        <DialogContent ref={contentRefSingle}>
          <Stack position={"absolute"} top={0} right={2}>
            <IconButton onClick={() => dispatch(resetModal())}>
              <CloseIcon
                sx={{
                  fontSize: "20px",
                  "@media print": { display: "none" },
                }}
              />
            </IconButton>
          </Stack>
          <Stack flexDirection={"row"} justifyContent={"space-between"} mb={2}>
            <Stack>
              <img src={logoRdf} style={{ width: "100px" }} alt="Logo" />
            </Stack>
            <Stack>
              <Typography
                fontSize={"16px"}
                fontWeight={700}
                sx={{ textTransform: "uppercase" }}
              >
                Product Request
              </Typography>
              <Typography fontSize={"10px"}>
                {`MIR No: ${ordering?.id}`}
              </Typography>
              {ordering?.is_print > 0 && (
                <Typography
                  fontSize={"12px"}
                  fontWeight={800}
                  color="error"
                  sx={{
                    border: "2px solid #d32f2f",
                    borderRadius: "4px",
                    px: 1,
                    mt: 0.5,
                    letterSpacing: "0.5px",
                  }}
                >
                  RE-PRINT COPY
                </Typography>
              )}
            </Stack>
          </Stack>
          <Stack flexDirection={"row"} justifyContent={"space-between"} mb={2}>
            <Stack gap={0.3}>
              <Stack flexDirection={"row"} gap={0.5}>
                <Typography
                  fontSize={"12px"}
                  fontWeight={700}
                  sx={{ textTransform: "capitalize" }}
                >
                  Requested By:
                </Typography>
                <Typography
                  fontSize={"12px"}
                  sx={{ textTransform: "capitalize" }}
                >
                  {ordering?.requestor?.name?.toLowerCase()}
                </Typography>
              </Stack>

              {ordering?.updated_by !== null && (
                <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                  <Typography fontSize={"12px"} fontWeight={700}>
                    Updated By:
                  </Typography>
                  <Typography
                    fontSize={"12px"}
                    sx={{ textTransform: "capitalize" }}
                    color="warning"
                  >
                    {ordering?.updated_by?.toLowerCase()}
                  </Typography>
                </Stack>
              )}

              <Stack flexDirection={"row"} gap={0.5} alignItems={"center"}>
                <Typography fontSize={"12px"} fontWeight={700}>
                  Status:
                </Typography>
                <Typography
                  fontSize={"12px"}
                  sx={{
                    color:
                      {
                        approved: "#065F46",
                        consolidated: "#065F46",
                        served: "#1E40AF",
                      }[ordering?.status?.toLowerCase()] || "#A0A0A0",
                    textTransform: "capitalize",
                  }}
                >
                  {ordering?.status?.toLowerCase()}
                </Typography>
              </Stack>

              <Stack>
                <Typography
                  fontSize={"12px"}
                  fontWeight={700}
                  sx={{ textTransform: "capitalize" }}
                >
                  Date information
                </Typography>
                <Stack flexDirection={"row"} gap={0.5}>
                  <Typography fontSize={"8px"}>Ordered at</Typography>
                  <Typography fontSize={"8px"} fontWeight={700}>
                    {dayjs(ordering?.date_orderd).format("MMMM DD, YYYY")}
                  </Typography>
                </Stack>
                <Stack flexDirection={"row"} gap={0.5}>
                  <Typography fontSize={"8px"}>Needed on</Typography>
                  <Typography fontSize={"8px"} fontWeight={700}>
                    {dayjs(ordering?.date_needed).format("MMMM DD, YYYY")}
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            <Stack
              bgcolor={"#F4F6F8"}
              flexDirection={"row"}
              gap={1}
              padding={1}
              borderRadius={2}
            >
              <Divider
                orientation="vertical"
                flexItem
                sx={{
                  backgroundColor: "#3F51B5",
                  width: "12px",
                  ml: 1,
                }}
              />
              <Stack sx={{ minWidth: "300px" }}>
                <Typography fontSize={"14px"} fontWeight={700} color="#1F2937">
                  Customer
                </Typography>
                <Typography fontSize={"10px"} fontWeight={700} color="#111827">
                  {`${ordering?.customer?.code} - ${ordering?.customer?.name}`}
                </Typography>
                <Typography fontSize={"14px"} fontWeight={700} color="#1F2937">
                  Delivery Address
                </Typography>
                <Typography fontSize={"10px"} fontWeight={700} color="#111827">
                  {`${ordering?.customer?.delivery_address}`}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <TableGrid header={header} items={mapOrder} />
          <Typography fontSize={"10px"} fontWeight={700}>
            MIS-FRM-19-2001
          </Typography>
        </DialogContent>
      )}

      {/* --- MULTIPLE PRINTING --- */}
      {orders?.length > 0 && (
        <DialogContent ref={contentRefMultiple}>
          {/* Close button placed once at the top of the modal for UI */}
          <Stack position={"absolute"} top={0} right={2}>
            <IconButton onClick={() => dispatch(resetModal())}>
              <CloseIcon
                sx={{
                  fontSize: "20px",
                  "@media print": { display: "none" },
                }}
              />
            </IconButton>
          </Stack>

          {orders?.map((order, index) => {
            const mapOrderMultiple = {
              data: order?.order?.map((ords) => {
                const umdMatch = order?.umd_order?.find(
                  (umd) =>
                    umd?.item_code?.toString() ===
                    ords?.material?.code?.toString(),
                );

                return {
                  ...ords,
                  quantity_serve: umdMatch ? umdMatch.served : 0,
                  remaining: umdMatch ? umdMatch.remaining : order.quantity,
                  move_order_date: umdMatch ? umdMatch.move_order_date : null,
                };
              }),
            };

            const headerMultiple = [
              { name: "No.", type: "index" },
              {
                name: "Item",
                type: "order-print",
                children: [
                  { value: "material", child: "name", orderBy: 1 },
                  { value: "material", child: "code", orderBy: 2 },
                  { value: "uom", child: "code", orderBy: 3 },
                ],
              },

              { name: "Qty. Ordered", value: "quantity" },
              ...(order?.order_type === "BATCHING"
                ? [{ name: "Qty. Delivered", value: "quantity_serve" }]
                : []),
              ...(order?.order_type === "BATCHING"
                ? [{ name: "Actual Remaining", value: "remaining" }]
                : []),

              { name: "Actual Qty.", value: "" },

              { name: "Remarks", value: "remarks" },
            ];

            return (
              <Stack
                key={order.id || index}
                sx={{
                  pageBreakAfter: "always",
                  breakAfter: "page",
                  "&:last-child": {
                    pageBreakAfter: "auto",
                    breakAfter: "auto",
                  },
                  mb: 6, // Visual spacing on the screen
                  // FIX: Add top padding specifically for printed pages after the first one
                  "@media print": {
                    pt: index > 0 ? "40px" : 0,
                  },
                }}
              >
                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  mb={2}
                >
                  <Stack>
                    <img src={logoRdf} style={{ width: "100px" }} alt="Logo" />
                  </Stack>
                  <Stack>
                    <Typography
                      fontSize={"16px"}
                      fontWeight={700}
                      sx={{ textTransform: "uppercase" }}
                    >
                      Product Request
                    </Typography>
                    <Typography fontSize={"10px"}>
                      {`MIR No: ${order?.id}`}
                    </Typography>
                  </Stack>
                </Stack>

                {/* ... rest of your layout remains exactly the same ... */}

                <Stack
                  flexDirection={"row"}
                  justifyContent={"space-between"}
                  mb={2}
                >
                  <Stack gap={0.3}>
                    <Stack flexDirection={"row"} gap={0.5}>
                      <Typography
                        fontSize={"12px"}
                        fontWeight={700}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Requested By:
                      </Typography>
                      <Typography
                        fontSize={"12px"}
                        sx={{ textTransform: "capitalize" }}
                      >
                        {order?.requestor?.name?.toLowerCase()}
                      </Typography>
                    </Stack>

                    {order?.updated_by !== null && (
                      <Stack
                        flexDirection={"row"}
                        gap={0.5}
                        alignItems={"center"}
                      >
                        <Typography fontSize={"12px"} fontWeight={700}>
                          Updated By:
                        </Typography>
                        <Typography
                          fontSize={"12px"}
                          sx={{ textTransform: "capitalize" }}
                          color="warning"
                        >
                          {order?.updated_by?.toLowerCase()}
                        </Typography>
                      </Stack>
                    )}

                    <Stack
                      flexDirection={"row"}
                      gap={0.5}
                      alignItems={"center"}
                    >
                      <Typography fontSize={"12px"} fontWeight={700}>
                        Status:
                      </Typography>
                      <Typography
                        fontSize={"12px"}
                        sx={{
                          color:
                            {
                              approved: "#065F46",
                              consolidated: "#065F46",
                              served: "#1E40AF",
                            }[order?.status?.toLowerCase()] || "#A0A0A0",
                          textTransform: "capitalize",
                        }}
                      >
                        {order?.status?.toLowerCase()}
                      </Typography>
                    </Stack>

                    <Stack>
                      <Typography
                        fontSize={"12px"}
                        fontWeight={700}
                        sx={{ textTransform: "capitalize" }}
                      >
                        Date information
                      </Typography>
                      <Stack flexDirection={"row"} gap={0.5}>
                        <Typography fontSize={"8px"}>Ordered at</Typography>
                        <Typography fontSize={"8px"} fontWeight={700}>
                          {dayjs(order?.date_orderd).format("MMMM DD, YYYY")}
                        </Typography>
                      </Stack>
                      <Stack flexDirection={"row"} gap={0.5}>
                        <Typography fontSize={"8px"}>Needed on</Typography>
                        <Typography fontSize={"8px"} fontWeight={700}>
                          {dayjs(order?.date_needed).format("MMMM DD, YYYY")}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Stack
                    bgcolor={"#F4F6F8"}
                    flexDirection={"row"}
                    gap={1}
                    padding={1}
                    borderRadius={2}
                  >
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{
                        backgroundColor: "#3F51B5",
                        width: "12px",
                        ml: 1,
                      }}
                    />
                    <Stack sx={{ minWidth: "300px" }}>
                      <Typography
                        fontSize={"14px"}
                        fontWeight={700}
                        color="#1F2937"
                      >
                        Customer
                      </Typography>
                      <Typography
                        fontSize={"10px"}
                        fontWeight={700}
                        color="#111827"
                      >
                        {`${order?.customer?.code} - ${order?.customer?.name}`}
                      </Typography>
                      <Typography
                        fontSize={"14px"}
                        fontWeight={700}
                        color="#1F2937"
                      >
                        Delivery Address
                      </Typography>
                      <Typography
                        fontSize={"10px"}
                        fontWeight={700}
                        color="#111827"
                      >
                        {`${order?.customer?.delivery_address}`}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>

                <TableGrid header={headerMultiple} items={mapOrderMultiple} />
                <Typography fontSize={"10px"} fontWeight={700}>
                  MIS-FRM-19-2001
                </Typography>
              </Stack>
            );
          })}
        </DialogContent>
      )}

      {access?.includes("printing") && (
        <DialogActions
          sx={{
            "@media print": { display: "none" },
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {serveOrdering &&
            ordering?.status?.toLowerCase() !== "consolidated" && (
              <Button
                color="success"
                variant="contained"
                onClick={() => handleServe()}
                loading={isLoading}
              >
                Consolidate
              </Button>
            )}

          {/* {serveOrdering &&
            ordering?.status?.toLowerCase() === "consolidated" &&
            ordering?.order_type === "BATCHING" && (
              <Button
                color="info"
                variant="contained"
                onClick={() => {
                  dispatch(setViewBatch(true));
                }}
                loading={isLoading}
              >
                View Batch
              </Button>
            )} */}
          <Button
            color="info"
            startIcon={<LocalPrintshopOutlinedIcon />}
            onClick={() =>
              !orders || orders?.length === 0
                ? reactToPrintFn()
                : reactToPrintFnMultiple()
            }
          >
            Print
          </Button>
        </DialogActions>
      )}

      <BatchOrders />
    </Dialog>
  );
};

export default TransactionPrint;
