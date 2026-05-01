import { Avatar, Stack, Typography, Box, Chip, Divider } from "@mui/material";
import DoubleArrowOutlinedIcon from "@mui/icons-material/DoubleArrowOutlined";
import AppCardGrid from "../../custom/AppCardGrid";
import { forwardRef } from "react";

const RoleCard = forwardRef(function RoleCard({ onSelect, items }, ref) {
  return (
    <AppCardGrid
      items={items}
      onSelect={onSelect}
      itemSize={80}
      ref={ref}
      renderRow={(item, index) => (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            "&:hover": {
              bgcolor: "action.hover",
              transition: "0.2s",
            },
          }}
        >
          {/* Left side: avatar + info */}
          <Stack direction="row" spacing={2} alignItems="center" flex={1}>
            <Box
              sx={{
                borderRadius: "100%",
                width: "30px",
                height: "30px",
                alignContent: "center",
                color: "white",
                bgcolor: "primary.main",
              }}
            >
              {index + 1}
            </Box>

            <Stack spacing={0.5} flex={1} minWidth={0}>
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                noWrap
                color="text.primary"
              >
                {item?.name}
              </Typography>
            </Stack>
          </Stack>

          {/* Right side: chevron icon */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              borderRadius: "50%",
              bgcolor: "action.hover",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                bgcolor: "primary.light",
                transform: "translateX(4px)",
              },
            }}
          >
            <DoubleArrowOutlinedIcon fontSize="small" color="action" />
          </Box>
        </Stack>
      )}
    />
  );
});

export default RoleCard;
