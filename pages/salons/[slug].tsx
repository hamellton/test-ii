import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { fetchGetJSON } from "@utils/api-helpers";
import useSWR from "swr";
import Layout from "@components/Layout/Layout";
import { Box, Typography } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getLocalDateFromUTC, getLocalTimeFromUTC, isErrorResponse, attendingCurrentSalon, getEventTag, dataURLtoBlob } from "@utils/frontend-helpers";
import { SALON_ENDPOINT, SALONS_ALL_ENDPOINT } from "@config";
import SalonTag from "@components/SalonDetail/SalonTag";
import SalonTicketBox from "@components/SalonDetail/SalonTicketBox/SalonTicketBox";
import SalonInfoBox from "@components/SalonDetail/SalonInfoBox";
import SalonHostBox from "@components/SalonDetail/SalonHostBox";
import TicketCart from "@components/SalonDetail/TicketCart/TicketCart";
import { USER_STATUS_ENDPOINT, USER_PUBLIC_ENDPOINT, SERIES_ENDPOINT } from "@config";
import { ErrorResponse, ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import { Series, User } from "@prisma/client";
import TicketBanner from "@components/SalonDetail/TicketBanner";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import SimilarEvents from "@components/Common/SimilarEvents/SimilarEvents";
import Image from "next/image";
import SimilarHosts from "@components/Common/SimilarHosts/SimilarHosts";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import { StyledSalon } from "../../styles/pages/Salon.styles";
import ParentSeries from "@components/SalonDetail/ParentSeries/ParentSeries";

export default function SalonPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [salon, setSalon] = useState<any>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [ticketBoxVisible, setTicketBoxVisible] = useState(true);

  const router = useRouter();
  const { slug } = router.query;
  const ticketBoxRef = useRef<HTMLDivElement>(null);
  const { data: salonData, error: salonError } = useSWR<ExtendedSalon | ErrorResponse>(slug ? `${SALON_ENDPOINT}/slug/${slug}` : null, fetchGetJSON);
  const { data: user, error: userError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: host } = useSWR<User>(salon && !isErrorResponse(salon)  && "hostId" in salon ? `${USER_PUBLIC_ENDPOINT}/${salon.hostId}` : null, fetchGetJSON);
  const { data: series } = useSWR<Series>(salon && !isErrorResponse(salon) && salon.seriesId ? `${SERIES_ENDPOINT}/${salon.seriesId}` : null, fetchGetJSON);
  const { data: episodes, error: episodesError } = useSWR<ExtendedSalon[]>(salon && !isErrorResponse(salon) && salon.seriesId ? `${SERIES_ENDPOINT}/${salon.seriesId}?episodes=true` : null, fetchGetJSON);

  const { data: allSalons, error: salonsError } = useSWR(`${SALONS_ALL_ENDPOINT}`, fetchGetJSON);

  const { device } = useDevice() ?? {};

  const handleScroll = () => {
    if (ticketBoxRef.current) {
      const rect = ticketBoxRef.current.getBoundingClientRect();
      
      // Display TicketBanner earlier when top of the SalonTicketBox starts to move out of view
      const isVisible = rect.top > 0 && rect.top < window.innerHeight * 0.8; // Adjust 0.8 to show TicketBanner earlier
      
      setTicketBoxVisible(isVisible); // Update visibility state based on scroll
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll); // Attach scroll event listener

    // Initial check in case the page is already scrolled
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll); // Clean up event listener
    };
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("salonPreviewData");
    const salonPreviewData = storedData ? JSON.parse(storedData) : null;
  
    if (slug === "preview" && salonPreviewData) {
      setSalon(salonPreviewData);
  
      if (salonPreviewData.file && salonPreviewData.file.data) {
        const fileBlob = dataURLtoBlob(salonPreviewData.file.data);
        const fileUrl = URL.createObjectURL(fileBlob);
        setImagePreviewUrl(fileUrl);
      }
    } else if (salonData) {
      setSalon(salonData);
    }

    // Clean up localStorage on page unload
    const handleBeforeUnload = () => {
      localStorage.removeItem("salonPreviewData");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [salonData, slug]);

  /* Open the cart if member is attending */
  // useEffect(() => {
  //   if (salon && !isErrorResponse(salon) && user) setModalOpen(attendingCurrentSalon(salon, user));
  // }, [salon, user]);

  useEffect(() => {
    if (salon && user && salon.state && (salon.state !== "APPROVED" && salon.state !== "PENDING_APPROVAL" && salon.state !== "PENDING_ADMIN_APPROVAL") && !user.isAdmin && user.userId !== salon.hostId) {
      router.push("/salons");
    }
  }, [salon, user, router, salonError]);

  const getNearbyEvents = () => {
    return allSalons
      ? salon.locationType === "VIRTUAL"
        ? allSalons
        : allSalons.filter((el: any) => el.id !== salon.id && el.location && el.locationType === "IRL")
      : [];  
  };

  useEffect(() => {
    if (salon && salon.state === "PENDING_APPROVAL") {
      const approvedHistory = salon.history
        .map((entry: any) => ({
          ...entry.changes.previous,
          changedAt: entry.changedAt,
        }))
        .filter((change: any) => change.state === "APPROVED")
        .sort((a: any, b: any) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

      const latestApproved = approvedHistory[0] ? {...approvedHistory[0], id: salon.id, hostId: salon.hostId, state: "PENDING_ADMIN_APPROVAL"} : salon;
      if (latestApproved) setSalon(latestApproved);
    }
  }, [salon]);

  if (!salon || !user) return <LoadingModal isLoading={!salon || !user} />;
  if (salonError || userError) return <div>Failed to load salon</div>;
  if (isErrorResponse(salon)) {
    if (salon.error === "Salon not found") return <div>Salon Not Found</div>;
    return <div>Some other error occurred</div>;
  }

  const similarEvents = getNearbyEvents();

  return (
    <Layout>
      <StyledSalon.MainContainer>
        <TicketCart salon={salon} user={user} open={modalOpen} handleClose={() => setModalOpen(false)} />
        <StyledSalon.ContentWrapper>
          <StyledSalon.DetailsBox>
            <StyledSalon.StyledTagsContainer>
              {salon.state === "DRAFT" && <StyledSalon.DraftBadge>Draft</StyledSalon.DraftBadge>}
              <SalonTag type={salon.type} />
              {salon.state === "PENDING_ADMIN_APPROVAL" && (user.isAdmin || user.userId === salon.hostId) && (
                <StyledSalon.PendingApproveBadge>
                  Event updated and awaiting approval
                </StyledSalon.PendingApproveBadge>
              )}
            </StyledSalon.StyledTagsContainer>
            {salon.title && <StyledSalon.SalonTitle>
              {salon.title}
            </StyledSalon.SalonTitle>}
            {device !== DeviceTypes.MOBILE && salon.startTime && <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", color: "text.secondary", mb: 1 }}>
              <CalendarTodayIcon sx={{ fontSize: "1em", mr: 1 }} />
              {salon.startTime && <Typography sx={{ textTransform: "uppercase" }}>{getLocalDateFromUTC(salon.startTime.toString(), true)} @ {getLocalTimeFromUTC(salon.startTime.toString())}</Typography>}
            </Box>}
            <StyledSalon.ImageWrapper superSalon={salon.type === "SUPER_SALON"}>
              <Image src={imagePreviewUrl || salon.imageUrl!} alt="salon image" width={680} height={400} />
            </StyledSalon.ImageWrapper>
            {device === DeviceTypes.MOBILE && (
              <StyledSalon.MobileInfoWrapper>
                <SalonInfoBox salon={salon} user={user} />
                {host && <SalonHostBox url={salon.slug!} host={host} />}
              </StyledSalon.MobileInfoWrapper>
            )}
            <Box sx={{
              mb: 6, display: {
                xs: "none",
              },
              margin: "auto",
            }}>
              {host && <SalonHostBox url={salon.slug!} host={host} />}
              <SalonInfoBox user={user} salon={salon} />
            </Box>
            {device !== DeviceTypes.MOBILE && (
              <>
                <StyledSalon.DescriptionTitle isDescriptionTitle={true}>Details</StyledSalon.DescriptionTitle>
                <StyledSalon.DescriptionTitle isDescriptionTitle={false}>
                  <div dangerouslySetInnerHTML={{ __html: salon.description }} />
                </StyledSalon.DescriptionTitle>
              </>
            )}
            {device === DeviceTypes.MOBILE && (
              <>
                <StyledSalon.DescriptionTitle isDescriptionTitle={true}>Details</StyledSalon.DescriptionTitle>
                <StyledSalon.DescriptionTitle isDescriptionTitle={false}>
                  <div dangerouslySetInnerHTML={{ __html: salon.description }} />
                </StyledSalon.DescriptionTitle>
              </>
            )}
            {salon.tags && salon.tags.length > 0 && <StyledSalon.TagsContainer>
              <StyledSalon.TagsTitle>
                Related Tags
              </StyledSalon.TagsTitle>
              <StyledSalon.TagsInnerContainer>
                {salon.tags && salon.tags.map((tag: any) => (
                  <StyledSalon.TagsWrapper key={tag.id}>
                    <StyledSalon.StyledTagTypography>
                      {getEventTag(tag.label)}
                    </StyledSalon.StyledTagTypography>
                  </StyledSalon.TagsWrapper>
                ))}
              </StyledSalon.TagsInnerContainer>
            </StyledSalon.TagsContainer>}
            <Box sx={{
              mb: 6, display: {
                xs: "none",
                md: "block"
              }
            }}>
            </Box>

            {/* Banner */}
            <Box sx={{
              display: {
                xs: "block",
                md: "block"
                // md: "none"
              },
            }}>
              {device !== DeviceTypes.MOBILE ? (
                <>
                  {!ticketBoxVisible && <TicketBanner salon={salon} user={user} handleModalOpen={() => setModalOpen(true)} />}
                </>
              ) : (
                <TicketBanner salon={salon} user={user} handleModalOpen={() => setModalOpen(true)} />
              )}
            </Box>
          </StyledSalon.DetailsBox>
          {device !== DeviceTypes.MOBILE && (
            <div ref={ticketBoxRef}>
              <SalonTicketBox salon={salon} user={user} handleModalOpen={() => setModalOpen(true)} />
              {host && <SalonHostBox url={`/salons/${salon.slug!}`} host={host} />}
              <SalonInfoBox salon={salon} user={user} />
            </div>
          )}
        </StyledSalon.ContentWrapper>
        <StyledSalon.StyledSimilarsContainer>
          {series && (
            <ParentSeries series={series} episodes={episodes} host={host} />
          )}
          <SimilarEvents tags={salon.tags} salons={similarEvents} location={salon.location} />
          <SimilarHosts />
        </StyledSalon.StyledSimilarsContainer>
      </StyledSalon.MainContainer>
    </Layout >
  );
};
