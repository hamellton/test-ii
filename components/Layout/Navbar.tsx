import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { Fira_Sans } from "next/font/google";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AppBar, Box, Toolbar, Typography, Button, Menu, MenuItem } from "@mui/material";
import { logAppBarCloseClick, logCommunityClick, logHostingClick, logListSalonClick, logLoginClick, logLogoutClick, logMembershipClick, logMyDashboardClick, logSalonsAndGatheringsClick, logSignUpClick } from "@utils/analytics-helpers";

const firaSans = Fira_Sans({
  subsets: ["latin"],
  weight: "700",
});

export default function ButtonAppBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    await signOut({ redirect: false, callbackUrl: "/" });
  
    localStorage.removeItem("salonData");
    localStorage.removeItem("fileMeta");
    localStorage.removeItem("fileDataUrl");
  
    logLogoutClick();
    window.location.href = "/";
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    logAppBarCloseClick();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (url?: string) => {
    logAppBarCloseClick();
    setAnchorEl(null);
    if (url) {
      if (url === "/dashboard") {
        logMyDashboardClick();
      } else if (url === "/salons") {
        logSalonsAndGatheringsClick();
      } else if (url === "/hosting") {
        logHostingClick();
      } else if (url === "/community") {
        logCommunityClick();
      } else if (url === "/dashboard/salon") {
        logListSalonClick();
      } else if (url === "/logout") {
        logLogoutClick();
      }

      router.push(url);
    }
  };

  return (
    <Box>
      <AppBar position="static" style={{ backgroundColor: "transparent", color: "black", boxShadow: "none", borderBottom: "1px solid #C4C4C4" }}>
        <Toolbar>
          <Link href={"/"}>
            <Box sx={{ maxWidth: "130px", pt: 0.5 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: "20px",
                  color: "black",
                  fontFamily: "Fira Sans",
                  letterSpacing: "0.1em" // Add letter spacing here
                }}
                className={firaSans.className}
              >
                Interintellect
              </Typography>
            </Box>
          </Link>

          {/* Mobile Navbar */}
          <Box sx={{
            display: { xs: "flex", md: "none" },
            flexGrow: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
          }}>
            <Link href="/membership" onClick={logMembershipClick}>
              Membership
            </Link>
            <div>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MenuIcon />
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => handleClose()}
                MenuListProps={{ "aria-labelledby": "basic-button" }}
              >
                <MenuItem onClick={() => handleClose("/dashboard")}>My Dashboard</MenuItem>
                <MenuItem onClick={() => handleClose("/salons")}>Salons and Gathering</MenuItem>
                <MenuItem onClick={() => handleClose("/hosting")}>Hosting</MenuItem>
                <MenuItem onClick={() => handleClose("/community")}>Community</MenuItem>
                <MenuItem onClick={() => handleClose("/dashboard/salon")}>List a salon</MenuItem>
                <MenuItem onClick={() => handleClose("/logout")}>Logout</MenuItem>
              </Menu>
            </div>
          </Box>


          {/* Desktop Navbar */}
          <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 1, flex: "grow", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Link href="/salons" onClick={logSalonsAndGatheringsClick}>
              Salons & Gatherings
            </Link>
            <Link href="/hosting" onClick={logHostingClick}>
              Hosting
            </Link>
            <Link href="/community" onClick={logCommunityClick}>
              Community
            </Link>
            <Link href="/membership" onClick={logMembershipClick}>
              Membership
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "none", md: "flex" }, alignItems: "center" }}>
            {session && (
              <Button color="inherit" sx={{ mr: 2, textTransform: "none" }} onClick={handleLogout}>
                Log out
              </Button>
            )}
            {!session && (
              <Box sx={{
                display: "flex",
                gap: 4,
                alignItems: "center",
              }}>
                <Link href="/signin" onClick={logLoginClick}>
                  Log in
                </Link>
                <Link href="/signup" onClick={logSignUpClick}>
                  Sign up
                </Link>
                <Link href={"/dashboard/salon"} onClick={logListSalonClick}>
                  <Button variant="contained" color="secondary" sx={{ padding: "10px 18px" }}>
                    List a salon
                  </Button>
                </Link>
              </Box>
            )}
            {session && (
              <Link href={"/dashboard"} onClick={logMyDashboardClick}>
                <Button variant="contained" color="secondary" sx={{ padding: "10px 18px" }}>
                  My Dashboard
                </Button>
              </Link>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box >
  );
}