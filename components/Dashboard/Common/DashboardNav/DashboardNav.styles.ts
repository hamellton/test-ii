import styled from "styled-components";
import { Link as MuiLink, Typography as MuiTypography } from "@mui/material";

export const NavContainer = styled.div<{isSuccessPage: boolean}>`
  display: flex;
  max-width: 720px;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2em;

  @media (max-width: 600px) {
    margin-bottom: ${props => props.isSuccessPage ? "25px" : "0"};
    gap: 20px;
  }
`;

export const StyledLink = styled(MuiLink)`
  text-decoration: none;
  cursor: pointer;
`;

export const StyledEditButton = styled.div`
  text-decoration: none;
  cursor: pointer;
`;

export const NavContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

export const StyledTypography = styled(MuiTypography)`
  font-weight: bold;
  text-decoration: none;
  white-space: nowrap;
`;
