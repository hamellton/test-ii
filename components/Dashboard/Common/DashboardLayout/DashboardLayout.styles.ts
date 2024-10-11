import styled from "styled-components";
import { IconButton, Box, List } from "@mui/material";
import Image from "next/image";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export const CloseMenuButton = styled(IconButton)`
  justify-content: flex-end;
  padding: 16px;
  border: none;

  &:hover {
    background-color: transparent;
    border: none;
  }
`;

export const DrawerToggleButton = styled(IconButton)`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 16px;
  border: none;

  &:hover {
    background-color: transparent;
    border: none;
  }
`;

export const LogoContainer = styled(Box)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  transition: padding 0.3s;

  svg {
    cursor: pointer;
  }
`;

export const LogoWrapper = styled.a`
  width: 100%;
  display: flex;
`;

export const LogoImage = styled(Image)`
  height: 28px;
  max-width: 156px;
  transition: opacity 0.3s;
`;

export const MobileMenuContainer = styled(Box)`
  display: none;
  @media (max-width: 600px) {
    padding: 20px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
`;

export const StyledListItemButton = styled(ListItemButton)<{ openMenu: boolean }>`
  justify-content: flex-start;
  gap: 35px;
  ${(props) => !props.openMenu && `
    padding: 8px;
    justify-content: center;
  `}
`;

export const StyledListItemIcon = styled(ListItemIcon)`
  min-width: 20px;
  justify-content: center;
`;

export const StyledListItemText = styled(ListItemText)<{ openMenu: boolean }>`
  display: ${(props) => (props.openMenu ? "block" : "none")};
  color: #231F20;
`;

export const DashboardLayoutMainContent = styled(Box)<{ isAdminPage?: boolean }>`
  flex-grow: 1;
  background-color: #F9F9F9;
  padding: ${({ isAdminPage }) => isAdminPage ? "0" : "3rem"};
  padding-left: ${({ isAdminPage }) => isAdminPage ? "0" : "64px"};
  padding-top: ${({ isAdminPage }) => isAdminPage ? "0" : "64px"};
  padding-right: ${({ isAdminPage }) => isAdminPage ? "0" : "64px"};
  min-height: 100vh;

  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
    background-color: #F9F9F9;
    /* display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column; */
  }
`;

export const ListContainer = styled(List)`
  overflow-x: hidden;
`;

export const ExpandHeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 11px;

  svg {
    color: #827A7A;
  }
`;