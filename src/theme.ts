import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import { blue, red } from "@mui/material/colors";

export const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  typography: {
    fontFamily: "Public Sans, sans-serif",
    h1: {
      fontSize: "48px",
      fontWeight: 700,
    },
    h2: {
      fontSize: "25px",
      fontWeight: 400,
      lineHeight: "56px",
    },
    h3: {
      fontSize: "18px",
      fontWeight: 400,
    }
  },
  components: {
    // Apply styles globally
    MuiSelect: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#AEA5A5",
            },
            "&:hover fieldset": {
              borderColor: "#8060FE",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8060FE",
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#AEA5A5",
            },
            "&:hover fieldset": {
              borderColor: "#8060FE",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#8060FE",
            },
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        a: {
          color: "black",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiButton: {
      variants: [
        // Name of the variant
        {
          props: { variant: "contained" },
          style: {
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "24px",
            background: "linear-gradient(89.31deg, #FFC2B3 0%, #CFC3FF 100%)",
            borderRadius: "8px",
            border: 0,
            color: "black",
            padding: "18px 32px",
            boxShadow: "none",
            textTransform: "none",
            "&:hover": {
              boxShadow: "0 5px 7px 2px rgba(255, 105, 135, .3)",
              transform: "scale(1.05)",
            },
            "&:active": {
              boxShadow: "0 1px 5px 2px rgba(255, 105, 135, .3)",
            },
            "@media (max-width:600px)": {
              padding: "10px 18px",
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            fontWeight: 600,
            fontSize: "16px",
            lineHeight: "24px",
            background: "transparent",
            borderRadius: "8px",
            border: "1px solid #231F20",
            color: "#231F20",
            padding: "18px 32px",
            boxShadow: "none",
            textTransform: "none",
            "&:hover": {
              boxShadow: "none",
              transform: "none",
              backgroundColor: "transparent",
              borderColor: "unset", // If the button inherits a border on hover
              color: "unset", // If the text color changes on hover
            },
            "&:active": {
              boxShadow: "0 1px 5px 2px rgba(255, 105, 135, .3)",
            },
            "@media (max-width:600px)": {
              padding: "10px 18px",
            },
          },
        }
      ],
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderRadius: "8px",
          background: "transparent",
        },
      },
    }
  },
});

export default theme;
