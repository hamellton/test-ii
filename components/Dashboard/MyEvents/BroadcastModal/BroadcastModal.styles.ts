import styled from "styled-components";
import { Button as MuiButton } from "@mui/material";

export const SendButton = styled(MuiButton)`
  padding: 14px 24px !important;
  border: 1px solid #ccc !important;
  font-weight: bold !important;

  svg {
    margin-left: 8px;
    font-size: 1em;
    color: #8060fe;
  }

  @media (max-width: 600px) {
    width: 100%;
  }
`;


export const MessageAttendeesActionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
    gap: 10px;
  }
`;