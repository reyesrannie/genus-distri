import "./App.scss";
import { Box, IconButton, ThemeProvider } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";
import CloseIcon from "@mui/icons-material/Close";
import Routing from "./services/routes/Routing";
import { Themes } from "./components/styles/Themes";

const App = () => {
  const { theme } = Themes();
  return (
    <ThemeProvider theme={theme}>
      <Box className="app-box-container" bgcolor={"background.default"}>
        <SnackbarProvider
          maxSnack={3}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          action={(key) => (
            <IconButton onClick={() => closeSnackbar(key)}>
              <CloseIcon className="icon-properties" />
            </IconButton>
          )}
        >
          <Routing />
        </SnackbarProvider>
      </Box>
    </ThemeProvider>
  );
};

export default App;
