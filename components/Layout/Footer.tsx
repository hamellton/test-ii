import { Button, Grid, List, ListItem, TextField, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { II_FACEBOOK, II_INSTAGRAM, II_LINKEDIN, II_SUBSTACK, II_TWITTER, II_YOUTUBE, NEWSLETTER_SUBSCRIBE } from "@config";
import { showToast } from "@/store";
import { useState } from "react";
import { useDispatch } from "react-redux";

const linkStyles = {
  lineHeight: "18px",
  fontWeight: "700",
  fontSize: "12px",
  marginLeft: "1em",
};

const upperLinkStyles = {
  color: "white",
  lineHeight: "18px",
  fontSize: {
    xs: "14px",
    md: "14px",
  },
};

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
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: focusColor,
    },
  },
}));



const Footer = () => {
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
  
  const linkGroups = [
    [
      { label: "Home", href: "/" },
      { label: "Salons & Gatherings", href: "/salons" },
      { label: "Hosting", href: "/hosting" }
    ],
    [
      { label: "Life in the Community", href: "/community" },
      { label: "Membership", href: "/membership" },
      { label: "Contact us", href: "mailto:support@interintellect.com" }
    ],
    [
      { label: "Facebook", href: `${II_FACEBOOK}` },
      { label: "Instagram", href: `${II_INSTAGRAM}` },
      { label: "X", href: `${II_TWITTER}` },
      { label: "Substack", href: `${II_SUBSTACK}` },
      { label: "Youtube", href: `${II_YOUTUBE}` },
      { label: "LinkedIn", href: `${II_LINKEDIN}` }
    ],
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
      }}
    >

      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            md: "row",
          },
          paddingTop: "2em",
          paddingBottom: "2em",
          background: "#231F20",
          color: "white",
          marginRight: "0 !important",
          marginLeft: "0 !important",
          maxWidth: "100% !important",
        }}>


        {/* Desktop CTA */}
        <Box sx={{
          maxWidth: "520px",
          display: {
            xs: "none",
            md: "block",
          },
        }}>
          <Typography sx={{
            fontSize: "32px",
            lineHeight: "48px",
            fontWeight: "700",
          }}>
            Stay in the loop
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", alignItems: "center", my: 1 }}>
            <CssTextField 
              id="email-desktop" 
              label="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined" 
              size="small" 
              sx={{
                background: "transparent",
                color: "white",
                borderRadius: 1,
                input: {
                  color: "white"
                }
              }}
              focusColor="white"
              InputLabelProps={{
                sx: {
                // set the color of the label when not shrinked
                  color: "white",
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


        <Box sx={{ maxWidth: "630px" }}>
          <Grid container spacing={2}>
            {linkGroups.map((group, groupIndex) => (
              <Grid item xs={12} md={4} key={groupIndex}>
                <Box>
                  <List>
                    {group.map((link, linkIndex) => (
                      <ListItem key={linkIndex}>
                        <Link href={link.href} passHref>
                          <Typography sx={upperLinkStyles}>
                            {link.label}
                          </Typography>
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>


        {/* Mobile CTA */}
        <Box sx={{
          maxWidth: "520px",
          display: {
            xs: "flex",
            md: "none",
          },
          mt: "2em",
          flexDirection: "column",
        }}>
          <Typography sx={{
            fontSize: "32px",
            lineHeight: "48px",
            fontWeight: "700",
          }}>
            Stay in the loop
          </Typography>

          <Box component="form" noValidate autoComplete="off" sx={{
            display: "flex",
            flexDirection: "column", // Set flex direction to column
            alignItems: "stretch", // Stretch children to fill the width
            my: 1
          }}>
            <CssTextField
              id="email" 
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              size="small"
              sx={{
                width: "100%", // Full width
                background: "transparent",
                color: "white",
                borderRadius: 1,
                input: {
                  color: "white"
                }
              }}
              focusColor="white"
              InputLabelProps={{
                sx: {
                  color: "white",
                }
              }}
            />
            <Button
              variant="contained" 
              sx={{ ml: 1, width: "100%" }} 
              onClick={handleSubscribe}
              disabled={loading}
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </Button>
          </Box>
        </Box>
      </Container>



      <Container maxWidth="xl" sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5em", paddingBottom: "0.5em" }}>
        <Typography variant="body2">
          © Pynchon Ideas, 2024. 2810 N Church St. PMB 59729 Wilmington, Delaware 19802. All Rights Reserved.
        </Typography>
        <Box>
          <Link href="/legal#privacy" style={linkStyles}>
            Privacy Policy
          </Link>
          <Link href="/legal#terms" style={linkStyles}>
            Terms of Service
          </Link>
          <Link href="/host-agreement" style={linkStyles}>
            Host Agreement
          </Link>
          <Link href="/legal#cookie" style={linkStyles}>
            Cookies Settings
          </Link>
        </Box>
      </Container>
    </Box >
  );
};

export default Footer;
