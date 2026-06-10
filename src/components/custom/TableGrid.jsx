import {
  Checkbox,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import dayjs from "dayjs";
// import "../styles/TableGrid.scss";

import InsertLinkOutlinedIcon from "@mui/icons-material/InsertLinkOutlined";
import { useDispatch, useSelector } from "react-redux";
import { setOrders } from "../../services/server/slice/promptSlice";

const TableGrid = ({
  header = [],
  items = [],
  onSelect,
  onView,
  multipleView,
}) => {
  const dispatch = useDispatch();

  const orders = useSelector((state) => state.prompt.orders);

  return (
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
          {items?.data?.map((i, ind) => {
            // Find the selected order
            const order = orders?.find((o) => o.id === i.id);

            // Renamed 'order' to 'ord' inside the loop to avoid conflicting with the 'order' variable above
            const isCompleted =
              i?.umd_order?.every((ord) => ord?.remaining <= 0) ?? false;

            return (
              <TableRow
                key={ind}
                onClick={(e) => {
                  if (orders?.length === 0) {
                    onSelect(e, i);
                  } else {
                    e.stopPropagation();
                    if (order) {
                      dispatch(setOrders(orders?.filter((o) => o.id !== i.id)));
                    } else {
                      dispatch(setOrders([...orders, i]));
                    }
                  }
                }}
              >
                {header?.map((head, index) => {
                  const safeStringValue = i[head?.value]
                    ?.toString()
                    ?.toLowerCase();
                  const chipStatus =
                    i?.umd_order?.length === 0
                      ? safeStringValue
                      : isCompleted
                        ? "delivered"
                        : "partially delivered";

                  return (
                    <TableCell
                      key={index}
                      align={head?.alignHeader}
                      onClick={(e) => {
                        head?.type === "select" && e.stopPropagation();
                      }}
                    >
                      {head?.type === "select" &&
                        i[head.value] === head?.status && (
                          <Checkbox
                            checked={!!order}
                            onChange={() => {
                              if (order) {
                                dispatch(
                                  setOrders(
                                    orders?.filter((o) => o.id !== i.id),
                                  ),
                                );
                              } else {
                                dispatch(setOrders([...orders, i]));
                              }
                            }}
                          />
                        )}

                      {head?.type === undefined && (
                        <Typography>{i[head?.value]}</Typography>
                      )}

                      {head?.type === "index" && (
                        <Typography>{ind + 1}</Typography>
                      )}

                      {head?.type === "status" && (
                        <Chip
                          label={i[head?.value]?.toLowerCase()}
                          sx={{
                            bgcolor:
                              {
                                pending: "#FEF3C7",
                                approved: "#D1FAE5",
                                reject: "#FEE2E2",
                                completed: "#DBEAFE",
                                return: "#FFE4E1",
                                rejected: "#FFE4E1",
                                served: "#EDE9FE",
                                consolidated: "#E0E7FF",
                                "ready for preparation": "#FEF3C7",
                                "ready to sync": "#E0F2FE",
                                "ready to pick-up": "#E7F5FF",
                                "ready to deliver": "#E7F5FF",
                              }[i[head?.value]?.toLowerCase()] || "#F3F4F6",

                            color:
                              {
                                pending: "#92400E",
                                approved: "#065F46",
                                reject: "#7F1D1D",
                                completed: "#1E40AF",
                                return: "#B22222",
                                rejected: "#B22222",
                                consolidated: "#3730A3",
                                "ready for preparation": "#92400E",
                                "ready to sync": "#0284C7",
                                "ready to pick-up": "#0369A1",
                                "ready to deliver": "#0369A1",
                              }[i[head?.value]?.toLowerCase()] || "#111827",

                            border: "1px solid",
                            borderColor:
                              {
                                pending: "#FBBF24",
                                approved: "#34D399",
                                reject: "#F87171",
                                completed: "#60A5FA",
                                return: "#FF7F7F",
                                rejected: "#FF7F7F",
                                consolidated: "#A5B4FC",
                                "ready for preparation": "#FBBF24",
                                "ready to sync": "#7DD3FC",
                                "ready to pick-up": "#38BDF8",
                                "ready to deliver": "#38BDF8",
                              }[i[head?.value]?.toLowerCase()] || "#D1D5DB",

                            padding: "2px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        />
                      )}

                      {head?.type === "umdStatus" && (
                        <Chip
                          label={chipStatus}
                          sx={{
                            bgcolor:
                              {
                                pending: "#FEF3C7",
                                approved: "#D1FAE5",
                                reject: "#FEE2E2",
                                completed: "#DBEAFE",
                                return: "#FFE4E1",
                                rejected: "#FFE4E1",
                                served: "#EDE9FE",
                                consolidated: "#E0E7FF",
                                "ready for preparation": "#FEF3C7",
                                "ready to sync": "#E0F2FE",
                                "ready to pick-up": "#E7F5FF",
                                "ready to deliver": "#E7F5FF",
                                delivered: "#CCFBF1",
                                "partially delivered": "#FED7AA",
                              }[chipStatus] || "#F3F4F6",

                            color:
                              {
                                pending: "#92400E",
                                approved: "#065F46",
                                reject: "#7F1D1D",
                                completed: "#1E40AF",
                                return: "#B22222",
                                rejected: "#B22222",
                                consolidated: "#3730A3",
                                "ready for preparation": "#92400E",
                                "ready to sync": "#0284C7",
                                "ready to pick-up": "#0369A1",
                                "ready to deliver": "#0369A1",
                                delivered: "#115E59",
                                "partially delivered": "#9A3412",
                              }[chipStatus] || "#111827",

                            border: "1px solid",
                            borderColor:
                              {
                                pending: "#FBBF24",
                                approved: "#34D399",
                                reject: "#F87171",
                                completed: "#60A5FA",
                                return: "#FF7F7F",
                                rejected: "#FF7F7F",
                                consolidated: "#A5B4FC",
                                "ready for preparation": "#FBBF24",
                                "ready to sync": "#7DD3FC",
                                "ready to pick-up": "#38BDF8",
                                "ready to deliver": "#38BDF8",
                                delivered: "#2DD4BF",
                                "partially delivered": "#F97316",
                              }[chipStatus] || "#D1D5DB",

                            padding: "2px 10px",
                            borderRadius: "9999px",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            textTransform: "capitalize",
                          }}
                        />
                      )}

                      {head?.type === "multimedia" && (
                        <Stack
                          gap={1}
                          flexDirection={"row"}
                          alignItems={"center"}
                        >
                          <Typography>{i[head?.value]}</Typography>
                        </Stack>
                      )}

                      {head?.type === "time" && (
                        <Typography>
                          {dayjs(
                            `${dayjs().format("YYYY-MM-DD")}T${i[head?.value]}`,
                          ).format("hh:mm a")}
                        </Typography>
                      )}

                      {head?.type === "date" && (
                        <Typography>
                          {moment(new Date(i[head?.value])).format(
                            "MMM DD, YYYY",
                          )}
                        </Typography>
                      )}

                      {head?.type === "parent" && (
                        <Typography>{i[head.value]?.[head.child]}</Typography>
                      )}

                      {head?.type === "multiple" && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            multipleView(i);
                          }}
                        >
                          <InsertLinkOutlinedIcon />
                        </IconButton>
                      )}

                      {head?.type === "stack" && (
                        <Stack>
                          <Typography fontWeight={700}>
                            {i[head?.primary]}
                          </Typography>
                          <Typography>{i[head?.secondary]}</Typography>
                          <Typography color="secondary">
                            {i[head?.third]}
                          </Typography>
                          <Typography fontWeight={700} color="success">
                            {i[head?.fourth]}
                          </Typography>
                          <Typography fontWeight={700} color="primary">
                            {i[head?.fifth]}
                          </Typography>
                          <Typography fontWeight={700} color="primary">
                            {i[head?.sixth]}
                          </Typography>
                          <Typography fontWeight={700} color="primary">
                            {i[head?.seventh]}
                          </Typography>
                        </Stack>
                      )}

                      {head?.type === "stackNoStyle" && (
                        <Stack>
                          <Typography>{i[head?.primary]}</Typography>
                          <Typography>{i[head?.secondary]}</Typography>
                          <Typography>{i[head?.third]}</Typography>
                          <Typography>{i[head?.fourth]}</Typography>
                          <Typography>{i[head?.fifth]}</Typography>
                          <Typography>{i[head?.sixth]}</Typography>
                        </Stack>
                      )}

                      {head?.type === "order-print" && (
                        <Stack>
                          {head?.children?.map((child, ind) => {
                            return (
                              <Typography
                                key={ind}
                                sx={{
                                  fontSize:
                                    {
                                      1: "12px",
                                    }[child?.orderBy] || "8px",
                                  fontWeight:
                                    {
                                      1: 600,
                                    }[child?.orderBy] || 0,

                                  color:
                                    {
                                      1: "#1F2937", // FIXED: Removed double ## here
                                    }[child?.orderBy] || "#4B5563",
                                }}
                              >
                                {i[child.value]?.[child.child]}
                              </Typography>
                            );
                          })}
                        </Stack>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableGrid;
