import { ListItemIcon, ListItemText, MenuItem, Menu } from "@mui/material";
import React from "react";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";

const MenuOptions = ({ anchorEl, setAnchorEl, addOption, importOption }) => {
  return (
    <Menu
      open={Boolean(anchorEl)}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorEl ? { top: anchorEl.mouseY, left: anchorEl.mouseX } : undefined
      }
      onClose={() => {
        setAnchorEl(null);
      }}
    >
      <MenuItem onClick={addOption}>
        <ListItemIcon>
          <AddOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Add</ListItemText>
      </MenuItem>
      <MenuItem onClick={importOption}>
        <ListItemIcon>
          <ImportExportOutlinedIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Import</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default MenuOptions;
