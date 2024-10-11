import { Box, Typography, Button, Dialog, DialogContent } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "styled-components";

export const TicketCartDialog = styled(Dialog)`
  & .MuiDialog-paper {
    position: absolute;
    top: 0;
    max-width: 800px;
    width: 100%;
    max-height: calc(100% - 64px);
    overflow-y: auto;
    background-color: #FFFEF4;
    border-radius: 12px;
    margin: 0;

    @media (max-width: 600px) {
      max-width: 100%;
      margin: 0;

      width: 100%;
      height: 100vh;
      border: none;
      max-height: 100%;
      border-radius: 0;
    }

    @media (min-width: 600px) {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

export const TicketCartDialogContent = styled(DialogContent)`
  padding: 24px 32px;

  height: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

export const TicketCartCloseIcon = styled(ClearIcon)`
  display: block;
  margin-bottom: 16px;

  @media (min-width: 600px) {
    display: none;
  }
`;

export const TicketCartSalonTitle = styled(Typography)`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;
`;

export const TicketCartSalonTitleBox = styled(Box)`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  
  p {
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0.01em;
    text-align: left;
    color: #605054;
  }
`;

export const TicketCartForm = styled.form`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const TicketCartSubmitButton = styled(Button)`
  white-space: nowrap;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #231F20;

  @media (max-width: 600px) {
    padding: 12px 32px;
    margin-bottom: 24px;
    width: 100%;
  }
`;

export const TicketCartAlertBox = styled(Box)`
  margin-bottom: 16px;
  width: 760px;
`;

export const TicketCartButtonContainer = styled(Box)`
  margin-top: 16px;
  text-align: right;

  @media (max-width: 600px) {
    padding: 24px 32px;
  }
`;
