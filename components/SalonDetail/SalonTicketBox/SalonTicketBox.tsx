import { useState } from "react";
import { Box, Button, Divider, Alert } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { getRemainingMemberSpaces, getRemainingPublicSpaces, canMemberCheckout, attendingCurrentSalon } from "@utils/frontend-helpers";
import { ExtendedSalon, HTTPMethod, frontEndAuthResponse } from "@utils/types";
import { ticketBoxStyle } from "@utils/style-helpers";
import { submitData } from "@utils/form-creation-helpers";
import { PUBLIC_TICKET_ENDPOINT } from "@config";
import { Styled } from "./SalonTicketBox.styles";
import { logSalonTicketBoxMemberPurchase, logSalonTicketBoxPurchaseButtonClick } from "@utils/analytics-helpers";

const SOLD_OUT = "SOLD OUT";

export default function SalonTicketBox({
  salon,
  user,
  handleModalOpen
}: {
  salon: ExtendedSalon,
  user: frontEndAuthResponse,
  handleModalOpen: () => void
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const membersOnlyTags = ["membersOnly", "discordMeetup", "readingSalon", "singlesMingles", "workshopSalon"];
  // const hostOnlyTags = ["hostsOnly", "hostTraining"];

  const publicPrice = salon.publicPrice || 0;
  const startTime = new Date(salon.startTime) || new Date();

  const remainingPublicSpacesMessage = getRemainingPublicSpaces(salon) > 0
    ? `${getRemainingPublicSpaces(salon)} spaces left`
    : SOLD_OUT;

  const remainingMemberSpacesMessage = getRemainingMemberSpaces(salon) > 0 
    ? `${getRemainingMemberSpaces(salon)} free member spaces left`
    // : SOLD_OUT;
    : "";

  const hasValidSalonData = salon && salon.publicPrice !== undefined && salon.memberSpaces !== undefined && salon.publicSpaces !== undefined && salon.startTime !== null;
  
  // if (!hasValidSalonData || remainingPublicSpacesMessage === SOLD_OUT || remainingMemberSpacesMessage || SOLD_OUT) {
  if (!hasValidSalonData) {
    return <Box sx={ticketBoxStyle()}><span>Required data is missing.</span></Box>;
  }
  
  if (startTime < new Date()) {
    return (
      <Box sx={ticketBoxStyle()}>
        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <span>Tickets are no longer available because the event is in the past.</span>
        </Box>
      </Box>
    );
  }

  const memberPurchase = async () => {
    if (canMemberCheckout(salon, user)) { // Buy MemberTicket First
      logSalonTicketBoxMemberPurchase();
      await submitData(PUBLIC_TICKET_ENDPOINT, HTTPMethod.Post, { salon, userId: user.userId!, email: user.email! }, setIsLoading, setIsError, setErrorMessage);
      // window.location.reload();
      window.location.href = `/payment/success?salonId=${salon.id}&memberPurchase=true&salonSlug=${salon.slug}`;
    }
  };

  // const isButtonDisabled = () => {
  //   return isLoading || !canMemberCheckout(salon, user) || (salon.tags.some(tag => hostOnlyTags.includes(tag.label)) && user.hostStatus !== "prof_completed");
  // };

  // const isPurchaseButtonDisabled = () => {
  //   return isLoading ||
  //     ((salon.tags.some(tag => membersOnlyTags.includes(tag.label)) || salon.locationType === "IRL" || salon.type === "SUPER_SALON") && user.isMember !== true) ||
  //     (salon.tags.some(tag => hostOnlyTags.includes(tag.label)) && user.hostStatus !== "prof_completed") ||
  //     (getRemainingPublicSpaces(salon) <= 0);
  // };

  const isPurchaseButtonDisabled = () => {
    const currentTime = new Date();
    return isLoading || 
           currentTime >= new Date(salon.endTime) ||
           getRemainingPublicSpaces(salon) <= 0;
  };
  
  const isButtonDisabled = () => {
    const currentTime = new Date();
    const hasMemberTicket = salon.memberTickets.some(
      ticket => ticket.userId === user.userId
    );
    
    return isLoading || 
           !user.isMember ||
           currentTime >= new Date(salon.endTime) ||
           getRemainingMemberSpaces(salon) <= 0 ||
           hasMemberTicket;
  };

  return (
    <Box sx={ticketBoxStyle()}>
      {attendingCurrentSalon(salon, user) && <>
        <Styled.FlexRowBox>
          <CheckCircleIcon sx={{ mr: 2 }} />
          <span>Attending</span>
        </Styled.FlexRowBox>
        {/* <Styled.DividerStyled component="hr" /> */}
      </>}

      <Styled.FlexRowBox>
        <ConfirmationNumberOutlinedIcon sx={{ mr: 1 }} />
        <Styled.PriceText>${publicPrice}</Styled.PriceText>
      </Styled.FlexRowBox>

      <Styled.FlexRowBox>
        <CheckCircleOutlineIcon sx={{ mr: 1 }} />
        <Styled.SpaceText available={getRemainingPublicSpaces(salon) > 0}>
          {remainingPublicSpacesMessage}
        </Styled.SpaceText>
      </Styled.FlexRowBox>

      <Styled.FlexRowBox>
        <Styled.SpaceText available={getRemainingMemberSpaces(salon) > 0}>
          {remainingMemberSpacesMessage}
        </Styled.SpaceText>
      </Styled.FlexRowBox>

      <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} />

      <Button
        variant="contained"
        style={{ marginBottom: "20px" }}
        disabled={isButtonDisabled()}
        onClick={memberPurchase}
      >
        One-Click Free Register
      </Button>

      <Button variant="outlined" onClick={() => {
        logSalonTicketBoxPurchaseButtonClick();
        handleModalOpen;
      }} disabled={isPurchaseButtonDisabled()}>Purchase Tickets</Button>

      <Box sx={{ mb: 2, width: "760px" }}>
        {isError && <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>}
      </Box>
    </Box>
  );
}
