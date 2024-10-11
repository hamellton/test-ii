import { Box, Typography, Divider } from "@mui/material";
import { getLocalDateFromUTC, getLocalTimeFromUTC } from "@utils/frontend-helpers";
import SocialShareRow from "./SocialShareRow";
import { getNumAttendees } from "@utils/frontend-helpers";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import GoogleMapsEmbed from "@components/SalonDetail/GoogleMapEmbed";
import Image from "next/image";
import { getHostUrl } from "@utils/frontend-helpers";
import styled from "styled-components";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";

const SalonInfoContainer = styled(Box)`
  background: #FFFEF4;
  border-radius: 12px;
  border: 1px solid #CAC6AF;
  width: 333px;
  padding: 16px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    background: transparent;
    border: none;
    width: 100%;
  }
`;

const CoHostContainer = styled.a`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
`;

const CoHostImage = styled(Image)`
  border-radius: 50%;
`;

const CoHostDetails = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const InfoRow = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const InfoIcon = styled.div`
  margin-right: 8px;
`;

export default function SalonInfoBox({ salon, user }: { salon: ExtendedSalon, user?: frontEndAuthResponse }) {
  const { device } = useDevice() ?? {};

  return (
    <SalonInfoContainer>
      {salon.coHosts && salon.coHosts.length > 0 && salon.coHosts.map((coHost, index) => (
        <CoHostContainer
          key={index}
          href={getHostUrl(coHost)}
          target="_blank"
          rel="noopener noreferrer"
        >
          {coHost.profileImageUrl && coHost.fullname && (
            <>
              <CoHostImage src={coHost.profileImageUrl!} width={88} height={88} alt="host image" />
              <CoHostDetails>
                <Typography sx={{ fontWeight: "bold", fontSize: "18px", marginLeft: "16px" }}>
                  {coHost.fullname}
                </Typography>
              </CoHostDetails>
            </>
          )}
        </CoHostContainer>
      ))}

      <InfoRow>
        <InfoIcon>
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.5 8.33464H1.5M12.3333 1.66797V5.0013M5.66667 1.66797V5.0013M5.5 18.3346H12.5C13.9001 18.3346 14.6002 18.3346 15.135 18.0622C15.6054 17.8225 15.9878 17.44 16.2275 16.9696C16.5 16.4348 16.5 15.7348 16.5 14.3346V7.33464C16.5 5.9345 16.5 5.23444 16.2275 4.69966C15.9878 4.22925 15.6054 3.8468 15.135 3.60712C14.6002 3.33464 13.9001 3.33464 12.5 3.33464H5.5C4.09987 3.33464 3.3998 3.33464 2.86502 3.60712C2.39462 3.8468 2.01217 4.22925 1.77248 4.69966C1.5 5.23444 1.5 5.9345 1.5 7.33464V14.3346C1.5 15.7348 1.5 16.4348 1.77248 16.9696C2.01217 17.44 2.39462 17.8225 2.86502 18.0622C3.3998 18.3346 4.09987 18.3346 5.5 18.3346Z" stroke="#231F20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </InfoIcon>
        {salon.startTime && <Typography sx={{ textTransform: "uppercase" }}>
          {getLocalDateFromUTC((salon.startTime).toString(), false)}
          <span style={{ margin: "0.2em" }}>•</span>
          {getLocalTimeFromUTC((salon.startTime).toString())}
        </Typography>}
      </InfoRow>

      <InfoRow>
        <InfoIcon>
          {/* <CheckCircleOutlineIcon /> */}
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.2513 10.0013L8.7513 12.5013L13.7513 7.5013M18.3346 10.0013C18.3346 14.6037 14.6037 18.3346 10.0013 18.3346C5.39893 18.3346 1.66797 14.6037 1.66797 10.0013C1.66797 5.39893 5.39893 1.66797 10.0013 1.66797C14.6037 1.66797 18.3346 5.39893 18.3346 10.0013Z" stroke="#231F20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>

        </InfoIcon>
        <span>{getNumAttendees(salon)} going</span>
      </InfoRow>

      {device !== DeviceTypes.MOBILE ? (
        <InfoRow>
          <InfoIcon>
            {/* <LanguageIcon /> */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.66797 10.0013H18.3346M1.66797 10.0013C1.66797 14.6037 5.39893 18.3346 10.0013 18.3346M1.66797 10.0013C1.66797 5.39893 5.39893 1.66797 10.0013 1.66797M18.3346 10.0013C18.3346 14.6037 14.6037 18.3346 10.0013 18.3346M18.3346 10.0013C18.3346 5.39893 14.6037 1.66797 10.0013 1.66797M10.0013 1.66797C12.0857 3.94993 13.2703 6.91133 13.3346 10.0013C13.2703 13.0913 12.0857 16.0527 10.0013 18.3346M10.0013 1.66797C7.9169 3.94993 6.73234 6.91133 6.66797 10.0013C6.73234 13.0913 7.9169 16.0527 10.0013 18.3346" stroke="#231F20" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

          </InfoIcon>
          <Typography>
            {salon.locationType === "IRL" ? "In Person" : "Online"}
          </Typography>
        </InfoRow>
      ) : (
        <InfoRow>
          <InfoIcon>
            <svg width="20" height="20" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.9987 9.0013C6.08203 9.0013 5.33203 8.2513 5.33203 7.33464C5.33203 6.41797 6.08203 5.66797 6.9987 5.66797C7.91536 5.66797 8.66536 6.41797 8.66536 7.33464C8.66536 8.2513 7.91536 9.0013 6.9987 9.0013ZM11.9987 7.5013C11.9987 4.4763 9.79036 2.33464 6.9987 2.33464C4.20703 2.33464 1.9987 4.4763 1.9987 7.5013C1.9987 9.4513 3.6237 12.0346 6.9987 15.118C10.3737 12.0346 11.9987 9.4513 11.9987 7.5013ZM6.9987 0.667969C10.4987 0.667969 13.6654 3.3513 13.6654 7.5013C13.6654 10.268 11.4404 13.543 6.9987 17.3346C2.55703 13.543 0.332031 10.268 0.332031 7.5013C0.332031 3.3513 3.4987 0.667969 6.9987 0.667969Z" fill="#231F20"/>
            </svg>


          </InfoIcon>
          <Typography>
            {salon.locationType === "IRL" ? salon.location : "Online"}
          </Typography>
        </InfoRow>
      )}

      {salon.locationType === "IRL" && salon.location && user && user.isMember && (
        <>
          {device !== DeviceTypes.MOBILE && <Divider sx={{ marginTop: "8px", marginBottom: "16px" }} />}
          <InfoRow>
            {device !== DeviceTypes.MOBILE && (
              <GoogleMapsEmbed location={salon.location} />
            )}
          </InfoRow>
        </>
      )}

      <Divider sx={{ marginTop: "8px" }} />

      <SocialShareRow showSocials={Boolean(device !== DeviceTypes.MOBILE)} salon={salon} />
    </SalonInfoContainer>
  );
}