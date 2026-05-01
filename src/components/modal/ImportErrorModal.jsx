import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setImportErrorMessage } from "../../services/server/slice/modalSlice";

import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";

const ImportErrorModal = ({ header = [], items = [] }) => {
  const dispatch = useDispatch();
  const open = useSelector((state) =>
    state.modal.importErrorMessage !== null ? true : false
  );
  const importErrorMessage = useSelector(
    (state) => state.modal.importErrorMessage
  );
  const importData = useSelector((state) => state.modal.importData);

  return (
    <Dialog
      open={open}
      onClose={() => dispatch(setImportErrorMessage(null))}
      sx={{
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "none",
        },
      }}
    >
      <DialogContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {header?.map((head, index) => {
                  return (
                    <TableCell key={index} align={head?.alignHeader}>
                      <Typography>{head?.name}</Typography>
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {items?.map((i, ind) => {
                return (
                  <TableRow key={ind}>
                    {header?.map((head, index) => {
                      const errorKey = `${ind}.${head.value}`;
                      const hasError = !!importErrorMessage?.[errorKey];
                      return (
                        <TableCell key={index} align={head?.alignHeader}>
                          <Tooltip
                            title={hasError ? importErrorMessage[errorKey] : ""}
                          >
                            <Typography
                              color={`${hasError ? "error" : "inherit"}`}
                            >
                              {i[head?.value]
                                ? i[head?.value]
                                : `Doesn't Exist`}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="error"
          startIcon={<DoDisturbAltOutlinedIcon />}
          onClick={() => dispatch(setImportErrorMessage(null))}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportErrorModal;
