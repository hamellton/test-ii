import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AppBar,
  Box,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import styled from "styled-components";
import Image from "next/image";
import {
  logAppBarCloseClick,
  logCommunityClick,
  logHostingClick,
  logSalonsAndGatheringsClick,
  logLoginClick,
  logLogoutClick,
  logMembershipClick,
  logMyDashboardClick,
  logSignUpClick,
  // logListSalonClick
} from "@utils/analytics-helpers";

interface ActiveLinkProps {
  isActive: boolean;
  children: React.ReactNode;
  href: string;
  onClick: () => void;
}

const ActiveLink = styled(({ isActive, ...props }: ActiveLinkProps) => (
  <Link {...props} />
))(({ isActive }) => ({
  color: isActive ? "#FC714E" : "inherit",
  textDecoration: isActive ? "underline" : "none",
  textUnderlineOffset: "4px",
  textDecorationColor: "#FC714E",
}));

const StyledAppBar = styled(AppBar)`
  background-color: transparent;
  color: #231F20;
  box-shadow: none;
  padding: 20px;

  @media (max-width: 768px) {
    border-bottom: 1px solid #C4C4C4;
    padding: 15px 15px 5px 15px;
  }
`;

const LogoContainer = styled(Box)`
  /* max-width: 130px; */
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0;
  height: auto;
`;

const MenuContainer = styled(Box)`
  display: none;
  flex-grow: 1;
  align-items: center;
  justify-content: center;
  gap: 32px;

  @media (min-width: 600px) {
    display: flex;
  }
`;

const ActionButtonContainer = styled(Box)`
  flex-grow: 0;
  display: none;
  align-items: center;

  @media (min-width: 600px) {
    display: flex;
  }
`;

const StyledButton = styled(Button)`
  padding: 7px 20px;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  text-transform: none;
`;

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
      switch (url) {
      case "/salons":
        logSalonsAndGatheringsClick();
        break;
      case "/hosting":
        logHostingClick();
        break;
      case "/community":
        logCommunityClick();
        break;
      case "/membership":
        logMembershipClick();
        break;
      case "/dashboard":
        logMyDashboardClick();
        break;
      case "/logout":
        logLogoutClick();
        break;
      case "/signin":
        logLoginClick();
        break;
      case "/signup":
        logSignUpClick();
        break;
      default:
        break;
      }
      router.push(url);
    }
  };

  return (
    <Box id="header">
      <StyledAppBar position="static">
        <StyledToolbar>
          <Link href="/" legacyBehavior>
            <a>
              <LogoContainer>
                <Image src="/main-logo.png" alt="Interintellect Logo" width={190} height={40} />
              </LogoContainer>
            </a>
          </Link>

          <MenuContainer>
            <ActiveLink href="/salons" onClick={logSalonsAndGatheringsClick} isActive={router.pathname === "/salons"}>
              Salons & Gathering
            </ActiveLink>
            <ActiveLink href="/hosting" onClick={logHostingClick} isActive={router.pathname === "/hosting"}>
              Become a Host
            </ActiveLink>
            <ActiveLink href="/community" onClick={logCommunityClick} isActive={router.pathname === "/community"}>
              Community
            </ActiveLink>
            <ActiveLink href="/membership" onClick={logMembershipClick} isActive={router.pathname === "/membership"}>
              Plans
            </ActiveLink>
          </MenuContainer>

          <ActionButtonContainer>
            {session && (
              <StyledButton onClick={handleLogout}>
                Log out
              </StyledButton>
            )}
            {!session && (
              <Box sx={{ display: "flex", gap: 4, alignItems: "center", justifyContent: "flex-end", width: "190px" }}>
                <Link href="/signin" onClick={logLoginClick}>
                  <StyledButton variant="contained" color="secondary">
                    Login
                  </StyledButton>
                </Link>
                {/* <Link href="/signup" onClick={logSignUpClick}>
                  Sign up
                </Link> */}
                {/* <Link href={"/dashboard/salon"} onClick={logListSalonClick}>
                  <Button variant="contained" color="secondary">
                    List a salon
                  </Button>
                </Link> */}
              </Box>
            )}
            {session && (
              <Link href={"/dashboard"} onClick={logMyDashboardClick}>
                <StyledButton variant="contained" color="secondary">
                  My Dashboard
                </StyledButton>
              </Link>
            )}
          </ActionButtonContainer>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, justifyContent: "flex-end" }}>
            <IconButton sx={{padding: 0 }} size="large" edge="start" color="inherit" aria-label="menu" onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
              <MenuItem onClick={() => handleClose("/salons")}>Salons</MenuItem>
              <MenuItem onClick={() => handleClose("/hosting")}>Hosting</MenuItem>
              <MenuItem onClick={() => handleClose("/community")}>Community</MenuItem>
              <MenuItem onClick={() => handleClose("/membership")}>Plans</MenuItem>
              {!session && <MenuItem onClick={() => handleClose("/signin")}>Login</MenuItem>}
              {/* {session && <MenuItem onClick={() => handleClose("/signup")}>Sign up</MenuItem>} */}
              {session && <MenuItem onClick={() => handleClose("/dashboard")}>My Dashboard</MenuItem>}
            </Menu>
          </Box>
        </StyledToolbar>
      </StyledAppBar>
    </Box>
  );
}