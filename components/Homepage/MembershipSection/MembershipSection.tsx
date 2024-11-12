import React from "react";
import { Subscription } from "@utils/contentfulTypes";
import MembershipCard from "@components/Dashboard/Membership/MembershipCard/MembershipCard";
import useSWR from "swr";
import { frontEndAuthResponse } from "@utils/types";
import { USER_STATUS_ENDPOINT } from "@config";
import { fetchGetJSON } from "@utils/api-helpers";
import MembershipHeader from "@components/Dashboard/Membership/MembershipHeader/MembershipHeader";
import { MembershipList } from "../../../styles/pages/MembershipStyles";
import styled from "styled-components";

const MembershipSectionWrapper = styled.div`
  width: 100%;
  padding: 0 130px;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const MembershipSectionContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  gap: 40px;
  margin: auto;
  margin-top: 8px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    margin-top: 32px;
    margin-bottom: 27px;
  }

  @media (min-width: 769px) {
    flex-wrap: wrap;
    margin-bottom: 120px;
  }
`;


interface IMembershipSectionProps {
    data: {
      title: string;
      membershipPageTitle: string;
      cards: Subscription[];
  };
}

const MembershipSection = (props: IMembershipSectionProps) => {
  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const isMember = user?.isMember;

  return (
    <MembershipSectionWrapper>
      <MembershipHeader title={props.data.title} />
      <MembershipSectionContent>
        {props.data.cards && props.data.cards.length > 0 && props.data.cards.map((plan) => (
          <MembershipCard
            key={plan.name}
            coverImage={plan.imgUrl}
            memberType={plan.name}
            annualPrice={plan.annualPrice ? plan.annualPrice?.toString() : ""}
            monthlyPrice={plan.monthlyPrice ? plan.monthlyPrice?.toString() : ""}
            text={
              <MembershipList>
                {plan.perks.map((perk, index) => (
                  <li key={index}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7.66667 1.45703V14.7904M12.3807 3.40965L2.95262 12.8377M14.3333 8.1237H1M12.3807 12.8377L2.95262 3.40965" stroke="#FC714E" stroke-width="1.81818" stroke-linecap="round" stroke-linejoin="round" />
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
          />
        ))}
      </MembershipSectionContent>
    </MembershipSectionWrapper>
  );
};

export default MembershipSection;
