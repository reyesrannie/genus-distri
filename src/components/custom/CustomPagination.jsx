import {
  Pagination,
  Stack,
  Table,
  TableFooter,
  TablePagination,
  TableRow,
  useMediaQuery,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";

const CustomPagination = ({ data, onPageChange, onRowChange, onChange }) => {
  const isTablet = useMediaQuery("(min-width:768px)");
  const mode = useSelector((state) => state.theme.mode);

  return (
    <Stack mt={2} borderRadius={2} overflow={"hidden"}>
      {isTablet ? (
        <Table>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  20,
                  {
                    label: "All",
                    value: data?.total > 100 ? data?.total : 100,
                  },
                ]}
                count={data?.total || 0}
                page={data?.current_page - 1 || 0}
                rowsPerPage={data?.per_page}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowChange}
              />
            </TableRow>
          </TableFooter>
        </Table>
      ) : (
        <Stack
          spacing={2}
          backgroundColor={mode === "dark" ? "#3C3D37" : "#ffffff"}
          padding={1}
          borderRadius={2}
          alignItems={"center"}
        >
          <Pagination
            count={data?.last_page || 0}
            page={data?.current_page}
            onChange={(e, v) => onChange(v)}
          />
        </Stack>
      )}
    </Stack>
  );
};

export default CustomPagination;
