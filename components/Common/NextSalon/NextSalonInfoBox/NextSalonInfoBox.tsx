import { Divider } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { getRemainingPublicSpaces } from "@utils/frontend-helpers";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import GoogleMapsEmbed from "@components/SalonDetail/GoogleMapEmbed";
import SocialShareRow from "@components/SalonDetail/SocialShareRow";
import { DetailsItem, NextSalonInfoBoxContainer } from "./NextSalonInfoBox.styles";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";

export function formatDateTime(startTimestamp: any, endTimestamp?: any): string {
  const startDate = new Date(startTimestamp);
  const endDate = endTimestamp ? new Date(endTimestamp) : null;
  
  const dayOfWeek = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(startDate).toUpperCase();
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(startDate).toUpperCase();
  const day = startDate.getDate().toString().padStart(2, "0");
  const year = startDate.getFullYear().toString();
  
  const startTime = formatTime(startDate).replace(/ GMT[+-]\d+/, " CET");
  
  const endTime = endDate ? formatTime(endDate).replace(/ GMT[+-]\d+/, " CET") : "";
  
  return `${dayOfWeek}, ${month} ${day}, ${year}\n${startTime}${endTime ? " to " + endTime : ""}`;
}
  
function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short"
  };
  return new Intl.DateTimeFormat("en-US", options).format(date).replace(/(AM|PM)/, "").trim();
}

export default function NextSalonInfoBox({ salon, user }: { salon: ExtendedSalon, user?: frontEndAuthResponse }) {
  return salon ? (
    <NextSalonInfoBoxContainer>
      <DetailsItem isDate={true}>
        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.5 8.11491H1.5M12.3333 1.44824V4.78158M5.66667 1.44824V4.78158M5.5 18.1149H12.5C13.9001 18.1149 14.6002 18.1149 15.135 17.8424C15.6054 17.6027 15.9878 17.2203 16.2275 16.7499C16.5 16.2151 16.5 15.515 16.5 14.1149V7.11491C16.5 5.71478 16.5 5.01471 16.2275 4.47993C15.9878 4.00953 15.6054 3.62708 15.135 3.38739C14.6002 3.11491 13.9001 3.11491 12.5 3.11491H5.5C4.09987 3.11491 3.3998 3.11491 2.86502 3.38739C2.39462 3.62708 2.01217 4.00953 1.77248 4.47993C1.5 5.01471 1.5 5.71478 1.5 7.11491V14.1149C1.5 15.515 1.5 16.2151 1.77248 16.7499C2.01217 17.2203 2.39462 17.6027 2.86502 17.8424C3.3998 18.1149 4.09987 18.1149 5.5 18.1149Z" stroke="#231F20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        {salon.startTime && salon.endTime && (
          <span style={{ maxWidth: "177px"}}>
            {formatDateTime(salon.startTime, salon.endTime)}
          </span>
        )}
      </DetailsItem>
      <DetailsItem>
        <LanguageIcon />
        <span>
          {salon.locationType === "IRL" ? "In Person" : "Online"}
        </span>
      </DetailsItem>
      <DetailsItem>
        <CheckCircleOutlineIcon />
        {salon && salon?.publicTickets ? <span>{salon.publicTickets.length || 0} going / {`${getRemainingPublicSpaces(salon)} spaces left`}</span> : 0}
      </DetailsItem>
      <DetailsItem>
        <ConfirmationNumberOutlinedIcon />
        <span>${salon.publicPrice.toFixed(2)}</span>
      </DetailsItem>

      {salon.locationType === "IRL" && salon.location && user && user.isMember && <>
        <Divider sx={{ mt: 2, mb: 2 }} />
        <DetailsItem isMap={true}>
          <GoogleMapsEmbed location={salon.location} />
        </DetailsItem>
      </>}

      <Divider sx={{ mt: 2, mb: "4px" }} />

      <SocialShareRow salon={salon} />
    </NextSalonInfoBoxContainer >
  ) : null;
}