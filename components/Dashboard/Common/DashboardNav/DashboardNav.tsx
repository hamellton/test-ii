import React from "react";
import { NavContainer, StyledLink, NavContent, StyledTypography } from "./DashboardNav.styles";
import { ExtendedSalon } from "@utils/types";
import { useRouter } from "next/router";
import { logEvent } from "@utils/analytics";
import { EventCategories, EventNames } from "@config";

const handleEditClick = async (salon: { type: string, id: string }) => {
  if (salon.type === "SALON") {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_SALON_EDIT_CLICKED);
  } else {
    logEvent(EventCategories.NAVIGATION, EventNames.DASHBOARD_EPISODE_EDIT_CLICKED);
  }

  // window.open(`/dashboard/${salon.type === "SALON" ? "salon" : "episode"}?id=${salon.id}`);
  window.location.href = `/dashboard/${salon.type === "SALON" ? "salon" : "episode"}?id=${salon.id}`;
};

export default function DashboardNav({ salon }: { salon?: ExtendedSalon }) {
  const router = useRouter();
  const isSuccessPage = router.pathname === "/dashboard/success";

  return (
    <NavContainer isSuccessPage={isSuccessPage}>
      <StyledLink href="/dashboard/my-events">
        <NavContent>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7867_22351)">
              <path d="M12.8415 6.175L11.6665 5L6.6665 10L11.6665 15L12.8415 13.825L9.02484 10L12.8415 6.175Z" fill="#8060FE"/>
            </g>
            <defs>
              <clipPath id="clip0_7867_22351">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          <StyledTypography>
            My events
          </StyledTypography>
        </NavContent>
      </StyledLink>
      {isSuccessPage && salon && <StyledLink onClick={() => handleEditClick(salon)}>
        <NavContent>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7867_22416)">
              <path d="M11.7167 7.51667L12.4833 8.28333L4.93333 15.8333H4.16667V15.0667L11.7167 7.51667ZM14.7167 2.5C14.5083 2.5 14.2917 2.58333 14.1333 2.74167L12.6083 4.26667L15.7333 7.39167L17.2583 5.86667C17.5833 5.54167 17.5833 5.01667 17.2583 4.69167L15.3083 2.74167C15.1417 2.575 14.9333 2.5 14.7167 2.5ZM11.7167 5.15833L2.5 14.375V17.5H5.625L14.8417 8.28333L11.7167 5.15833Z" fill="#8060FE"/>
            </g>
            <defs>
              <clipPath id="clip0_7867_22416">
                <rect width="20" height="20" fill="white"/>
              </clipPath>
            </defs>
          </svg>

          <StyledTypography>
            Edit
          </StyledTypography>
        </NavContent>
      </StyledLink>}
    </NavContainer>
  );
}
