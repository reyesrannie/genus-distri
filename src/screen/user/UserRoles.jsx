import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";

import useParamsHook from "../../services/hooks/useParamsHook";
import LibraryAddOutlinedIcon from "@mui/icons-material/LibraryAddOutlined";
import StatusFilter from "../../components/custom/StatusFilter";
import AppSearch from "../../components/custom/AppSearch";
import TableGrid from "../../components/custom/TableGrid";
import MobileLoading from "../../components/custom/MobileLoading";
import NoDataFound from "../../components/custom/NoDataFound";
import CustomPagination from "../../components/custom/CustomPagination";

import { useDispatch, useSelector } from "react-redux";
import {
  resetModal,
  setRoles,
  setRolesModal,
} from "../../services/server/slice/modalSlice";
import {
  useArchiveRoleMutation,
  useRoleQuery,
} from "../../services/server/api/rolesAPI";
import RolesModal from "../../components/modal/RolesModal";
import MenuPopper from "../../components/custom/MenuPopper";
import AppPrompt from "../../components/custom/AppPrompt";
import {
  resetPrompt,
  setArchive,
} from "../../services/server/slice/promptSlice";
import warning from "../../assets/svg/warning.svg";
import { useSnackbar } from "notistack";
import { singleError } from "../../services/functions/errorResponse";

const UserRoles = () => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);

  const {
    params,
    onStatusChange,
    onPageChange,
    onSearchData,
    onRowChange,
    onSelectPage,
  } = useParamsHook();
  const { data, isFetching, isError, isSuccess } = useRoleQuery(params);
  const { enqueueSnackbar } = useSnackbar();

  const [archiveRoles, { isLoading: loadingArchive }] =
    useArchiveRoleMutation();

  const isLaptop = useMediaQuery("(min-width:1024px)");
  const archive = useSelector((state) => state.prompt.archive);
  const rolesData = useSelector((state) => state.modal.roles);

  const header = [
    {
      name: "Id",
      value: "id",
    },
    {
      name: "Name",
      value: "name",
    },
    { name: "Date Modified", value: "updated_at", type: "date" },
  ];

  const handleArchive = async () => {
    try {
      await archiveRoles(rolesData).unwrap();
      enqueueSnackbar(
        `Role has been ${params?.status === "active" ? "archived" : "restored"}`,
        { variant: "success" },
      );
      dispatch(resetModal());
      dispatch(resetPrompt());
    } catch (error) {
      singleError(error, enqueueSnackbar);
    }
  };

  return (
    <Box sx={{ marginLeft: 2 }}>
      <Stack gap={1}>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Typography
            color="text.primary"
            sx={{
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            User Roles
          </Typography>
          {params?.status === "active" && (
            <Button
              loading={loadingArchive}
              size="small"
              sx={{ textTransform: "capitalize" }}
              color="info"
              variant="contained"
              startIcon={<LibraryAddOutlinedIcon />}
              onClick={() => dispatch(setRolesModal(true))}
            >
              Add
            </Button>
          )}
        </Stack>
        <Stack
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <StatusFilter params={params} onStatusChange={onStatusChange} />
          <AppSearch onSearch={onSearchData} />
        </Stack>

        {isFetching ? (
          <MobileLoading />
        ) : isError ? (
          <NoDataFound />
        ) : (
          <TableGrid
            header={header}
            items={data?.result}
            onView={(v) => {
              dispatch(setRoles(v));
              dispatch(setRolesModal(true));
            }}
            onSelect={(e, i) => {
              dispatch(setRoles(i));
              setAnchorEl({
                mouseX: e.clientX,
                mouseY: e.clientY,
              });
            }}
          />
        )}
      </Stack>
      {isSuccess && (
        <CustomPagination
          data={data?.result}
          onPageChange={onPageChange}
          onRowChange={onRowChange}
          onChange={onSelectPage}
        />
      )}
      <RolesModal />

      <MenuPopper
        params={params}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        update={() => {
          setAnchorEl(null);
          dispatch(setRolesModal(true));
        }}
        archive={() => {
          setAnchorEl(null);
          dispatch(setArchive(true));
        }}
      />

      <AppPrompt
        open={archive}
        image={warning}
        title={`${params?.status === "active" ? "Archive" : "Restore"} role?`}
        message={`Are you sure you want to ${params?.status === "active" ? "archive" : "restore"} this role?`}
        confirmButton={`Yes, ${params?.status === "active" ? "Archive" : "Restore"} it!`}
        cancelButton={`${params?.status === "active" ? "No, Keep it!" : "Cancel"} `}
        confirmOnClick={handleArchive}
        isLoading={loadingArchive}
      />
    </Box>
  );
};

export default UserRoles;
