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
import { useServeOrderMutation } from "../../services/server/api/orderTakerAPI";
import { enqueueSnackbar } from "notistack";
import { resetPrompt } from "../../services/server/slice/promptSlice";
import { singleError } from "../../services/functions/errorResponse";
import { orderingAPI } from "../../services/server/api/orderingAPI";

const BatchOrders = () => {
  const dispatch = useDispatch();

  const ordering = useSelector((state) => state.modal.ordering);
  const viewBatch = useSelector((state) => state.modal.viewBatch);

  const mapOrder = { data: ordering?.umd_order };

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
    { name: "Qty.", value: "quantity" },
    { name: "Actual Qty.", value: "" },
    { name: "Remarks", value: "remarks" },
  ];

  return (
    <Dialog
      open={viewBatch}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: "unset",
          width: "800px",
        },
      }}
    >
      <Stack position={"absolute"} top={0} right={2}>
        <IconButton onClick={() => dispatch(setViewBatch(false))}>
          <CloseIcon
            sx={{
              fontSize: "20px",
              "@media print": { display: "none" },
            }}
          />
        </IconButton>
      </Stack>
      <DialogContent>
        <TableGrid header={header} items={mapOrder} />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "right", mb: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => dispatch(setViewBatch(false))}
          startIcon={<CloseIcon />}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BatchOrders;
