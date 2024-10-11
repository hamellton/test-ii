import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import React from "react";
import { MembershipHeaderContainer, MembershipHeaderTitle, MembershipHeaderSubtitle } from "./MembershipHeaderStyles";

const MembershipHeader = () => {
  const { device } = useDevice() ?? {};

  if (device !== DeviceTypes.MOBILE) {
    return null;
  }

  return (
    <MembershipHeaderContainer>
      <MembershipHeaderTitle>Our packages</MembershipHeaderTitle>
      <MembershipHeaderSubtitle>Explore different ways to experience Interintellect</MembershipHeaderSubtitle>
    </MembershipHeaderContainer>
  );
};

export default MembershipHeader;
