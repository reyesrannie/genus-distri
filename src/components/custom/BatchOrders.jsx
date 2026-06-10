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
  const batchData = useSelector((state) => state.modal.batchData);
  const viewBatch = useSelector((state) => state.modal.viewBatch);

  const header = [
    {
      name: "Item",
      value: "item_code",
    },
    {
      name: "Description",
      value: "description",
    },
    { name: "Ordered", value: "ordered" },
    { name: "Served Qty.", value: "served" },
    { name: "Remaining", value: "remaining" },
    { name: "Move Order Date", value: "move_order_date", type: "date" },
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
        <TableGrid header={header} items={{ data: batchData }} />
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
