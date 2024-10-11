import { EventCategories, EventNames } from "@config";
import { Button, Typography } from "@mui/material";
import { logEvent } from "@utils/analytics";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function GoogleLoginButton({ callbackUrl }: { callbackUrl: string }) {

  const handleGoogleLoginClick = () => {
    logEvent(EventCategories.USER_ACTION, EventNames.GOOGLE_LOGIN_CLICKED);
  };

  const handleClick = () => {
    handleGoogleLoginClick();
    signIn("google", { callbackUrl: callbackUrl });
  };
  
  return (
    <Button
      fullWidth
      variant="outlined"
      sx={{
        mt: 2,
        pt: "12px",
        pb: "12px",
        display: "flex",
        alignItemss: "center",
      }}
      onClick={handleClick}
    >
      <Image src="/icons/google-favicon.svg" alt="" width={24} height={24} />
      <Typography variant="button" sx={{
        fontWeight: "bold",
        textTransform: "none",
        ml: "12px",
        mt: 0.4,
      }}>
        Continue with Google
      </Typography>
    </Button>
  );
}