import styled from "styled-components";
import { Box, Typography, Tabs as MuiTabs, Tab as MuiTab, InputLabel, FormControl } from "@mui/material";

export const ResponsiveBox = styled(Box)<{ isAdminPage?: boolean }>`
  margin-bottom: 2em;
  max-width: 1100px;
  /* max-width: 100%; */

  @media (max-width: 768px) {
    width: 100%;
    padding: 0;
    margin-top: ${({ isAdminPage }) => (isAdminPage ? "-70px" : "0")};
  }
`;

export const ResponsiveTypography = styled(Typography)`
  font-size: 32px;
  line-height: 150%;
  font-weight: bold;
  margin-bottom: 0.5em;

  @media (max-width: 768px) {
    font-size: 24px;
    margin-top: 20px;
  }
`;

export const ResponsiveActionBox = styled(Box)`
  margin-top: 2em;
  display: flex;
  gap: 2em;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
  }
`;

export const CustomTabs = styled(MuiTabs)`
  .MuiTabs-indicator {
    background-color: #8060FE;
  }
`;

export const CustomTabsHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const CustomTab = styled(MuiTab)`
  &.Mui-selected {
    /* color: #8060FE; */
  }
`;

export const SalonTableContainer = styled(Box)`
  margin-top: 64px;

  @media (max-width: 768px) {
    margin-top: 2em;
  }
`;

export const CustomInputLabel = styled(InputLabel)({
  position: "absolute",
  left: "12px",
  padding: "0 4px",
  color: "#00000099",
  backgroundColor: "#fff",
  fontSize: "12px",
  fontWeight: "400",
  transform: "translateY(-50%)",
  zIndex: "2",
  lineHeight: "12px"
});

export const CustomFormControl = styled(FormControl)({
  position: "relative",
  marginBottom: "16px",
});