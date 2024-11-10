import { BorderClear, BorderColor } from "@mui/icons-material";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1e365c",
    },
    secondary: {
      main: "#5c431E",
    },
  },
  // You can customize breakpoints if needed
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  components: {
    MuiChip: {
      styleOverrides: {
        root: {
          "&.MuiChip-outlined" : {
            BorderColor: "rgba(0,0,0, 0.12)",
          },
          "&.MuiChip-filled" : {
            color: "#ffffff"
        }
      },
    },
  }
}
});

export default theme;