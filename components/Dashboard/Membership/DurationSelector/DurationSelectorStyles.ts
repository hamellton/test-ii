import styled from "styled-components";
import { Box } from "@mui/material";

interface StyledBoxProps {
  color: string;
  selected: boolean;
  mt: string;
}

export const DurationSelectorBox = styled(Box)<StyledBoxProps>`
  background-color: ${({ color }) => color};
  padding: 4px 8px;
  border-radius: 16px 16px 16px 0px;
  display: inline-flex;
  opacity: ${({ selected }) => (selected ? 1 : 0.5)};
  margin-top: ${({ mt }) => mt};
`;

export const DurationSelectorTypography = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-left: 3px;
  margin-top: 1px;
  margin-right: 1px;
  font-family: "Abhaya Libre, serif";
  color: #231F20;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;
