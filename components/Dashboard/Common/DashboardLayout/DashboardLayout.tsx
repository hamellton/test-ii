import { useState, ReactNode, useEffect, useRef } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
// import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
// import SupportIcon from "@mui/icons-material/Support";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import SignUpModal from "../../Modals/SignUpModal";
import LoadingModal from "../../Modals/LoadingModal";
import { frontEndAuthResponse } from "@utils/types";
import MenuIcon from "@mui/icons-material/Menu";
import { Collapse, SvgIcon, SvgIconProps, Box } from "@mui/material";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import {
  DashboardLayoutMainContent,
  DrawerToggleButton,
  LogoContainer,
  LogoImage,
  MobileMenuContainer,
  StyledListItemButton,
  StyledListItemIcon,
  StyledListItemText,
  ListContainer,
  ExpandHeadingContainer,
  LogoWrapper
} from "./DashboardLayout.styles";
import useSWR from "swr";
import { EventCategories, EventNames, USER_STATUS_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";
import { useRouter } from "next/router";
import { logEvent } from "@utils/analytics";

const chevronRightIcon = (onClick: () => void, showMenu: boolean) => {
  if (showMenu) {
    return (
      <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
        <path d="M7.41 1.41L6 0L0 6L6 12L7.41 10.59L2.83 6L7.41 1.41Z" fill="#827A7A" />
      </svg>
    );
  } else {
    return (
      <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClick}>
        <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="#827A7A" />
      </svg>
    );
  }
};

const DiscordIcon: React.FC<SvgIconProps> = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
  </SvgIcon>
);

export default function PermanentDrawerLeft({ isLoading, children, hideMenu }: { hideMenu?: boolean, isLoading: boolean, user?: frontEndAuthResponse, children: ReactNode }) {
  const [open, setOpen] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<boolean>(true);
  const [dashboardIsLoading, setDashboardIsLoading] = useState<boolean>(false);
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const router = useRouter();

  const { data: user, error: userStatusError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        requestAnimationFrame(() => {
          setHeaderHeight(headerRef.current?.offsetHeight || 0);
        });
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);

    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  useEffect(() => {
    setDashboardIsLoading(!user || !!userStatusError);
  }, [user, userStatusError]);

  const { device } = useDevice() ?? {};
  const { data: session } = useSession();

  useEffect(() => {
    if (device === DeviceTypes.MOBILE) {
      setOpenMenu(false);
    } else {
      setOpenMenu(true);
    }
  }, [device]);

  const handleClick = () => {
    setOpen(!open);
    logEvent(EventCategories.MENU, open ? EventNames.CLOSE : EventNames.OPEN);
  };

  const handleShowMenu = () => {
    setOpen(!openMenu);
    setOpenMenu(!openMenu);
    logEvent(EventCategories.MENU, openMenu ? EventNames.CLOSE : EventNames.OPEN);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });

    localStorage.removeItem("salonData");
    localStorage.removeItem("fileMeta");
    localStorage.removeItem("fileDataUrl");
    logEvent(EventCategories.USER_ACTION, EventNames.LOGOUT_CLICKED);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMyEventsClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_MY_EVENTS_CLICKED);
    router.push("/dashboard/my-events");
  };

  const handleLogoClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.HOMEPAGE_CLICK, "User clicked on the logo");
  };

  const handleHomepageClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.HOMEPAGE_CLICK);
  };

  const handleMyTicketsClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_MY_TICKETS_CLICK);
  };

  const handleHostProfileClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_HOST_PROFILE_CLICKED);
  };

  const handlePaymentsClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_PAYMENTS_CLICKED);
  };

  const handleAdminClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_ADMIN_CLICKED);
  };

  const handleMembershipClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.MEMBERSHIP_CLICKED);
  };

  const handleDiscordConnectClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_DISCORD_CONNECT);
  };

  const handleSettingsClick = () => {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SETTINGS_CLICKED);
  };

  // Determine if the current path is `/dashboard/admin`
  const isAdminPage = router.pathname === "/dashboard/admin";

  return (
    <>
      <SignUpModal open={user ? user.isLoggedIn === false : false} />
      <Box sx={{ display: "flex" }}>
        {isLoading && dashboardIsLoading && <LoadingModal isLoading={isLoading && dashboardIsLoading} />}
        {session && !hideMenu && (openMenu || device !== DeviceTypes.MOBILE) && (
          <Drawer
            sx={{
              padding: "16px",
              width: openMenu ? (device !== DeviceTypes.MOBILE ? 240 : "100%") : 72,
              flexShrink: 0,
              transition: "width 0.3s ease",
              position: device !== DeviceTypes.DESKTOP ? "absolute" : "static",
              "& .MuiDrawer-paper": {
                width: openMenu ? (device !== DeviceTypes.MOBILE ? 240 : "100%") : 72,
                boxSizing: "border-box",
                transition: "width 0.3s ease",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <LogoContainer onClick={handleLogoClick}
              style={{ 
                justifyContent: openMenu ? "space-between" : "center", 
                paddingLeft: openMenu ? "22px" : "16px", 
                width: openMenu ? "auto" : "72px" 
              }}
            >
              {openMenu && (
                <LogoWrapper href="/"><LogoImage src="/images/logos/dashboard-logo.png" alt="logo" layout="responsive" height={28} width={156} /></LogoWrapper>
              )}
              {chevronRightIcon(handleShowMenu, openMenu)}
            </LogoContainer>
            <Divider />
            <ListContainer>
              <Link href="/">
                <StyledListItemButton openMenu={openMenu} onClick={handleHomepageClick}>
                  <StyledListItemIcon><HomeIcon /></StyledListItemIcon>
                  <StyledListItemText primary="Homepage" openMenu={openMenu} />
                </StyledListItemButton>
              </Link>
              <Link href="/dashboard/tickets">
                <StyledListItemButton openMenu={openMenu} onClick={handleMyTicketsClick}>
                  <StyledListItemIcon><ConfirmationNumberIcon /></StyledListItemIcon>
                  <StyledListItemText primary="My Tickets" openMenu={openMenu} />
                </StyledListItemButton>
              </Link>
              <StyledListItemButton onClick={openMenu ? handleClick : handleMyEventsClick} openMenu={openMenu}>
                <StyledListItemIcon><EventIcon /></StyledListItemIcon>
                {openMenu && (
                  <ExpandHeadingContainer>
                    <StyledListItemText primary="Host Hub" openMenu={openMenu} />
                    {open ? <ExpandLess /> : <ExpandMore />}
                  </ExpandHeadingContainer>
                )}
              </StyledListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link href="/dashboard/my-events">
                    <StyledListItemButton openMenu={openMenu} sx={{ pl: 9 }} onClick={handleMyEventsClick}>
                      <StyledListItemText primary="My Events" openMenu={openMenu} />
                    </StyledListItemButton>
                  </Link>
                  <Link href="/dashboard/host-profile">
                    <StyledListItemButton openMenu={openMenu} sx={{ pl: 9 }} onClick={handleHostProfileClick}>
                      <StyledListItemText primary="Host Profile" openMenu={openMenu} />
                    </StyledListItemButton>
                  </Link>
                  <Link href="/dashboard/payments">
                    <StyledListItemButton openMenu={openMenu} sx={{ pl: 9 }} onClick={handlePaymentsClick}>
                      <StyledListItemText primary="Payments" openMenu={openMenu} />
                    </StyledListItemButton>
                  </Link>
                  {user?.isAdmin && (
                    <Link href="/dashboard/admin" onClick={handleAdminClick}>
                      <StyledListItemButton openMenu={openMenu} sx={{ pl: 9 }}>
                        <StyledListItemText primary="Admin" openMenu={openMenu} />
                      </StyledListItemButton>
                    </Link>
                  )}
                </List>
              </Collapse>
              <Link href={`${process.env.NEXT_PUBLIC_MEMBERFUL_URL}/account/subscriptions`}>
                <StyledListItemButton openMenu={openMenu} onClick={handleMembershipClick}>
                  <StyledListItemIcon><PeopleIcon /></StyledListItemIcon>
                  <StyledListItemText primary="Membership" openMenu={openMenu} />
                </StyledListItemButton>
              </Link>
              {user?.isMember || user?.isHost && (
                <Link href="https://interintellect.memberful.com/account/discord/authorize">
                  <StyledListItemButton openMenu={openMenu} onClick={handleDiscordConnectClick}>
                    <StyledListItemIcon><DiscordIcon /></StyledListItemIcon>
                    <StyledListItemText primary="Connect Discord" openMenu={openMenu} />
                  </StyledListItemButton>
                </Link>
              )}
              <Divider />
              {/* <Link href="/dashboard/support">
                <StyledListItemButton openMenu={openMenu}>
                  <StyledListItemIcon><SupportIcon /></StyledListItemIcon>
                  <StyledListItemText primary="Support" openMenu={openMenu} />
                </StyledListItemButton>
              </Link> */}
              {/* <Link href="/dashboard/orders">
                <StyledListItemButton openMenu={openMenu}>
                  <StyledListItemIcon><ShoppingCartIcon /></StyledListItemIcon>
                  <StyledListItemText primary="Orders" openMenu={openMenu} />
                </StyledListItemButton>
              </Link> */}
              <Link href="/dashboard/settings">
                <StyledListItemButton openMenu={openMenu} onClick={handleSettingsClick}>
                  <StyledListItemIcon><SettingsIcon /></StyledListItemIcon>
                  <StyledListItemText primary="Settings" openMenu={openMenu} />
                </StyledListItemButton>
              </Link>
              <Divider />
              <StyledListItemButton onClick={handleLogout} openMenu={openMenu}>
                <StyledListItemIcon><LogoutIcon /></StyledListItemIcon>
                <StyledListItemText primary="Log out" openMenu={openMenu} />
              </StyledListItemButton>
            </ListContainer>
          </Drawer>
        )}
        <MobileMenuContainer ref={headerRef}>
          <LogoImage src="/images/logos/dashboard-logo.png" alt="logo" layout="responsive" height={28} width={156} />
          {chevronRightIcon(handleShowMenu, openMenu)}
        </MobileMenuContainer>
        {!drawerOpen && !isLoading && !dashboardIsLoading && device === DeviceTypes.MOBILE && (
          <DrawerToggleButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
          >
            <MenuIcon />
          </DrawerToggleButton>
        )}
        <DashboardLayoutMainContent isAdminPage={isAdminPage}>
          {device === DeviceTypes.MOBILE && <Box sx={{ height: headerHeight - 14 }} />}
          {children}
        </DashboardLayoutMainContent>
      </Box>
    </>
  );
}
