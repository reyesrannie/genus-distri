import {
  Avatar,
  Box,
  ButtonBase,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import DoubleArrowOutlinedIcon from "@mui/icons-material/DoubleArrowOutlined";
import React, { forwardRef, useMemo } from "react";
import { FixedSizeList } from "react-window";

const AppCardGrid = forwardRef(function AppCardGrid(
  { items = [], onSelect, type, renderRow, itemSize },
  ref
) {
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const height = useMemo(() => screen.height - 300, [screen.height])

  const Row = ({ index, style }) => {
    const item = items[index];
    const isLast = index === items?.length - 1;

    return (
      <div style={style}>
        <ButtonBase
          key={index}
          id={index}
          onClick={(e) => onSelect(e, item)}
          ref={isLast ? ref : null}
          sx={{
            minWidth: isLaptop ? "280px" : "100%",
            display: "block",
            transition: "all 0.2s ease-in-out",
            marginY: "4px", // spacing between rows
            // "&:active": {
            //   transform: "translateY(-2px)",
            //   boxShadow: 3,
            //   borderRadius: 4,
            // },
          }}
        >
          <Box
            bgcolor="background.paper"
            borderRadius={3}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              position: "relative",
              // "&:active": {
              //   borderColor: "primary.main",
              //   bgcolor: "action.hover",
              // },
            }}
          >
            {renderRow(item, index)}
          </Box>
        </ButtonBase>
      </div>
    );
  };

  return (
    <FixedSizeList
      height={height}             // viewport height
      itemCount={items.length} // total rows
      itemSize={itemSize}           // row height
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
});

export default AppCardGrid;
