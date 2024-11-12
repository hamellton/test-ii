import Layout from "@components/Layout/Layout";
import { Box, Typography, Link } from "@mui/material";
import { II_CONTENTFUL_API, USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import MembershipCard from "@components/Dashboard/Membership/MembershipCard/MembershipCard";
import { MembershipList, MembershipTextWrapper } from "../styles/pages/MembershipStyles";
import MembershipHeader from "@components/Dashboard/Membership/MembershipHeader/MembershipHeader";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { HomePageData } from "@utils/contentfulTypes";
import { fetcher } from "@utils/frontend-helpers";

export default function Membership() {

  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: contenfulPage } = useSWR<HomePageData>(`${II_CONTENTFUL_API}/pages?name=homePage`, fetcher);

  const { device } = useDevice() ?? {};

  const isMember = user?.isMember;

  if (!contenfulPage) {
    return null;
  }

  const {
    subscriptionsSection,
  } = contenfulPage?.value;

  return (
    <Layout>
      <MembershipHeader title={subscriptionsSection.membershipPageTitle} />
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        gap: "40px",
        flexWrap: "wrap",
        mt: device === DeviceTypes.MOBILE ? "32px" : 0,
        mb: device === DeviceTypes.MOBILE ? "27px" : isMember ? 6 : "0",
        padding: device === DeviceTypes.MOBILE ? "0 20px" : "0 130px",
      }}>
        {subscriptionsSection && subscriptionsSection.cards && subscriptionsSection.cards.length > 0 && subscriptionsSection.cards.map((plan: any, index: number) => {
          let memberType = "";
          let annualPrice = "";
          let monthlyPrice = "";

          if (index === 0) {
            memberType = "Beginner";
            annualPrice = "176.99";
            monthlyPrice = "16.99";
          } else if (index === 1) {
            memberType = "Explorer";
            annualPrice = "269.99";
            monthlyPrice = "24.99";
          } else if (index === 2) {
            memberType = "Emeritus";
            annualPrice = "2000";
            monthlyPrice = "";
          }

          return (
            <MembershipCard
              key={memberType}
              coverImage={plan.imgUrl}
              memberType={memberType}
              annualPrice={annualPrice}
              monthlyPrice={monthlyPrice}
              text={
                <MembershipList>
                  {plan.perks.map((perk: string, perkIndex: number) => (
                    <li key={perkIndex}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.66667 1.45703V14.7904M12.3807 3.40965L2.95262 12.8377M14.3333 8.1237H1M12.3807 12.8377L2.95262 3.40965" stroke="#FC714E" strokeWidth="1.81818" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {perk}
                    </li>
                  ))}
                </MembershipList>
              }
              buttonText={plan.buttonText}
              isMember={isMember}
              planName={user?.planName}
              user={user}
              isThrirdCard={index === 2}
            />
          );
        })}
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
