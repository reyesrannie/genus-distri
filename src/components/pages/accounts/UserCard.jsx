import { Avatar, Stack, Typography, Box } from "@mui/material";
import DoubleArrowOutlinedIcon from "@mui/icons-material/DoubleArrowOutlined";
import AppCardGrid from "../../custom/AppCardGrid";
import { forwardRef } from "react";

const UserCard = forwardRef(function UserCard(
  { type, onSelect, items },
  ref
) {
      return (
    <AppCardGrid
      items={items}
      onSelect={onSelect}
      itemSize={160}
      ref={ref}
      renderRow={(item) => (
        <Stack
          padding={2}
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" gap={2} flex={1}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: "primary.light" }}>
              {item?.username?.charAt(0).toUpperCase()}
            </Avatar>

            <Stack flex={1} spacing={0.5} alignItems="flex-start">
              <Typography variant="body2" fontWeight="bold">
                {item?.account_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item?.account_code}
              </Typography>

              <Typography
                variant="caption"
                color="secondary.main"
                sx={{
                  fontSize: "11px",
                  fontWeight: 500,
                  border: 1,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  opacity: 0.8,
                }}
              >
                {item?.username}
              </Typography>

              <Typography variant="caption" textAlign={"start"} color="text.secondary">
                {item?.charging_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Charging code: {item?.charging_code}
              </Typography>
            </Stack>
          </Stack>

          {/* <Box
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
            <DoubleArrowOutlinedIcon fontSize="small" />
          </Box> */}
        </Stack>
      )}
    />
  );
});

export default UserCard