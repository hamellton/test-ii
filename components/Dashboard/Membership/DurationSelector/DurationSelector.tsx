import React from "react";
import { MembershipDuration } from "@utils/types";
import { DurationSelectorBox, DurationSelectorTypography } from "./DurationSelectorStyles";
import Image from "next/image";

const getTypeDetails = (type: MembershipDuration) => {
  switch (type) {
  case "monthly":
    return { text: "Monthly", color: "#C4EAFF" };
  case "annual":
    return { text: "Annual", color: "#D0C4FF" };
  default:
    return { text: "One time", color: "#FFC4C4" };
  }
};

export default function DurationSelector({ type, handleDurationChange, selected }: { type: MembershipDuration, handleDurationChange: (type: MembershipDuration) => void, selected: boolean }) {
  const { text, color } = getTypeDetails(type);
  const marginTop = type ? "12px" : "35px";

  return (
    <DurationSelectorBox color={color} selected={selected} mt={marginTop}>
      <DurationSelectorTypography onClick={() => handleDurationChange(type)}>
        <Image src="/images/duration-circle.svg" alt="duration-circle" width={16} height={16} />
        <span>{text}</span>
      </DurationSelectorTypography>
    </DurationSelectorBox>
  );
}
