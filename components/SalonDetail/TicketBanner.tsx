import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Button, Box } from "@mui/material";
import { canMemberCheckout, copyTextToClipboard, getLocalDateFromUTC, getLocalTimeFromUTC, getRemainingMemberSpaces, getRemainingPublicSpaces, getSalonShareUrl, handleFacebookShareClick, handleLinkedInShareClick, handleTwitterShareClick } from "@utils/frontend-helpers";
import { ExtendedSalon, frontEndAuthResponse, HTTPMethod } from "@utils/types";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import LinkIcon from "@mui/icons-material/Link";
import { submitData } from "@utils/form-creation-helpers";
import { PUBLIC_TICKET_ENDPOINT } from "@config";
import { showToast } from "@/store";
import { useRouter } from "next/router";
import { logSalonTicketBoxMemberPurchase, logSalonTicketBoxPurchaseButtonClick } from "@utils/analytics-helpers";

const TicketBannerWrapper = styled.div<{ isSoldOut?: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: ${({ isSoldOut }) => (isSoldOut ? "20px 24px" : "16px 10px")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;

  button {
    padding: 18px 32px;
    white-space: nowrap;
    min-width: unset !important;

    @media (max-width: 768px) {
      padding: 10px;
    }
  }

  @media (min-width: 768px) {
    padding: 18px 32px;
    justify-content: space-between;
    gap: 60px;
  }
`;

const InfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    font-size: 16px;
    font-weight: 700;
    line-height: 24px;
    text-align: left;
  }

  span {
    font-size: 15px;
    font-weight: 400;
    line-height: 23px;
    text-align: left;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    h3 {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      text-align: left;
    }

    span {
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      text-align: left;
    }
  }
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
  font-family: "Abhaya Libre";

  @media (min-width: 768px) {
    margin-bottom: 0;
    align-items: flex-start;
  }

  h3 {
    margin: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 4px 0 0 0;
    color: gray;
  }
`;

const PriceAndSpacesWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const PriceInfo = styled.div<{ isSoldOut?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  font-family: "Abhaya Libre";
  
  div {
    color: ${({ isSoldOut }) => (isSoldOut ? "#827A7A" : "#231F20")};
  }


  @media (min-width: 768px) {
    margin-bottom: 0;
    
    div {
      font-size: 20px;
      font-weight: 700;
      line-height: 30px;
      text-align: left;
    }
  }
`;

const SpacesLeft = styled.span<{ isSoldOut: boolean }>`
  color: ${({ isSoldOut }) => (isSoldOut ? "#AB2800" : "#605054")};
  white-space: nowrap;
  font-size: 15px;
  font-weight: 400;
  line-height: 23px;

  @media (min-width: 768px) {
    font-size: 14px;
    font-weight: 400;
    line-height: 21px;
  }
`;

const BannerButton = styled(Button)`
  width: 100%;
  padding: 12px 24px;
  white-space: nowrap;

  @media (min-width: 768px) {
    width: auto;
    font-size: 1.2rem;
    padding: 12px 48px;
  }
`;

const PurchaseButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    /* flex-direction: column; */
  }
`;

const ShareButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 13px !important;
  cursor: pointer;
  border: 1px solid #231F20;
  border-radius: 8px;
  max-width: 44px;
  min-width: 44px;

  @media (min-width: 768px) {
    padding: 16px 33px;
  }
`;

const SoldOutButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px 58px;
  border-radius: 8px;
  background-color: #D3D3D3;
  color: #605054;
  white-space: nowrap;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;

  @media (max-width: 768px) {
    padding: 13px 43px;
    font-size: 15px;
    line-height: 23px;
  }
`;

const ShareButtonWrapper = styled.div`
  position: relative;
`;

const ShareOptions = styled(Box)`
  position: absolute;
  bottom: 50px;
  display: flex;
  background-color: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

// const membersOnlyTags = ["membersOnly", "discordMeetup", "readingSalon", "singlesMingles", "workshopSalon"];
// const hostOnlyTags = ["hostsOnly", "hostTraining"];

export default function TicketBanner({
  salon,
  user,
  handleModalOpen
}: {
  salon: ExtendedSalon;
  user: frontEndAuthResponse;
  handleModalOpen: () => void;
}) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showShareOptions, setShowShareOptions] = useState(false);
  const shareOptionsRef = useRef<HTMLDivElement | null>(null);

  const urlToShare = getSalonShareUrl(salon);

  const handleShareClick = () => {
    setShowShareOptions(!showShareOptions);
  };

  const dispatch = useDispatch();

  const { device } = useDevice() ?? {};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target as Node)) {
        setShowShareOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [shareOptionsRef]);

  // const isButtonDisabled = () => {
  //   return isLoading || !canMemberCheckout(salon, user) || (salon.tags.some(tag => hostOnlyTags.includes(tag.label)) && user.hostStatus !== "prof_completed");
  // };

  const memberPurchase = async () => {
    if (canMemberCheckout(salon, user)) { // Buy MemberTicket First
      logSalonTicketBoxMemberPurchase();
      await submitData(PUBLIC_TICKET_ENDPOINT, HTTPMethod.Post, { salon, userId: user.userId!, email: user.email! }, setIsLoading, setIsError, setErrorMessage);
      // window.location.reload();
      window.location.href = `/payment/success?salonId=${salon.id}&memberPurchase=true&salonSlug=${salon.slug}`;
    }
  };

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
  

  useEffect(() => {
    if(isError) dispatch(showToast({ message: JSON.stringify(errorMessage), success: false }));
  }, [dispatch, errorMessage, isError]);

  const isSoldOut = getRemainingPublicSpaces(salon) === 0;

  if (new Date(salon.startTime) < new Date()) {
    return (
      <TicketBannerWrapper isSoldOut={isSoldOut}>
        <span>Tickets are no longer available because the event is in the past</span>
      </TicketBannerWrapper>
    );
  }

  return (
    <TicketBannerWrapper isSoldOut={isSoldOut}>
      <InfoWrapper>
        {device !== DeviceTypes.MOBILE && <EventDetails>
          {salon.title && <h3>{salon.title}</h3>}
          {salon.startTime && <p style={{ textTransform: "uppercase" }}>{getLocalDateFromUTC(salon.startTime.toString(), true)} @ {getLocalTimeFromUTC(salon.startTime.toString())}</p>}
        </EventDetails>}

        <PriceAndSpacesWrapper>
          <PriceInfo isSoldOut={isSoldOut}>
            <div>${salon.publicPrice}</div>
          </PriceInfo>

          <PriceInfo>
            <SpacesLeft isSoldOut={isSoldOut}>
              {getRemainingPublicSpaces(salon) > 0
                ? `${getRemainingPublicSpaces(salon)} spaces left`
                : "SOLD OUT"}
            </SpacesLeft>
          </PriceInfo>
        </PriceAndSpacesWrapper>
      </InfoWrapper>

      {device !== DeviceTypes.MOBILE ? (
        <PurchaseButtonsContainer>
          {isSoldOut ? (
            <SoldOutButton>Sold out</SoldOutButton>
          ) : (
            <>
              <Button
                variant="contained"
                disabled={isButtonDisabled()}
                onClick={memberPurchase}
              >
                One-Click Free Register
              </Button>

              <Button variant="outlined" onClick={() => {
                logSalonTicketBoxPurchaseButtonClick();
                handleModalOpen();
              }} disabled={isPurchaseButtonDisabled()}>Purchase Tickets</Button>
            </>
          )}
        </PurchaseButtonsContainer>
      ) : (
        <ActionsContainer>
          <ShareButtonWrapper>
            {isSoldOut && <ShareButton onClick={handleShareClick}>
              <svg
                width="16"
                height="17"
                viewBox="0 0 16 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 11.8993C12.3667 11.8993 11.8 12.1494 11.3667 12.541L5.425 9.08268C5.46667 8.89102 5.5 8.69935 5.5 8.49935C5.5 8.29935 5.46667 8.10768 5.425 7.91602L11.3 4.49102C11.75 4.90768 12.3417 5.16602 13 5.16602C14.3833 5.16602 15.5 4.04935 15.5 2.66602C15.5 1.28268 14.3833 0.166016 13 0.166016C11.6167 0.166016 10.5 1.28268 10.5 2.66602C10.5 2.86602 10.5333 3.05768 10.575 3.24935L4.7 6.67435C4.25 6.25768 3.65833 5.99935 3 5.99935C1.61667 5.99935 0.5 7.11602 0.5 8.49935C0.5 9.88268 1.61667 10.9993 3 10.9993C3.65833 10.9993 4.25 10.741 4.7 10.3243L10.6333 13.791C10.5917 13.966 10.5667 14.1493 10.5667 14.3327C10.5667 15.6743 11.6583 16.766 13 16.766C14.3417 16.766 15.4333 15.6743 15.4333 14.3327C15.4333 12.991 14.3417 11.8993 13 11.8993ZM13 1.83268C13.4583 1.83268 13.8333 2.20768 13.8333 2.66602C13.8333 3.12435 13.4583 3.49935 13 3.49935C12.5417 3.49935 12.1667 3.12435 12.1667 2.66602C12.1667 2.20768 12.5417 1.83268 13 1.83268ZM3 9.33268C2.54167 9.33268 2.16667 8.95768 2.16667 8.49935C2.16667 8.04102 2.54167 7.66602 3 7.66602C3.45833 7.66602 3.83333 8.04102 3.83333 8.49935C3.83333 8.95768 3.45833 9.33268 3 9.33268ZM13 15.1827C12.5417 15.1827 12.1667 14.8077 12.1667 14.3493C12.1667 13.891 12.5417 13.516 13 13.516C13.4583 13.516 13.8333 13.891 13.8333 14.3493C13.8333 14.8077 13.4583 15.1827 13 15.1827Z"
                  fill="#FC714E"
                />
              </svg>
            </ShareButton>}

            {showShareOptions && (
              <ShareOptions ref={shareOptionsRef}>
                <Box sx={{ cursor: "pointer" }} onClick={() => copyTextToClipboard(urlToShare, dispatch)}>
                  <LinkIcon sx={{ mr: 1 }} />
                </Box>
                <Image
                  src="/icons/x-icon.svg"
                  alt="instagram"
                  width={20}
                  height={20}
                  style={{ marginRight: "0.5em", color: "purple", cursor: "pointer" }}
                  onClick={() => handleTwitterShareClick(urlToShare)}
                />
                <Image
                  src="/icons/linkedin-icon.svg"
                  alt="linkedin"
                  width={20}
                  height={20}
                  style={{ marginRight: "0.5em", cursor: "pointer" }}
                  onClick={() => handleLinkedInShareClick(urlToShare)}
                />
                <Image
                  src="/icons/facebook-icon.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                  style={{ marginRight: "0.5em", cursor: "pointer" }}
                  onClick={() => handleFacebookShareClick(urlToShare)}
                />
              </ShareOptions>
            )}
          </ShareButtonWrapper>
          
          {isSoldOut ? (
            <SoldOutButton>Sold out</SoldOutButton>
          ) : (
            <>
              <Button variant="outlined" onClick={handleModalOpen} disabled={isPurchaseButtonDisabled()}>Purchase Tickets</Button>

              <Button
                variant="contained"
                disabled={isButtonDisabled()}
                onClick={memberPurchase}
              >
                Free register
              </Button>
            </>
          )}
        </ActionsContainer>
      )}
    </TicketBannerWrapper>
  );
}
