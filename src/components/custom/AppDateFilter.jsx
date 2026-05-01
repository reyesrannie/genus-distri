import {
  Box,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";

import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import FilterListOffOutlinedIcon from "@mui/icons-material/FilterListOffOutlined";
import "../styles/AppSearch.scss";
import { Controller, set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";
import Autocomplete from "./AutoComplete";
import { use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFilter } from "../../services/server/slice/promptSlice";

const AppDateFilter = ({ resetFilter, onFilterChange }) => {
  const [openPickerFrom, setOpenPickerFrom] = useState(false);
  const [openPickerTo, setOpenPickerTo] = useState(false);
  const dispatch = useDispatch();

  const filter = useSelector((state) => state.prompt.filter);

  const [anchorEl, setAnchorEl] = useState(false);

  const {
    control,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(),
    defaultValues: {
      status: null,
      date_from: null,
      date_to: null,
    },
  });

  const handleChangeStatus = useCallback(() => {
    const status = watch("status");
    const date_from = watch("date_from");
    const date_to = watch("date_to");

    if ((date_from !== null, date_to !== null)) {
      dispatch(
        setFilter({
          ...(filter === null ? "" : filter),
          date_from: dayjs(date_from).format("YYYY-MM-DD"),
          date_to: dayjs(date_to).format("YYYY-MM-DD"),
        })
      );
      onFilterChange({
        ...(filter === null ? "" : filter),
        date_from: dayjs(date_from).format("YYYY-MM-DD"),
        date_to: dayjs(date_to).format("YYYY-MM-DD"),
      });
    }

    dispatch(
      setFilter({
        ...(filter === null ? "" : filter),
        search: status,
      })
    );
    onFilterChange({
      ...(filter === null ? "" : filter),
      search: status,
    });
  });

  return (
    <Box
      display={"flex"}
      bgcolor={"background.paper"}
      alignItems={"center"}
      justifyContent={"center"}
      borderRadius={10}
    >
      <Stack
        alignItems={"center"}
        flexDirection={"row"}
        justifyContent={"center"}
        gap={2}
      >
        <IconButton
          onClick={(e) => {
            setAnchorEl({
              mouseX: e.clientX,
              mouseY: e.clientY,
            });
          }}
        >
          {filter !== null ? (
            <FilterListOffOutlinedIcon sx={{ fontSize: "16px" }} />
          ) : (
            <FilterListOutlinedIcon sx={{ fontSize: "16px" }} />
          )}
        </IconButton>
      </Stack>

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
        <Stack padding={1} gap={1}>
          <Autocomplete
            control={control}
            name={"status"}
            options={["Served", "Approved"]}
            getOptionLabel={(option) => option}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Status"
                size="small"
                variant="filled"
              />
            )}
          />
          <Controller
            control={control}
            name="date_from"
            render={({ field }) => (
              <MobileDatePicker
                open={openPickerFrom}
                onOpen={() => setOpenPickerFrom(true)}
                onClose={() => {
                  dispatch(
                    setFilter({
                      ...(filter === null ? "" : filter),
                      date_from: dayjs(watch("date_from")).format("YYYY-MM-DD"),
                    })
                  );
                  setOpenPickerFrom(false);
                }}
                label="From"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "filled",
                    InputProps: {
                      style: {
                        fontSize: "12px",
                      },
                    },
                    onClick: () => setOpenPickerFrom(true),
                    error: Boolean(errors?.date_needed),
                    helperText: errors?.date_needed?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            control={control}
            name="date_to"
            render={({ field }) => (
              <MobileDatePicker
                open={openPickerTo}
                onOpen={() => setOpenPickerTo(true)}
                onClose={() => {
                  dispatch(
                    setFilter({
                      ...(filter === null ? "" : filter),
                      date_to: dayjs(watch("date_to")).format("YYYY-MM-DD"),
                    })
                  );
                  setOpenPickerTo(false);
                }}
                label="To"
                value={field.value}
                onChange={(newValue) => {
                  field.onChange(newValue);
                }}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "filled",
                    InputProps: {
                      style: {
                        fontSize: "12px",
                      },
                    },
                    onClick: () => setOpenPickerTo(true),
                    error: Boolean(errors?.date_needed),
                    helperText: errors?.date_needed?.message,
                  },
                }}
              />
            )}
          />
          <Button
            variant="outlined"
            onClick={() => {
              handleChangeStatus();
            }}
            color="success"
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              dispatch(setFilter(null));
              reset();
              resetFilter();
            }}
          >
            Clear
          </Button>
        </Stack>
      </Menu>
    </Box>
  );
};

export default AppDateFilter;
