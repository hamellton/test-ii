import { User, LOCATION_TYPE } from "@prisma/client";
import { ExtendedSalon } from "@utils/types";
import { HostInfo, HostInfoContainer, HostName, HostTitle } from "@components/SalonDetail/ParentSeries/ParentSeries.styles";
import Image from "next/image";
import SalonTag from "@components/SalonDetail/SalonTag";
import { getLocalDateFromUTC, getLocalTimeFromUTC, getNumAttendees } from "@utils/frontend-helpers";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LanguageIcon from "@mui/icons-material/Language";
import ConfirmationNumberOutlinedIcon from "@mui/icons-material/ConfirmationNumberOutlined";
import { 
  EventCardContainer, 
  EventCardImage, 
  EventCardInfo, 
  EventCardTitle,
  SalonInfoRow,
  SalonDetailsRow,
  IconWithText,
  SalonPrice,
  IconContainer,
  DateText,
} from "./SalonCard.styles";
import { useRouter } from "next/router";
import { Box, Card, CardContent, CardMedia, Divider, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { styled } from "styled-components";
import { logSalonClick } from "@utils/analytics-helpers";

const DraftBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: #d54c44;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
`;

const StyledCard = styled(Card)<{ isSimilar?: boolean, shadow?: boolean }>`
  background-color: ${(props) => (props.isSimilar ? "#F1EFE2" : "#fff")};
  width: ${(props) => (props.isSimilar ? "372px" : "333px")};
  border-radius: 12px;
  border: 1px solid #C4C4C4;
  box-shadow: ${(props) => (props.shadow ? "0px 4px 4px rgba(0, 0, 0, 0.25)" : "none")};
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardWrapper = styled(Grid)`

  /* @media (min-width: 600px) {
    flex-basis: 50%;
  } */

  /* @media (min-width: 960px) {
    flex-basis: 25%;
  } */

  @media (max-width: 599px) {
    flex-basis: 100%;
    max-width: 100%;
    width: 100%;
  }
`;

const SalonCard = ({ 
  salon,
  variant,
  shadow,
  host,
  isSimilar = false
} 
    : { 
      salon: ExtendedSalon, 
      variant?: "white", 
      shadow?: boolean, 
      isSimilar?: boolean,
      host?: User,
    }) => {
  const router = useRouter();
  const isHostPage = router.pathname.includes("/hosts/");

  const isSpecialPage = router.pathname === "/payment/success" || isHostPage;

  return isSpecialPage ? (
    <Link href={`/salons/${salon.slug}`} onClick={() => logSalonClick(salon.id)}>
      <EventCardContainer isHostPage={isHostPage}>
        <EventCardImage isSuperSalon={salon.type === "SUPER_SALON"}>
          <Image src={salon.imageUrl ? salon.imageUrl : "/images/thumbnail.jpg"} layout="fill" objectFit="cover" alt="salon image" />
          {salon.type && <SalonTag type={salon.type} />}
        </EventCardImage>
        <EventCardInfo>
          <EventCardTitle>{salon.title}</EventCardTitle>
          {host && (
            <>
              <HostInfoContainer>
                {host?.profileImageUrl && <Image src={host?.profileImageUrl} width={40} height={40} alt="host image" style={{ borderRadius: "28px" }} />}
                {host.fullname && (
                  <HostInfo>
                    <HostTitle>Host:</HostTitle>
                    <HostName>{host.fullname}</HostName>
                  </HostInfo>
                )}
              </HostInfoContainer>
              <Divider sx={{ margin: "8px 0" }} />
            </>
          )}
          <SalonInfoRow>
            <IconContainer>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.33366H1.5M12.3333 1.66699V5.00033M5.66667 1.66699V5.00033M5.5 18.3337H12.5C13.9001 18.3337 14.6002 18.3337 15.135 18.0612C15.6054 17.8215 15.9878 17.439 16.2275 16.9686C16.5 16.4339 16.5 15.7338 16.5 14.3337V7.33366C16.5 5.93353 16.5 5.23346 16.2275 4.69868C15.9878 4.22828 15.6054 3.84583 15.135 3.60614C14.6002 3.33366 13.9001 3.33366 12.5 3.33366H5.5C4.09987 3.33366 3.3998 3.33366 2.86502 3.60614C2.39462 3.84583 2.01217 4.22828 1.77248 4.69868C1.5 5.23346 1.5 5.93353 1.5 7.33366V14.3337C1.5 15.7338 1.5 16.4339 1.77248 16.9686C2.01217 17.439 2.39462 17.8215 2.86502 18.0612C3.3998 18.3337 4.09987 18.3337 5.5 18.3337Z" stroke="#605054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {salon?.startTime && (
                <DateText>
                  {getLocalDateFromUTC(salon.startTime.toString(), false)}
                  <span style={{ margin: "0.2em" }}>•</span>
                  {getLocalTimeFromUTC(salon.startTime.toString())}
                </DateText>
              )}
            </IconContainer>
          </SalonInfoRow>

          <SalonDetailsRow>
            <LanguageIcon />
            <div>
              {salon.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
            </div>
          </SalonDetailsRow>

          <SalonDetailsRow>
            <IconWithText>
              <CheckCircleOutlineIcon sx={{ mr: 1 }} />
              <span>{getNumAttendees(salon)} going</span>
            </IconWithText>
            <ConfirmationNumberOutlinedIcon />
            <SalonPrice>${salon.publicPrice}</SalonPrice>
          </SalonDetailsRow>
        </EventCardInfo>
      </EventCardContainer>
    </Link>
  ) : (
    <CardWrapper>
      <Link href={`/salons/${salon.slug}`}>
        <StyledCard isSimilar={isSimilar} shadow={shadow}>
          {salon.state === "DRAFT" && <DraftBadge>Draft</DraftBadge>}
          <CardMedia
            component="img"
            height="200"
            width="333"
            image={salon.imageUrl ? salon.imageUrl : "/images/thumbnail.jpg"}
          />
          <CardContent>
            <Typography gutterBottom variant="h4" component="div" sx={{
              fontWeight: 700,
              fontSize: 20,
              textAlign: "left",
            }}>
              {salon.title}
            </Typography>
            {host && (
              <HostInfoContainer>
                {host?.profileImageUrl && <Image src={host?.profileImageUrl} width={40} height={40} alt="host image" style={{ borderRadius: "28px" }} />}
                {host.fullname && (
                  <HostInfo>
                    <HostTitle>Host:</HostTitle>
                    <HostName>{host.fullname}</HostName>
                  </HostInfo>
                )}
              </HostInfoContainer>
            )}

            <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} />

            <Box sx={{ display: "flex", gap: "8px", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.33366H1.5M12.3333 1.66699V5.00033M5.66667 1.66699V5.00033M5.5 18.3337H12.5C13.9001 18.3337 14.6002 18.3337 15.135 18.0612C15.6054 17.8215 15.9878 17.439 16.2275 16.9686C16.5 16.4339 16.5 15.7338 16.5 14.3337V7.33366C16.5 5.93353 16.5 5.23346 16.2275 4.69868C15.9878 4.22828 15.6054 3.84583 15.135 3.60614C14.6002 3.33366 13.9001 3.33366 12.5 3.33366H5.5C4.09987 3.33366 3.3998 3.33366 2.86502 3.60614C2.39462 3.84583 2.01217 4.22828 1.77248 4.69868C1.5 5.23346 1.5 5.93353 1.5 7.33366V14.3337C1.5 15.7338 1.5 16.4339 1.77248 16.9686C2.01217 17.439 2.39462 17.8215 2.86502 18.0612C3.3998 18.3337 4.09987 18.3337 5.5 18.3337Z" stroke="#605054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              {salon?.startTime && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {getLocalDateFromUTC((salon.startTime).toString(), false)}
                <span style={{ margin: "0.2em" }}>•</span>
                {getLocalTimeFromUTC((salon.startTime).toString())}
              </Typography>}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <LanguageIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {salon.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <span style={{ marginRight: "1em" }}>
                <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                <span>{getNumAttendees(salon)} going</span>
              </span>
              <ConfirmationNumberOutlinedIcon sx={{ mr: 1 }} />
              <span>${salon.publicPrice}</span>
            </Box>
            {/* <SalonInfoRow>
              <IconContainer>
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.5 8.33366H1.5M12.3333 1.66699V5.00033M5.66667 1.66699V5.00033M5.5 18.3337H12.5C13.9001 18.3337 14.6002 18.3337 15.135 18.0612C15.6054 17.8215 15.9878 17.439 16.2275 16.9686C16.5 16.4339 16.5 15.7338 16.5 14.3337V7.33366C16.5 5.93353 16.5 5.23346 16.2275 4.69868C15.9878 4.22828 15.6054 3.84583 15.135 3.60614C14.6002 3.33366 13.9001 3.33366 12.5 3.33366H5.5C4.09987 3.33366 3.3998 3.33366 2.86502 3.60614C2.39462 3.84583 2.01217 4.22828 1.77248 4.69868C1.5 5.23346 1.5 5.93353 1.5 7.33366V14.3337C1.5 15.7338 1.5 16.4339 1.77248 16.9686C2.01217 17.439 2.39462 17.8215 2.86502 18.0612C3.3998 18.3337 4.09987 18.3337 5.5 18.3337Z" stroke="#605054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {salon?.startTime && (
                  <DateText>
                    {getLocalDateFromUTC(salon.startTime.toString(), false)}
                    <span style={{ margin: "0.2em" }}>•</span>
                    {getLocalTimeFromUTC(salon.startTime.toString())}
                  </DateText>
                )}
              </IconContainer>
            </SalonInfoRow>

            <SalonDetailsRow>
              <LanguageIcon sx={{ mr: 1 }} />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {salon.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
              </Typography>
            </SalonDetailsRow>

            <SalonDetailsRow>
              <IconWithText>
                <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                <span>{getNumAttendees(salon)} going</span>
              </IconWithText>
              <ConfirmationNumberOutlinedIcon sx={{ mr: 1 }} />
              <SalonPrice>${salon.publicPrice}</SalonPrice>
            </SalonDetailsRow> */}
          </CardContent>
        </StyledCard>
      </Link>
    </CardWrapper>
  );
};

export default SalonCard;
