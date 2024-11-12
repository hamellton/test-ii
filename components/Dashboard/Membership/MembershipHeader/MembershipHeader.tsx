import React from "react";
import { 
  MembershipHeaderContainer, 
  MembershipHeaderTitle, 
  TopLeftImage,
  BottomRightImage
} from "./MembershipHeaderStyles";
import { useRouter } from "next/router";

const MembershipHeader = ({ title }: { title: string }) => {
  const router = useRouter();

  const isMembershipPage = router.pathname === "/membership";

  return (
    <MembershipHeaderContainer>
      <TopLeftImage isMembershipPage={isMembershipPage} src="/images/membership-header-1.png" alt="Top Left Decoration" />
      <MembershipHeaderTitle isMembershipPage={isMembershipPage}>{title}</MembershipHeaderTitle>
      <BottomRightImage isMembershipPage={isMembershipPage} src="/images/membership-header-2.png" alt="Bottom Right Decoration" />
    </MembershipHeaderContainer>
  );
};

export default MembershipHeader;
