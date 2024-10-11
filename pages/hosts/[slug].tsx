import { useRouter } from "next/router";
import Layout from "@components/Layout/Layout";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { STRIPE_ENDPOINT, USER_PUBLIC_ENDPOINT, USER_STATUS_ENDPOINT } from "@config";
import { ExtendedSalon, frontEndAuthResponse, HTTPMethod, StripeSession, UserPublic } from "@utils/types";
import SalonCard from "@components/Common/SalonCard/SalonCard";
import Link from "next/link";
import { ensureHttps } from "@utils/frontend-helpers";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { useEffect, useState } from "react";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { Box, Alert } from "@mui/material";
import { 
  Container,
  MobileContainer,
  ImageContainer,
  ImageStyle,
  ImageContainerMobile,
  ImageStyleMobile,
  NameTypography,
  DesktopContainer,
  DividerStyle,
  BioTypography,
  QuoteTypography,
  SalonsContainer,
  OuterBox,
  InnerBox,
  SectionTitle,
  UserContentWrapper,
  UserContainer,
  UserBioItem,
  UserQuoteGridItem,
  LinksContainer,
  LinkItem,
  LinksContainerMobile,
  LinkBoxMobile,
  TipSection,
} from "../../styles/pages/HostPage.styles";
import GradientButton from "@components/Common/CustomButton";
import { submitData } from "@utils/form-creation-helpers";
import { logSocialLinkClick, logTipButtonClick } from "@utils/analytics-helpers";

export default function HostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { device } = useDevice() ?? {};
  const [salons, setSalons] = useState<ExtendedSalon[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { data: user } = useSWR<UserPublic>(slug ? `${USER_PUBLIC_ENDPOINT}/slug/${slug}` : null, fetchGetJSON);
  // const { data: salons } = useSWR<ExtendedSalon[]>(user?.id ? `${SALON_ENDPOINT}/all` : null, fetchGetJSON);

  const { data: currentUser, error: userStatusError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  useEffect(() => {
    if (user && user.salons && user.salons.length > 0) setSalons((user.salons as any));
  }, [user]);

  useEffect(() => {
    if (currentUser && user && salons && salons.length > 0 ) {
      const hasApprovedSalon = salons.some(salon => salon.state === "APPROVED");
  
      if ((!currentUser.isAdmin && user.id !== currentUser.userId) && !hasApprovedSalon) {
        router.push("/hosts");
      }
    }
  }, [currentUser, user, salons, router]);
  
  
  if (!user || !salons) return <LoadingModal isLoading={!user || !salons} />;

  const links = [
    { label: "Website", condition: !!user.webLink, href: user.webLink },
    { label: "Twitter", condition: !!user.xLink, href: user.xLink },
    { label: "Instagram", condition: !!user.instaLink, href: user.instaLink },
    { label: "Substack", condition: !!user.substackLink, href: user.substackLink },
  ];
  const validLinks = links.filter(link => link.condition);

  const approvedSalons = salons?.filter(salon => salon.state === "APPROVED") || [];

  const upcomingSalons = approvedSalons.filter(salon => new Date(salon.startTime) > new Date());
  const pastSalons = approvedSalons.filter(salon => new Date(salon.startTime) < new Date());

  const handleButtonClick = async () => {
    logTipButtonClick();
    const session = await submitData(`${STRIPE_ENDPOINT}/checkout?tip=true`, HTTPMethod.Post, { hostId: user.id, url: `/hosts/${slug}`, amount: 1 }, setIsLoading, setIsError, setErrorMessage) as StripeSession;
    if (session.url) window.location.href = session.url;
  };

  return (
    <Layout>
      <Container>

        {/* Mobile View */}
        <MobileContainer>
          <ImageContainerMobile>
            <ImageStyleMobile
              src={user.profileImageUrl}
              alt={user.fullname}
              width={400} // Required for Next.js Image
              height={400} // Required for Next.js Image
              priority
            />
          </ImageContainerMobile>
          <NameTypography>
            {user.fullname}
          </NameTypography>
        </MobileContainer>

        {/* Desktop View */}
        <DesktopContainer>
          <NameTypography>
            {user.fullname}
          </NameTypography>
          <ImageContainer>
            <ImageStyle src={user.profileImageUrl} alt={user.fullname} width={400} height={400} priority />
          </ImageContainer>
        </DesktopContainer>
      </Container>
      {device === DeviceTypes.MOBILE && (
        <TipSection>
          <span>Anthropologist & Writer</span>
          <GradientButton
            variant="contained"
            onClick={handleButtonClick}
            disabled={isLoading}
          >
                  Tip
          </GradientButton>
        </TipSection>
      )}
      {device !== DeviceTypes.MOBILE && <DividerStyle />}

      <UserContentWrapper>
        <UserContainer>
          <UserBioItem>
            {device !== DeviceTypes.MOBILE && (
              <TipSection>
                <span>Anthropologist & Writer</span>
                <GradientButton
                  variant="contained"
                  onClick={handleButtonClick}
                  disabled={isLoading}
                >
                  Tip
                </GradientButton>
              </TipSection>
            )}
            {isError && <Box sx={{ mb: 2 }}>
              <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>
            </Box>}
            <BioTypography centerOnMobile={true}>
              {user.bio}
            </BioTypography>
          </UserBioItem>
          {user.quote && <UserQuoteGridItem>
            <QuoteTypography centerOnMobile={true}>
              {user.quote}
            </QuoteTypography>
          </UserQuoteGridItem>}
        </UserContainer>
      </UserContentWrapper>

      {device === DeviceTypes.MOBILE ? (
        <LinksContainerMobile>
          {validLinks.map((link, index) => (
            <LinkBoxMobile key={index}>
              <Link href={ensureHttps(link.href!)} onClick={() => logSocialLinkClick(link.label, link.href!)}>
                {link.label}
              </Link>
            </LinkBoxMobile>
          ))}
        </LinksContainerMobile>
      ) : (
        <LinksContainer>
          {validLinks.map((link, index) => (
            <LinkItem key={index}>
              <Link href={ensureHttps(link.href!)} onClick={() => logSocialLinkClick(link.label, link.href!)}>
                {link.label}
              </Link>
            </LinkItem>
          ))}
        </LinksContainer>
      )}

      <OuterBox>
        <InnerBox>
          {upcomingSalons.length > 0 && (
            <>
              <SectionTitle centerOnMobile={true} isUpcomingSalons={true}>
                Upcoming salons and series
              </SectionTitle>

              <SalonsContainer centerOnMobile={true}>
                {upcomingSalons.filter(salon => new Date(salon.startTime) > new Date()).slice(0, 8).map(salon => (
                  <SalonCard key={salon.id} salon={salon} host={(user as any)} />
                ))}
              </SalonsContainer>
            </>
          )}

          {pastSalons.length > 0 && (
            <div style={{ marginTop: "120px"}}>
              <SectionTitle centerOnMobile={true}>
              Past salons and series
              </SectionTitle>

              <SalonsContainer centerOnMobile={true}>
                {pastSalons.filter(salon => new Date(salon.startTime) < new Date()).slice(0, 10).map(salon => (
                  <SalonCard key={salon.id} salon={salon} host={(user as any)} />
                ))}
              </SalonsContainer>
            </div>
          )}
        </InnerBox>
      </OuterBox>
    </Layout>
  );
}
