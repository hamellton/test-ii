import Layout from "@components/Layout/Layout";
import { Box, Typography, Link } from "@mui/material";
import { USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import MembershipCard from "@components/Dashboard/Membership/MembershipCard/MembershipCard";
import { MembershipList, MembershipNotes, MembershipTextWrapper } from "../styles/pages/MembershipStyles";
import MembershipHeader from "@components/Dashboard/Membership/MembershipHeader/MembershipHeader";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

const beginnerText = (
  <MembershipList>
    <li>Get one free ticket per month for any paid online event*</li>
    <li>Access our online community forum</li>
    <li>Attend all standard offline events around the world – or get help hosting</li>
    <li>Get major discounts on special offline events (festivals, talks)</li>
    <li>Access all online members only events and specials (weekly writing sessions, Christmas Party, Single Mingle, special celebrity visits)</li>
    <li>Come hang out with Interintellect hosts in our forum, attend host trainings</li>
    <li>Access recordings of members only videos and trainings</li>
    <MembershipNotes>
      <li>All event access dependent on ticket availability</li>
    </MembershipNotes>
  </MembershipList>
);

const explorerText = (
  <MembershipList>
    <li>Get one free ticket per month for any paid online event*</li>
    <li>Access our online community forum</li>
    <li>Attend all standard offline events around the world – or get help hosting</li>
    <li>Get major discounts on special offline events (festivals, talks)</li>
    <li>Access all online members only events and specials (weekly writing sessions, Christmas Party, Single Mingle, special celebrity visits)</li>
    <li>Come hang out with Interintellect hosts in our forum, attend host trainings</li>
    <li>Access recordings of members only videos and trainings</li>
    <MembershipNotes>
      <li>All event access dependent on ticket availability</li>
    </MembershipNotes>
  </MembershipList>
);

const supporterText = (
  <MembershipList>
    <li>Quarterly specials with Interintellect founder and CEO Anna Gát</li>
    <li>FREE attendance of EVERY paid online event*</li>
    <li>Early Bird notification for offline specials and high-demand online events</li>
    <li>Access our online community forum</li>
    <li>Attend all standard offline events around the world – or get help hosting</li>
    <li>Get major discounts on special offline events (festivals, talks)</li>
    <li>Access all online members only events and specials (weekly writing sessions, Christmas Party, Single Mingle, special celebrity visits)</li>
    <li>Come hang out with Interintellect hosts in our forum, attend host trainings</li>
    <li>Access recordings of members only videos and trainings</li>
    <MembershipNotes>
      <li>All event access dependent on ticket availability</li>
      <li>Valid for 10 years</li>
    </MembershipNotes>
  </MembershipList>
);

export default function Membership() {

  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const { device } = useDevice() ?? {};

  const isMember = user?.isMember;

  return (
    <Layout>
      <MembershipHeader />
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        gap: 8,
        flexWrap: "wrap",
        margin: "auto",
        mt: device === DeviceTypes.MOBILE ? "32px" : 8,
        mb: device === DeviceTypes.MOBILE ? "27px" : isMember ? 6 : "102px",
        padding: "0 11px",
      }}>
        <MembershipCard
          coverImage="/images/beginner-image.svg"
          memberType="Beginner"
          annualPrice="176.99"
          monthlyPrice="16.99"
          text={beginnerText}
          buttonText="Join our community"
          isMember={isMember}
          planName={user?.planName}
          user={user}
        />
        <MembershipCard
          coverImage="/images/explorer-image.svg"
          memberType="Explorer"
          annualPrice="269.99"
          monthlyPrice="24.99"
          text={explorerText}
          buttonText="Explore with us"
          isMember={isMember}
          planName={user?.planName}
          user={user}
        />
        <MembershipCard
          coverImage="/images/supporter-image.svg"
          memberType="Emeritus"
          annualPrice="2000"
          text={supporterText}
          buttonText="Support us"
          isMember={isMember}
          planName={user?.planName}
          user={user}
        />
      </Box>
      {user?.isMember && (
        <MembershipTextWrapper>
          <Typography component="div">
           Your current plan is <strong>{user.planName}</strong>
          </Typography>
          <Typography component="div" style={{ margin: device === DeviceTypes.MOBILE ? "16px 11px 27px" : "16px 0 27px" }}>
           Please click {" "}
            <Link href={`${process.env.NEXT_PUBLIC_MEMBERFUL_URL}/account/subscriptions/`}>here</Link>
            {" "} to change your plan or cancel your subscription
          </Typography>
        </MembershipTextWrapper>
      )}
    </Layout>
  );
}
