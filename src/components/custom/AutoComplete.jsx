import { Controller } from "react-hook-form";
import {
  Autocomplete as MuiAutocomplete,
  createFilterOptions,
} from "@mui/material";
import { useEffect, useRef } from "react";

const Autocomplete = ({
  disabled,
  name,
  control,
  error,
  helpertext,
  loading,
  limit,
  scrollChange,
  ...autocomplete
}) => {
  const { multiple } = autocomplete;
  const defaultFilterOptions = createFilterOptions();
  const allOptionsRef = useRef([]);

  const filterOptions = (options, state) => {
    const filteredOptions = defaultFilterOptions(options, state).slice(0);
    const sortedOptions = filteredOptions.sort((a, b) => {
      const labelA = a?.general_info?.full_id_number
        ? a?.general_info?.full_id_number?.toString().toLowerCase()
        : "";
      const labelB = b?.general_info?.full_id_number
        ? b?.general_info?.full_id_number?.toString().toLowerCase()
        : "";
      return labelA.localeCompare(labelB);
    });
    const limitedOptions = limit
      ? sortedOptions.slice(0, limit)
      : sortedOptions;

    allOptionsRef.current = limitedOptions;
    return limitedOptions;
  };

  const handleScrollInternal = (event) => {
    if (scrollChange) scrollChange(event);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const { value = multiple ? [] : null, onChange } = field;
        return (
          <MuiAutocomplete
            onKeyDown={(event) => {
              if (event?.key === "Enter" && value !== null) {
                event?.preventDefault();
              }
            }}
            loading={loading}
            autoFocus={false}
            disabled={disabled}
            {...autocomplete}
            filterOptions={filterOptions}
            error={error}
            helpertext={helpertext}
            value={value}
            disablePortal={false}
            onChange={(_, value) => onChange(value)}
            slotProps={{
              listbox: {
                onScroll: handleScrollInternal,
                sx: {
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #ccc",
                },
              },
            }}
          />
        );
      }}
    />
  );
};

export default Autocomplete;
