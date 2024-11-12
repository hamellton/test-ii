import { User, LOCATION_TYPE } from "@prisma/client";
import { ExtendedSalon } from "@utils/types";
import { HostInfo, HostInfoContainer, HostTitle } from "@components/SalonDetail/ParentSeries/ParentSeries.styles";
import Image from "next/image";
import SalonTag from "@components/SalonDetail/SalonTag";
import { getLocalDateFromUTC, getLocalTimeFromUTC, getNumAttendees } from "@utils/frontend-helpers";
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
  HostName,
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

const StyledCard = styled(Card) <{ isSimilar?: boolean, shadow?: boolean }>`
  background-color: ${(props) => (props.isSimilar ? "#F1EFE2" : "#fff")};
  width: 366px;
  border-radius: 12px;
  border: 1px solid #C4C4C4;
  box-shadow: ${(props) => (props.shadow ? "0px 4px 4px rgba(0, 0, 0, 0.25)" : "none")};
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CardWrapper = styled(Grid)`

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

  const isHomePage = router.pathname === "/";
  const isHostPage = router.pathname.includes("/hosts/") || isHomePage;

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
                    <HostTitle>Hosted by:</HostTitle>
                    <HostName>{host.fullname}</HostName>
                  </HostInfo>
                )}
              </HostInfoContainer>
              <Divider sx={{ margin: "8px 0" }} />
            </>
          )}
          <SalonInfoRow>
            <IconContainer>
              <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.168 8.33464H1.16797M12.0013 1.66797V5.0013M5.33464 1.66797V5.0013M5.16797 18.3346H12.168C13.5681 18.3346 14.2682 18.3346 14.8029 18.0622C15.2734 17.8225 15.6558 17.44 15.8955 16.9696C16.168 16.4348 16.168 15.7348 16.168 14.3346V7.33464C16.168 5.9345 16.168 5.23444 15.8955 4.69966C15.6558 4.22925 15.2734 3.8468 14.8029 3.60712C14.2682 3.33464 13.5681 3.33464 12.168 3.33464H5.16797C3.76784 3.33464 3.06777 3.33464 2.53299 3.60712C2.06259 3.8468 1.68014 4.22925 1.44045 4.69966C1.16797 5.23444 1.16797 5.9345 1.16797 7.33464V14.3346C1.16797 15.7348 1.16797 16.4348 1.44045 16.9696C1.68014 17.44 2.06259 17.8225 2.53299 18.0622C3.06777 18.3346 3.76784 18.3346 5.16797 18.3346Z" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
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
            <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.33594 10.0013H18.0026M1.33594 10.0013C1.33594 14.6037 5.0669 18.3346 9.66927 18.3346M1.33594 10.0013C1.33594 5.39893 5.0669 1.66797 9.66927 1.66797M18.0026 10.0013C18.0026 14.6037 14.2716 18.3346 9.66927 18.3346M18.0026 10.0013C18.0026 5.39893 14.2716 1.66797 9.66927 1.66797M9.66927 1.66797C11.7537 3.94993 12.9382 6.91133 13.0026 10.0013C12.9382 13.0913 11.7537 16.0527 9.66927 18.3346M9.66927 1.66797C7.58487 3.94993 6.40031 6.91133 6.33594 10.0013C6.40031 13.0913 7.58487 16.0527 9.66927 18.3346" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div>
              {salon.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
            </div>
          </SalonDetailsRow>

          <SalonDetailsRow>
            <IconWithText>
              {/* <CheckCircleOutlineIcon sx={{ mr: 1 }} /> */}
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.7513 10.0013L8.2513 12.5013L13.2513 7.5013M17.8346 10.0013C17.8346 14.6037 14.1037 18.3346 9.5013 18.3346C4.89893 18.3346 1.16797 14.6037 1.16797 10.0013C1.16797 5.39893 4.89893 1.66797 9.5013 1.66797C14.1037 1.66797 17.8346 5.39893 17.8346 10.0013Z" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span>{getNumAttendees(salon)} going</span>
            </IconWithText>
            <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.67057 4.66536V3.83203M7.67057 8.41536V7.58203M7.67057 12.1654V11.332M3.67057 1.33203H15.0039C15.9373 1.33203 16.404 1.33203 16.7606 1.51369C17.0742 1.67348 17.3291 1.92844 17.4889 2.24205C17.6706 2.59857 17.6706 3.06528 17.6706 3.9987V5.08203C16.0597 5.08203 14.7539 6.38787 14.7539 7.9987C14.7539 9.60953 16.0597 10.9154 17.6706 10.9154V11.9987C17.6706 12.9321 17.6706 13.3988 17.4889 13.7553C17.3291 14.069 17.0742 14.3239 16.7606 14.4837C16.404 14.6654 15.9373 14.6654 15.0039 14.6654H3.67057C2.73715 14.6654 2.27044 14.6654 1.91392 14.4837C1.60032 14.3239 1.34535 14.069 1.18556 13.7553C1.00391 13.3988 1.00391 12.9321 1.00391 11.9987V10.9154C2.61474 10.9154 3.92057 9.60953 3.92057 7.9987C3.92057 6.38787 2.61474 5.08203 1.00391 5.08203V3.9987C1.00391 3.06528 1.00391 2.59857 1.18556 2.24205C1.34535 1.92844 1.60032 1.67348 1.91392 1.51369C2.27044 1.33203 2.73715 1.33203 3.67057 1.33203Z" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

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
                    <HostTitle>Hosted by:</HostTitle>
                    <HostName>{host.fullname}</HostName>
                  </HostInfo>
                )}
              </HostInfoContainer>
            )}

            <Divider sx={{ flexGrow: 1, mt: 2, mb: 2 }} />

            <Box sx={{ display: "flex", gap: "8px", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 8.33366H1.5M12.3333 1.66699V5.00033M5.66667 1.66699V5.00033M5.5 18.3337H12.5C13.9001 18.3337 14.6002 18.3337 15.135 18.0612C15.6054 17.8215 15.9878 17.439 16.2275 16.9686C16.5 16.4339 16.5 15.7338 16.5 14.3337V7.33366C16.5 5.93353 16.5 5.23346 16.2275 4.69868C15.9878 4.22828 15.6054 3.84583 15.135 3.60614C14.6002 3.33366 13.9001 3.33366 12.5 3.33366H5.5C4.09987 3.33366 3.3998 3.33366 2.86502 3.60614C2.39462 3.84583 2.01217 4.22828 1.77248 4.69868C1.5 5.23346 1.5 5.93353 1.5 7.33366V14.3337C1.5 15.7338 1.5 16.4339 1.77248 16.9686C2.01217 17.439 2.39462 17.8215 2.86502 18.0612C3.3998 18.3337 4.09987 18.3337 5.5 18.3337Z" stroke="#605054" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              {salon?.startTime && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {getLocalDateFromUTC((salon.startTime).toString(), false)}
                <span style={{ margin: "0.2em" }}>•</span>
                {getLocalTimeFromUTC((salon.startTime).toString())}
              </Typography>}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.33594 10.0013H18.0026M1.33594 10.0013C1.33594 14.6037 5.0669 18.3346 9.66927 18.3346M1.33594 10.0013C1.33594 5.39893 5.0669 1.66797 9.66927 1.66797M18.0026 10.0013C18.0026 14.6037 14.2716 18.3346 9.66927 18.3346M18.0026 10.0013C18.0026 5.39893 14.2716 1.66797 9.66927 1.66797M9.66927 1.66797C11.7537 3.94993 12.9382 6.91133 13.0026 10.0013C12.9382 13.0913 11.7537 16.0527 9.66927 18.3346M9.66927 1.66797C7.58487 3.94993 6.40031 6.91133 6.33594 10.0013C6.40031 13.0913 7.58487 16.0527 9.66927 18.3346" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>


              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {salon.locationType === LOCATION_TYPE.IRL ? "In Person" : "Online"}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <span style={{ marginRight: "1em", display: "flex", alignItems: "center", gap: "10px" }}>
                {/* <CheckCircleOutlineIcon sx={{ mr: 1 }} /> */}
                <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.7513 10.0013L8.2513 12.5013L13.2513 7.5013M17.8346 10.0013C17.8346 14.6037 14.1037 18.3346 9.5013 18.3346C4.89893 18.3346 1.16797 14.6037 1.16797 10.0013C1.16797 5.39893 4.89893 1.66797 9.5013 1.66797C14.1037 1.66797 17.8346 5.39893 17.8346 10.0013Z" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

                <span>{getNumAttendees(salon)} going</span>
              </span>
              <svg width="19" height="16" viewBox="0 0 19 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.67057 4.66536V3.83203M7.67057 8.41536V7.58203M7.67057 12.1654V11.332M3.67057 1.33203H15.0039C15.9373 1.33203 16.404 1.33203 16.7606 1.51369C17.0742 1.67348 17.3291 1.92844 17.4889 2.24205C17.6706 2.59857 17.6706 3.06528 17.6706 3.9987V5.08203C16.0597 5.08203 14.7539 6.38787 14.7539 7.9987C14.7539 9.60953 16.0597 10.9154 17.6706 10.9154V11.9987C17.6706 12.9321 17.6706 13.3988 17.4889 13.7553C17.3291 14.069 17.0742 14.3239 16.7606 14.4837C16.404 14.6654 15.9373 14.6654 15.0039 14.6654H3.67057C2.73715 14.6654 2.27044 14.6654 1.91392 14.4837C1.60032 14.3239 1.34535 14.069 1.18556 13.7553C1.00391 13.3988 1.00391 12.9321 1.00391 11.9987V10.9154C2.61474 10.9154 3.92057 9.60953 3.92057 7.9987C3.92057 6.38787 2.61474 5.08203 1.00391 5.08203V3.9987C1.00391 3.06528 1.00391 2.59857 1.18556 2.24205C1.34535 1.92844 1.60032 1.67348 1.91392 1.51369C2.27044 1.33203 2.73715 1.33203 3.67057 1.33203Z" stroke="#FC714E" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round" />
              </svg>

              <span>${salon.publicPrice}</span>
            </Box>
          </CardContent>
        </StyledCard>
      </Link>
    </CardWrapper>
  );
};

export default SalonCard;
