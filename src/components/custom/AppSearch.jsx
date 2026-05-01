import { Box, IconButton, InputBase } from "@mui/material";
import React, { useCallback, useRef, useState } from "react";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "../styles/AppSearch.scss";

const AppSearch = ({ onSearch }) => {
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef(null);
  const debounceTimeout = useRef(null);

  const handleFocus = (isShow) => {
    if (isShow) {
      inputRef.current.focus();
    }
  };

  const getValue = useCallback((e) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onSearch(e.target.value);
    }, 500);
  }, []);

  return (
    <Box
      display={"flex"}
      bgcolor={"background.paper"}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={10}
    >
      <IconButton
        onClick={() => {
          handleFocus(!showSearch);
          setShowSearch(!showSearch);
        }}
        sx={{
          padding: 1,
        }}
      >
        <SearchOutlinedIcon />
      </IconButton>

      <InputBase
        className={`app-search-input-base ${showSearch ? "open" : ""}`}
        autoFocus={showSearch}
        inputRef={inputRef}
        onKeyUp={(e) => {
          if (e?.target?.value === "") {
            onSearch("");
          } else {
            getValue(e);
          }
        }}
        placeholder="Search..."
        size="small"
        sx={{
          "& input": {
            fontSize: "11px",
          },
          "& input::placeholder": {
            fontSize: "11px",
          },
        }}
      />
    </Box>
  );
};

export default AppSearch;
