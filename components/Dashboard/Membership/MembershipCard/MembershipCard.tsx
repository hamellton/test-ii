import { Box, Button, Card, CardContent, CardMedia, Typography } from "@mui/material";
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

export default function MembershipCard(
  { coverImage,
    memberType,
    annualPrice,
    monthlyPrice,
    text,
    buttonText,
    isMember,
    planName,
    user,
  }: {
    coverImage: string,
    memberType: MemberStatus,
    annualPrice: string,
    monthlyPrice?: string,
    text: JSX.Element,
    buttonText: string,
    isMember: boolean | undefined,
    planName: string | undefined,
    user: any,
  }) {

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

  const isCurrentPlan = checkCurrentPlan(planName || "", memberType);
  const buttonDisplayText = isMember && !isCurrentPlan ? "Change to this plan" : buttonText;

  return (
    <Card sx={{
      width: device !== DeviceTypes.MOBILE ? "333px" : "100%",
      borderRadius: "12px",
      border: "1px solid #C4C4C4",
      textAlign: "center",
      background: "#FFFEF4",
      overflow: "visible",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}>
      <SignUpModal open={userModalOpen} />
      {(memberType === "Explorer" && !isMember) && (
        <StyledChip>Most popular</StyledChip>
      )}
      {isCurrentPlan && (
        <StyledChip>Current plan</StyledChip>
      )}
      <CardMedia
        component="img"
        height="auto"
        width="333"
        image={coverImage}
      />
      <CardContent sx={{
        padding: "23px 31px 18px 31px",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <div>
          <Typography sx={{ fontSize: 25, fontWeight: 700, lineHeight: "30px", fontFamily: "Abhaya Libre, serif" }}>
            {memberType === "Beginner" ? "Beginner" : memberType === "Explorer" ? "Intellectual Explorer" : "Emeritus"}
          </Typography>

          {monthlyPrice && (
            <>
              <Typography sx={{ fontFamily: "Abhaya Libre, serif", color: "#231F20", lineHeight: "48px", mt: "1px", fontSize: 40, fontWeight: 700 }}> ${duration === "annual" ? annualPrice : monthlyPrice} </Typography>
              <Typography sx={{ fontFamily: "Abhaya Libre, serif", color: "#231F20", fontSize: 12, fontWeight: 700 }}>{duration === "annual" ? "per year" : "per month"}</Typography>
              {duration === "annual" && (
                <Typography sx={{ fontSize: 12, fontWeight: 700, fontFamily: "Abhaya Libre, serif"}}> save ${calculateSavings(monthlyPrice, annualPrice)} per year</Typography>
              )}
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}>
                <DurationSelector
                  type="annual"
                  handleDurationChange={handleDurationChange}
                  selected={duration === "annual"}
                />
                <DurationSelector
                  type="monthly"
                  handleDurationChange={handleDurationChange}
                  selected={duration === "monthly"}
                />
              </Box>
            </>
          )}

          {!monthlyPrice && (
            <>
              <Typography sx={{
                fontSize: 40,
                mt: "7px",
                fontWeight: 700,
                lineHeight: "48px",
                fontFamily: "Abhaya Libre, serif"
              }}>
                ${annualPrice}
              </Typography>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
              }}>
                <DurationSelector
                  type={false}
                  handleDurationChange={handleDurationChange}
                  selected={true}
                />
              </Box>
            </>
          )}

          <Typography component="div" sx={{ textAlign: "left" }}>{text}</Typography>
        </div>
        {(!isMember || (isMember && !isCurrentPlan)) && (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleClick}>
            {buttonDisplayText}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
