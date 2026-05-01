import { createTheme } from "@mui/material";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

export const Themes = () => {
  const mode = useSelector((state) => state.theme.mode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === "light"
            ? {
                primary: {
                  main: "#1976d2",
                },
                secondary: {
                  main: "#ed6c02",
                },
                info: {
                  main: "#301e67",
                },
                background: {
                  default: "#ecf9ff",
                  paper: "#ffffff",
                },
                divider: "#ffffff",
              }
            : {
                primary: {
                  main: "#ECDFCC",
                },
                secondary: {
                  main: "#697565",
                },
                error: {
                  main: "#FF5C58",
                },
                info: {
                  main: "#464741",
                },
                background: {
                  default: "#181C14",
                  paper: "#3C3D37",
                },
              }),
        },
        typography: {
          fontFamily: "Roboto",
        },
        components: {
          MuiFormControl: {
            styleOverrides: {
              root: {
                height: 50,
                width: "100%",
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 7,
                minHeight: 40,
              },
              input: {
                fontSize: "11px",
              },
            },
          },

          MuiInputLabel: {
            styleOverrides: {
              root: {
                fontSize: "13px",
              },
            },
          },

          MuiInputAdornment: {
            styleOverrides: {
              root: {
                "& .MuiSvgIcon-root": {
                  fontSize: "12px",
                },
              },
            },
          },

          MuiButton: {
            styleOverrides: {
              root: {
                fontSize: "10px",
                "& .MuiSvgIcon-root": {
                  fontSize: "12px",
                },
                textTransform: "capitalize",
              },
            },
          },

          MuiTypography: {
            styleOverrides: {
              root: {
                fontSize: "11px",
              },
            },
          },

          MuiBottomNavigation: {
            styleOverrides: {
              root: {
                backgroundColor: "transparent",
              },
            },
          },
          MuiBottomNavigationAction: {
            styleOverrides: {
              root: {
                color: mode === "light" ? "#000000de" : "#ffffff",
                backgroundColor: "transparent",
                "&.Mui-selected": {
                  color: mode === "light" ? "#ed6c02" : "#000000de",
                },
              },
            },
          },

          MuiSvgIcon: {
            styleOverrides: {
              root: {
                fontSize: 15,
              },
            },
          },
          MuiAutocomplete: {
            styleOverrides: {
              root: {
                "& .MuiInputBase-root": {
                  minHeight: 40,
                  "& input::placeholder": {
                    fontSize: "12px",
                  },
                  "& input": {
                    fontSize: "12px",
                  },
                },
                "& .MuiInputLabel-shrink": {
                  fontSize: "10px",
                },
                "& .MuiChip-root": {
                  fontSize: "10px",
                },
              },
              listbox: {
                fontSize: "12px",
              },
            },
          },

          MuiMenu: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#ffffff" : "#3C3D37",
              },
            },
          },

          MuiMenuItem: {
            styleOverrides: {
              root: {
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 8,
                "&.MuiTablePagination-menuItem": {
                  fontSize: "11px",
                },
              },
            },
          },
          MuiListItemIcon: {
            styleOverrides: {
              root: {
                minWidth: 28,
                "& .MuiSvgIcon-root": {
                  fontSize: 14,
                },
              },
            },
          },
          MuiListItem: {
            styleOverrides: {
              root: {
                height: 30,
                paddingTop: 0,
                paddingBottom: 0,
                overflow: "hidden",
                "& .MuiListItemText-root": {
                  "& .MuiTypography-root": {
                    fontSize: 11,
                  },
                },
              },
            },
          },

          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: "none",
                backgroundColor: mode === "light" ? "#ffffff" : "#3C3D37",
                "& .MuiSvgIcon-root": {
                  fontSize: 15,
                },
              },
            },
          },
          MuiToolbar: {
            styleOverrides: {
              root: {
                minHeight: "20px !important",
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: mode === "light" ? "#ffffff" : "#3C3D37",
              },
            },
          },
          MuiTableContainer: {
            styleOverrides: {
              root: {
                maxHeight: "60vh",
                overflow: "auto",
                backgroundColor: mode === "light" ? "#ffffff" : "#1e1e1e",
                borderRadius: "8px",
                boxShadow:
                  mode === "light"
                    ? "0px 2px 10px rgba(0, 0, 0, 0.1)"
                    : "0px 2px 10px rgba(255, 255, 255, 0.1)",

                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                position: "sticky",
                top: 0,
                zIndex: 2,
                "&:nth-of-type(1)": {
                  backgroundColor: mode === "light" ? "#301e67" : "#2a2a2a",
                  "& th": {
                    color: "#fff",
                  },
                },
              },
            },
          },
          MuiTableRow: {
            styleOverrides: {
              root: ({ ownerState }) => ({
                ...(ownerState?.head !== true &&
                  ownerState?.footer !== true && {
                    "&:hover": {
                      backgroundColor: mode === "light" ? "#e0e0e0" : "#2e2e2e",
                      cursor: "pointer",
                    },
                  }),
              }),
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                padding: "8px 12px",
                fontSize: "13px",
                borderBottom:
                  mode === "light" ? "1px solid #e0e0e0" : "1px solid #444",
              },
              head: {
                padding: "8px 12px",
                fontWeight: 600,
              },
              body: {
                padding: "8px 12px",
                fontSize: "12px",
              },
            },
          },
          MuiTablePagination: {
            styleOverrides: {
              toolbar: {
                fontSize: "11px",
              },
              selectLabel: {
                fontSize: "11px",
              },
              displayedRows: {
                fontSize: "11px",
              },
              select: {
                fontSize: "11px",
              },
              actions: {
                "& .MuiIconButton-root": {
                  fontSize: "11px",
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  return { theme };
};
