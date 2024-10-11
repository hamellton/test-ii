import { Box, Typography, TextField, IconButton } from "@mui/material";
import styled from "styled-components";

// Title for "Number of attendees"
export const NumberOfAttendeesTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: left;
  color: #231f20;
  margin-top: 24px;
  font-family: "Notos Serif";
`;

export const OrderSummaryContainer = styled.div`
  /* background-color: #F1EFE2;
  margin: -24px -32px;
  padding: 24px 32px; */
`;

// Attendee Box, handles attendee name and email input fields
export const TicketInputAttendeeBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  margin-bottom: 16px;

  @media (min-width: 600px) {
    flex-direction: row;
    gap: 16px;
  }
`;

// Container for the buttons and attendee count
export const TicketInputCounterContainer = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  margin-top: 16px;
  gap: 16px;
`;

// Styled IconButton for Add/Remove
export const TicketInputIconButton = styled(IconButton)`
  border: 1px solid rgba(0, 0, 0, 0.23);
  border-radius: 50%;
  width: 44px;
  height: 44px;
  padding: 0;
`;

// Styled TextField for attendee count (centered text)
export const TicketInputTextField = styled(TextField)`
  & .MuiInputBase-root {
    border-radius: 4px;
    width: 74px;
    height: 56px;
  }

  & input {
    padding: 9px 0;
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0.01em;
    text-align: center;
  }

  &&& {
    margin: 0;
  }
`;

// Order summary container
export const TicketInputOrderSummaryContainer = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin: 17px 0;

  p {
    font-family: "Abhaya Libre";
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: 0.01em;
    text-align: center;
    color: #231F20;
  }
`;

// Attendee Label for each input group
export const AttendeeLabel = styled(Typography)`
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
  text-align: center;
  color: #231f20;
  text-align: left;
  margin-bottom: 12px;
`;

export const SpotForMe = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #231F20;
  margin-bottom: 16px;
  cursor: pointer;
  width: fit-content;

  & .mui-style-1bj3u6z-MuiButtonBase-root-MuiCheckbox-root.Mui-checked {
    color: #FC714E;
  }

  span {
    padding: 0;
  }
`;

export const NewsletterCheckbox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #231F20;
  margin-bottom: 16px;
  cursor: pointer;
  width: fit-content;

  & .mui-style-1bj3u6z-MuiButtonBase-root-MuiCheckbox-root.Mui-checked {
    color: #FC714E;
  }

  span {
    padding: 0;
  }
`;

export const OrderSummaryTitle = styled.div`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;
  margin-top: 36px;
`;

export const AttendeeInfoText = styled(Typography)`
  margin: 40px 0;
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
  color: #605054;

  @media (max-width: 600px) {
    margin: 24px 0;
  }
`;