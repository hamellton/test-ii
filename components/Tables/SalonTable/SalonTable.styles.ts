import styled from "styled-components";
import { Box, Paper, Typography } from "@mui/material";

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