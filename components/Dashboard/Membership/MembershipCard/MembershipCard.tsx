import { Button, CardMedia, Typography } from "@mui/material";
import { useState } from "react";
import { MemberStatus, MembershipDuration } from "@utils/types";
import { useRouter } from "next/router";
import DurationSelector from "../DurationSelector/DurationSelector";
import { StyledChip } from "./MembershipCard.styles";
import { calculateSavings, checkCurrentPlan } from "./MembershipCardHelper";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import SignUpModal from "@components/Dashboard/Modals/SignUpModal";
import { logEvent } from "@utils/analytics";
import { EventCategories, EventNames } from "@config";
import styled from "styled-components";

const MoonBlock = styled.div`
  position: absolute;
  top: -152px;
  right: -97px;
  z-index: 1;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MoonImg = styled.img`

`;

const StyledCard = styled.div<{ isMobile: boolean }>`
  width: ${(props) => (props.isMobile ? "100%" : "366px")};
  border-radius: 12px;
  text-align: center;
  background: #FFF6E3;
  overflow: visible;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const StyledCardContent = styled.div`
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const StyledPrice = styled(Typography)`
  color: #FC714E;
  font-size: 32px;
  font-weight: 600;
  line-height: 40px;
  text-align: left;
`;

const StyledSavings = styled(Typography)`
  font-size: 12px;
  font-weight: 500;
  line-height: 14px;
  letter-spacing: 0.01em;
  text-align: center;
  color: #231F20;
`;

const StyledDurationSelector = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const SubscriptionName = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 24px;
  text-align: center;
  color: #231F20;
`;

const PriceDurationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 13px;
  margin-top: 20px;
  margin-bottom: 8px;
`;

const Divider = styled.div`
  border: 1.5px solid #F7E6C3;
  width: 100%;
  height: 0px;
  opacity: 0px;
  margin: 20px 0;
`;

const PriceDurationContainerAnnual = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 13px;
  margin-top: 20px;
  margin-bottom: 42px;
`;

const RoundedImage = styled(CardMedia)`
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  z-index: 2;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardButton = styled(Button)`
  padding: 12px 51px;
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  color: #231F20;
  text-align: left;
  cursor: pointer;
  margin-top: auto;
`;

export default function MembershipCard(
  {
    coverImage,
    memberType,
    annualPrice,
    monthlyPrice,
    text,
    buttonText,
    isMember,
    planName,
    user,
    isThrirdCard,
  }: {
    coverImage: string;
    memberType: MemberStatus;
    annualPrice: string;
    monthlyPrice?: string;
    text: JSX.Element;
    buttonText: string;
    isMember: boolean | undefined;
    planName: string | undefined;
    user: any;
    isThrirdCard?: boolean;
  }
) {
  const [duration, setDuration] = useState<MembershipDuration>("annual");
  const [userModalOpen, setUserModalOpen] = useState(false);
  const router = useRouter();
  const { device } = useDevice() ?? {};

  const handleDurationChange = (type: MembershipDuration) => {
    setDuration(type);
    logEvent(
      EventCategories.USER_ACTION,
      EventNames.DURATION_CHANGED,
      undefined,
      {
        membershipType: memberType,
        duration: type,
      }
    );
  };

  const handleClick = () => {
    if (user) {
      if (user.isLoggedIn === false) {
        setUserModalOpen(true);
        logEvent(
          EventCategories.USER_ACTION,
          EventNames.LOGIN_MODAL_OPENED,
        );
      } else {
        let url;
        if (memberType === "Beginner") {
          url = (duration === "annual") ? process.env.NEXT_PUBLIC_BEGINNER_ANNUAL_LINK : process.env.NEXT_PUBLIC_BEGINNER_MONTHLY_LINK;
        } else if (memberType === "Explorer") {
          url = (duration === "annual") ? process.env.NEXT_PUBLIC_EXPLORER_ANNUAL_LINK : process.env.NEXT_PUBLIC_EXPLORER_MONTHLY_LINK;
        } else {
          url = process.env.NEXT_PUBLIC_SUPPORTER_PLAN_LINK;
        }

        logEvent(
          EventCategories.USER_ACTION,
          EventNames.MEMBERSHIP_CARD_BUTTON_CLICKED,
          undefined,
          {
            membershipType: memberType,
            duration: duration,
          }
        );

        router.push(url!);
      }
    }
  };

  const isMembershipPage = router.pathname === "/membership";
  const isCurrentPlan = checkCurrentPlan(planName || "", memberType);
  const buttonDisplayText = isMember && !isCurrentPlan ? "Change to this plan" : buttonText;

  return (
    <StyledCard isMobile={device === DeviceTypes.MOBILE}>
      <SignUpModal open={userModalOpen} />
      {(memberType === "Explorer" && !isMember) && <StyledChip>Most popular</StyledChip>}
      {isCurrentPlan && <StyledChip>Current plan</StyledChip>}

      <RoundedImage
        as="img"
        height="auto"
        width="366"
        src={coverImage}
      />

      <StyledCardContent>
        <div>
          <SubscriptionName>
            {isMembershipPage ?
              (memberType === "Beginner" ? "Beginner" : memberType === "Explorer" ? "Intellectual Explorer" : "Emeritus")
              : memberType}
          </SubscriptionName>

          {monthlyPrice && (
            <>
              <PriceDurationContainer>
                <StyledPrice> ${duration === "annual" ? annualPrice : monthlyPrice} </StyledPrice>
                <StyledDurationSelector>
                  <DurationSelector type="annual" handleDurationChange={handleDurationChange} selected={duration === "annual"} />
                  <DurationSelector type="monthly" handleDurationChange={handleDurationChange} selected={duration === "monthly"} />
                </StyledDurationSelector>
              </PriceDurationContainer>
              {/* <StyledSavings>{duration === "annual" ? "per year" : "per month"}</StyledSavings> */}
              {duration === "annual" && <StyledSavings> save ${calculateSavings(monthlyPrice, annualPrice)} per year</StyledSavings>}
            </>
          )}

          {!monthlyPrice && (
            <PriceDurationContainerAnnual>
              <StyledPrice>
                ${annualPrice}
              </StyledPrice>
              <StyledDurationSelector>
                <DurationSelector type={false} handleDurationChange={handleDurationChange} selected={true} />
              </StyledDurationSelector>
            </PriceDurationContainerAnnual>
          )}

          <Divider />

          <Typography component="div" sx={{ textAlign: "left" }}>{text}</Typography>
        </div>

        {(!isMember || (isMember && !isCurrentPlan)) && (
          <CardButton variant="contained" color="primary" onClick={handleClick}>
            {buttonDisplayText}
          </CardButton>
        )}
      </StyledCardContent>
      {isThrirdCard && (<MoonBlock>
        <MoonImg src="/images/moon.png" alt="moon" />
      </MoonBlock>)}
    </StyledCard>
  );
}
