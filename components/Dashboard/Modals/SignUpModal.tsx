import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Divider, TextField } from "@mui/material";
import GoogleLoginButton from "@components/Authentication/GoogleLoginButton";
import SignInButton from "@components/Authentication/SignInButton";
import NextLink from "next/link";
import { useState } from "react";
import { profileModalStyle } from "@utils/style-helpers";
import { useRouter } from "next/router";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

export default function SignUpModal({ open }: { open: boolean }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const { device } = useDevice() ?? {};

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={profileModalStyle(device === DeviceTypes.MOBILE ? "95%" : "720px")}>
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.8em",
        }}>
          <Typography sx={{
            fontWeight: "bold",
            fontSize: "28px"
          }}>
            Signup
          </Typography>
          <Typography sx={{
          }}>
            Register to manage your tickets, host salons and access our community.
          </Typography>
          <TextField
            fullWidth
            id="email"
            label="Email"
            variant="outlined"
            margin="normal"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
          <SignInButton email={email} callbackUrl={router.pathname} text="Send Magic Link" />
          <Typography textAlign="center">
            <NextLink href={`/signin?callback=${router.pathname}`} passHref>
              Already have an account? <span style={{ fontWeight: "bold " }}>Log in</span>
            </NextLink>
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
            <Divider sx={{ flexGrow: 1, mr: 1 }} />
          </Box>
          <GoogleLoginButton callbackUrl={router.pathname} />
        </Box>
      </Box>
    </Modal >
  );
};
