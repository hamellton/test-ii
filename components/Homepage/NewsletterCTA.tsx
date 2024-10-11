import { showToast } from "@/store";
import { NEWSLETTER_SUBSCRIBE } from "@config";
import { Box, Button, Container, TextField, Typography, styled } from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { useDispatch } from "react-redux";

// First, declare a type for the props you expect, including the custom ones
interface CssTextFieldProps {
  focusColor?: string; // Add other custom props as needed
}

// Then, declare your styled component with the extended props
const CssTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "focusColor",
})<CssTextFieldProps>(({ focusColor, ...other }) => ({
  // Use focusColor as a regular prop here
  "& label.Mui-focused": {
    color: focusColor,
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: focusColor,
  },
  "& .MuiFilledInput-underline:after": {
    borderBottomColor: focusColor,
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#827A7A",
    },
    "&:hover fieldset": {
      borderColor: "#827A7A",
    },
    "&.Mui-focused fieldset": {
      borderColor: focusColor,
    },
  },
}));

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dispatch = useDispatch();
  const handleSubscribe = async () => {
    setLoading(true);
    setSuccess("");
    setError("");

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      dispatch(showToast({ message: "Please enter a valid email." }));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(NEWSLETTER_SUBSCRIBE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.status === "exists") {
          dispatch(showToast({ message: "You are already subscribed to the newsletter." }));
        } else if (data.status === "success") {
          dispatch(showToast({ message: "Thank you for subscribing!", success: true }));
          setEmail("");
        } else if (data.status === "resubscribed") {
          dispatch(showToast({ message: "Thank you for subscribing!", success: true }));
          setEmail("");
        } else {
          dispatch(showToast({ message: "An unexpected response was received.", success: false }));
        }
      } else {
        dispatch(showToast({ message: data.message || "Failed to subscribe", success: false }));
      }
    } catch (error: any) {
      dispatch(showToast({ message: error.message || "Something went wrong!", success: false }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{
      marginRight: "0 !important",
      marginLeft: "0 !important",
      maxWidth: "100% !important",
      paddingTop: "4em",
      paddingBottom: "4em",
      display: "flex",
      justifyContent: "center",
    }}>


      <Box sx={{
        display: {
          xs: "flex",
          md: "none",
        },
        flexDirection: "column",
        mt: 1,
        padding: 6,
      }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "0",
            lineHeight: "1em",
            width: "100%", // Ensure the Typography component takes full width
          }}
        >
          Join our newsletter!
        </Typography>
        <p>Stay up to date on early bird discounts, our newest listings, special offers, personal recommendations, celebrity salons, video recaps, and host trainings.</p>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}>
          <CssTextField 
            id="email" 
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="outlined" 
            size="small"
            sx={{
              background: "transparent",
              color: "#827A7A",
              borderRadius: 1,
              input: {
                color: "#827A7A"
              },
              width: "100%"
            }}
            focusColor="#827A7A"
            InputLabelProps={{
              sx: {
              // set the color of the label when not shrinked
                color: "#827A7A",
              }
            }}
          />
          <Button
            variant="contained" 
            sx={{ ml: 1 }} 
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </Button>
        </Box>
      </Box>


      {/* Desktop CTA */}
      <Box sx={{
        display: {
          xs: "none",
          md: "flex"
        },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        width: "50%",
        maxWidth: "922px",
        marginRight: "3em",
        textAlign: "center",
        border: "1px solid #C4C4C4",
        borderRadius: "12px",
        padding: "40px",
        paddingLeft: "64px",
        paddingRight: "64px",
        boxShadow: "0px 4px 6px -2px #00000008",
        position: "relative",
      }}>
        <Image src="/images/hourglass.svg" alt="hourglass"
          style={{
            position: "absolute",
            top: "-34px",
            left: "20px",
          }}
          width={60}
          height={102}
        />
        <Image src="/images/book.svg" alt="book"
          style={{
            position: "absolute",
            bottom: "8px",
            right: "-26px",
          }}
          width={90}
          height={102}
        />
        <Typography
          variant="h2"
          component="h2"
          sx={{
            fontSize: "32px",
            fontWeight: 700,
            marginBottom: "0",
            lineHeight: "1em",
            textAlign: "center", // Align text center here
            width: "100%", // Ensure the Typography component takes full width
          }}
        >
          Join our newsletter!
        </Typography>
        <p>Stay up to date on early bird discounts, our newest listings, special offers, personal recommendations, celebrity salons, video recaps, and host trainings.</p>
        <Box display={"flex"} justifyContent={"center"} width={"100%"}>
          <Box 
            component="form" 
            noValidate 
            autoComplete="off" 
            sx={{ display: "flex", alignItems: "center", }}>
            <CssTextField 
              id="email-desktop" 
              label="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined" 
              size="small" sx={{
                background: "transparent",
                color: "#827A7A",
                borderRadius: 1,
                input: {
                  color: "#827A7A"
                }
              }}
              focusColor="#827A7A"
              InputLabelProps={{
                sx: {
                // set the color of the label when not shrinked
                  color: "#827A7A",
                }
              }}
            />
            <Button 
              variant="contained" 
              sx={{ ml: 1 }} 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </Box>

        </Box>
      </Box>
    </Container >
  );
}
