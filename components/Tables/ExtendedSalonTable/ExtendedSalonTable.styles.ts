import styled from "styled-components";
import { Box, Paper, Typography, TableCell } from "@mui/material";

export const TableContainerStyled = styled(Paper)`
  @media (max-width: 600px) {
    display: none;
  }
`;

export const CardContainer = styled(Box)`
  display: none;
  
  @media (max-width: 600px) {
    display: block;
    margin-bottom: 16px;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
`;

export const TableCellStyled = styled(TableCell)<{ isHeading?: boolean, alignText?: boolean }>`
  font-size: ${(props) => (props.isHeading ? "16px" : "15px")};
  font-weight: ${(props) => (props.isHeading ? "700" : "400")};
  text-align: ${(props) => (props.alignText ? "center" : "left")};
  white-space: nowrap;
`;

export const CardTitle = styled(Typography)`
  font-weight: bold;
  font-size: 14px;
  margin-bottom: 0.5em;
`;

export const EventDetailsTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 1em;
`;

export const EventDetails = styled.div`
  margin-bottom: 1em;
`;

export const InfoText = styled(Typography)`
  font-size: 14px;
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;

  div {
    font-weight: bold;
  }
`;

export const IconTextContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 0.5em;
`;