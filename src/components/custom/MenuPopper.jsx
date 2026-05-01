import { ListItemIcon, ListItemText, MenuItem, Menu } from "@mui/material";
import React from "react";

import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import { useDispatch, useSelector } from "react-redux";
import { resetModal } from "../../services/server/slice/modalSlice";
import { decodeUser } from "../../services/functions/saveUser";
import { Add } from "@mui/icons-material";

const MenuPopper = ({
  params,
  anchorEl,
  setAnchorEl,
  update,
  archive,
  reset,
  add,
  view,
}) => {
  const dispatch = useDispatch();
  const loggedInUser = decodeUser();
  const userData = useSelector((state) => state.modal.userData);

  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorEl ? { top: anchorEl.mouseY, left: anchorEl.mouseX } : undefined
      }
      onClose={() => {
        setAnchorEl(null);
        dispatch(resetModal());
      }}
    >
      {update &&
        (params?.status === "active" || params?.status === "pending") && (
          <MenuItem onClick={update}>
            <ListItemIcon>
              <DriveFileRenameOutlineOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Update</ListItemText>
          </MenuItem>
        )}

      {add && params?.status === "pending" && (
        <MenuItem onClick={add}>
          <ListItemIcon>
            <Add fontSize="small" />
          </ListItemIcon>
          <ListItemText>Add</ListItemText>
        </MenuItem>
      )}

      {reset && (
        <MenuItem onClick={reset}>
          <ListItemIcon>
            <HistoryOutlinedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Reset</ListItemText>
        </MenuItem>
      )}
      {archive && (
        <MenuItem
          onClick={archive}
          disabled={userData?.id === loggedInUser?.id}
        >
          <ListItemIcon>
            {params?.status === "active" ? (
              <DeleteForeverOutlinedIcon fontSize="small" color="error" />
            ) : (
              <RestartAltOutlinedIcon fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText sx={{ color: "#ff6b6b" }}>
            {params?.status === "active" || params?.status === "pending"
              ? "Archive"
              : "Restore"}
          </ListItemText>
        </MenuItem>
      )}
    </Menu>
  );
};

export default MenuPopper;
