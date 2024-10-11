import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchGetJSON } from "@utils/api-helpers";
import useSWR from "swr";
import Layout from "@components/Layout/Layout";
import { Box, Container, Typography, Divider, Button } from "@mui/material";
import Image from "next/image";
import SalonTag from "@components/SalonDetail/SalonTag";
import { SALONS_ALL_ENDPOINT, SERIES_ENDPOINT, USER_STATUS_ENDPOINT } from "@config";
import { ExtendedSalon, frontEndAuthResponse } from "@utils/types";
import { copyTextToClipboard, dataURLtoBlob, getEventTag, getRemainingPublicSpaces, getSalonShareUrl, handleFacebookShareClick, handleLinkedInShareClick, handleTwitterShareClick } from "@utils/frontend-helpers";
import NextSalon from "@components/Common/NextSalon/NextSalon";
import styled from "styled-components";
import EpisodeList from "@components/Tables/EpisodeList/EpisodeList";
import SimilarEvents from "@components/Common/SimilarEvents/SimilarEvents";
import SimilarHosts from "@components/Common/SimilarHosts/SimilarHosts";
import ShareIcon from "@mui/icons-material/Share";
import LinkIcon from "@mui/icons-material/Link";
import useDevice, { DeviceTypes } from "@/hooks/useDevice";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { useDispatch } from "react-redux";
import SeriesTicketCart from "@components/SeriesDetails/SeriesTicketCart/SeriesTicketCart";
import SeriesTicketBox from "@components/SeriesDetails/SeriesTicketBox/SeriesTicketBox";
import { logSeriesBuyClick, logSeriesShareClick, logSeriesTicketBoxClick } from "@utils/analytics-helpers";

const DraftBadge = styled.div`
  background-color: #d54c44;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 14px;
  font-weight: bold;
`;

const TagsContainer = styled(Box)`
  margin-top: 40px;

  @media (max-width: 768px) {
    margin-top: 32px;
  }
`;

const SeriesTitle = styled.div`
  font-size: 32px;
  font-family: "Abhaya Libre";
  font-weight: 700;
  line-height: 48px;
  margin: 16px 0 32px 0;

  @media (max-width: 768px) {
    font-size: 24px;
    line-height: 36px;
    margin: 12px 0 16px 0;
  }
`;

const TagsTitle = styled.div`
  font-size: 20px;
  line-height: 30px;
  margin-bottom: 16px;
  font-family: "Abhaya Libre";
  font-weight: 700;
`;

const TagsWrapper = styled(Box)`
  padding: 4px 8px;
  border: 1px solid #C4C4C4;
  border-radius: 64px;
  display: inline-flex;
  margin-right: 3px;

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

const StyledTagTypography = styled(Box)`
  font-size: 16px;
  line-height: 24px;
  font-weight: 700;
  color: #231F20;
`;

const StyledSimilarsContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 16px;
    max-width: 100%;
  }
`;

const MainContainer = styled(Container)`
  display: flex;
  padding: 0;
  margin-top: 93px;
  margin-bottom: 120px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    margin-top: 0;
    padding: 24px;
    margin-bottom: 24px;
    max-width: 100%;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 110px;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
    width: 100%;
    gap: 24px;
  }
`;

const DetailsBox = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 686px;
  gap: 2px;
  margin-bottom: 140px;

  @media (max-width: 768px) {
    margin-bottom: 0;
  }
`;

const DescriptionBox = styled(Box)`
  margin-top: 16px;
  font-size: 16px;
  font-family: "Abhaya Libre";
  font-weight: 700;
  line-height: 26px;

  @media (max-width: 768px) {
    flex-direction: column;
    max-width: 100%;
    gap: 24px;
    margin-top: 16px;

    p {
      margin: 0;
    }
  }
`;


const DescriptionTitle = styled(Box)`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  margin-top: 24px;
`;

const TagsInnerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 12px;
  }
`;

const ImageWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;

  img {
    width: 680px;
    height: 400px;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    img {
      width: 100%;
      height: auto;
      max-height: 188px;
      border-radius: 8px;
      margin-top: 16px;
    }
  }
`;

export default function SeriesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [series, setSeries] = useState<any>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [minAvailableTickets, setMinAvailableTickets] = useState<number>(0);

  const ticketBoxRef = useRef<HTMLDivElement>(null);

  const { device } = useDevice() ?? {};

  const router = useRouter();
  const dispatch = useDispatch();
  const { slug, id } = router.query;

  const seriesEndpoint = slug === "preview" && id ? `${SERIES_ENDPOINT}/slug/${id}` : `${SERIES_ENDPOINT}/slug/${slug}`;

  const { data: seriesData, error } = useSWR(seriesEndpoint, fetchGetJSON);
  const { data: user } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);

  const { data: allSalons } = useSWR(`${SALONS_ALL_ENDPOINT}`, fetchGetJSON, {
    refreshInterval: 0,
    revalidateOnFocus: false,
  });
  

  const urlToShare: string | null = series ? getSalonShareUrl(series) : null;

  const similarEvents = allSalons && allSalons.length > 0 ? allSalons : [];

  useEffect(() => {
    const storedData = localStorage.getItem("seriesPreviewData");
    const seriesPreviewData = storedData ? JSON.parse(storedData) : null;
  
    if (slug === "preview" && seriesPreviewData) {
      setSeries(seriesPreviewData);
  
      if (seriesPreviewData.file && seriesPreviewData.file.data) {
        const fileBlob = dataURLtoBlob(seriesPreviewData.file.data);
        const fileUrl = URL.createObjectURL(fileBlob);
        setImagePreviewUrl(fileUrl);
      } else {
        setImagePreviewUrl(seriesPreviewData.file);
      }
    } else if (seriesData) {
      setSeries(seriesData);
    }

    // Clean up localStorage on page unload
    const handleBeforeUnload = () => {
      localStorage.removeItem("seriesPreviewData");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [seriesData, slug]);

  useEffect(() => {
    if (series && user && series.state === "DRAFT" && !user.isAdmin && user.userId !== series.hostId) {
      router.push("/salons");
    }
  }, [router, series, user]);

  const salons = useMemo(() => {
    const filteredSalons = (slug !== "preview" || (slug === "preview" && id)) && seriesData && seriesData.salons 
      ? seriesData.salons.filter((salon: any) => {
        const endDateTime = new Date(salon.endTime);
        const currentDateTime = new Date();
  
        return salon.state === "APPROVED" && endDateTime > currentDateTime && getRemainingPublicSpaces(salon) > 0; 
      })
      : [];
  
    const availableTicketsArray = filteredSalons.map((salon: ExtendedSalon) => getRemainingPublicSpaces(salon));
    const minimumAvailableTickets = availableTicketsArray.length > 0 ? Math.min(...availableTicketsArray) : 0;
    
    setMinAvailableTickets(minimumAvailableTickets);
  
    return filteredSalons;
  }, [id, seriesData, slug]);

  if (error) return <div>Failed to load series</div>;

  if (!series) return <LoadingModal isLoading={!series} />;


  return (
    <Layout>
      <MainContainer>
        <ContentWrapper>
          <DetailsBox>
            <Box sx={{ display: "flex", alignItems: "center", gap: "15px"}}>
              {series.state === "DRAFT" && <DraftBadge>Draft</DraftBadge>}
              <SalonTag type={"SERIES_BADGE"} />
            </Box>
            <SeriesTitle>
              {series.title}
            </SeriesTitle>
            {device === DeviceTypes.MOBILE &&  urlToShare && <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
              <Box sx={{ display: "flex" }}>
                <ShareIcon sx={{ mr: 1 }} />
                <Typography sx={{ fontWeight: "bold" }}> Share</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Image src="/icons/facebook-icon-grey.svg" alt="Facebook" width={20} height={20} style={{ marginRight: "0.5em", cursor: "pointer" }}
                  onClick={() => {
                    logSeriesShareClick(series.id, "Facebook");
                    handleFacebookShareClick(urlToShare);
                  }}
                />
                <Image src="/icons/linkedin-icon-grey.svg" alt="linkedin" width={20} height={20} style={{ marginRight: "0.5em", color: "black", cursor: "pointer" }}
                  onClick={() => {
                    logSeriesShareClick(series.id, "LinkedIn");
                    handleLinkedInShareClick(urlToShare);
                  }}
                />
                <Image src="/icons/x-icon-grey.svg" alt="instagram" width={20} height={20} style={{ marginRight: "0.5em", color: "purple", cursor: "pointer" }}
                  onClick={() => {
                    logSeriesShareClick(series.id, "Twitter");
                    handleTwitterShareClick(urlToShare);
                  }}
                />
                <Box sx={{ cursor: "pointer" }} onClick={() => {
                  logSeriesShareClick(series.id, "Copy Link");
                  copyTextToClipboard(urlToShare, dispatch);
                }}>
                  <LinkIcon sx={{ mr: 1, color: "#605054" }} />
                </Box>
              </Box>
            </Box>}
            <ImageWrapper>
              <Image src={imagePreviewUrl || series.imageUrl} alt={series.title} width={680} height={400} />
            </ImageWrapper>
            <DescriptionTitle>Series details</DescriptionTitle>
            <DescriptionBox>
              <div dangerouslySetInnerHTML={{ __html: series.description }} />
            </DescriptionBox>
            {series.tags && series.tags.length > 0 && <TagsContainer>
              <TagsTitle>
                Related Tags
              </TagsTitle>
              <TagsInnerContainer>
                {series.tags && series.tags.map((tag: any) => (
                  <TagsWrapper key={tag.id}>
                    <StyledTagTypography>
                      {getEventTag(tag.label)}
                    </StyledTagTypography>
                  </TagsWrapper>
                ))}
              </TagsInnerContainer>
            </TagsContainer>}
            {salons && salons.length > 0 && (
              <>
                <EpisodeList salons={salons} setIsLoading={setIsLoading} />
                <div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "32px" }}>
                  <Button sx={{ width: "320px" }} variant="contained" onClick={() => {
                    logSeriesBuyClick(series.id);
                    setModalOpen(true);
                  }}>Buy series</Button>
                </div>
              </>
            )}
          </DetailsBox>
          {salons && salons.length > 0 && user && <div>
            {device !== DeviceTypes.MOBILE && (
              <div ref={ticketBoxRef}>
                <SeriesTicketBox handleModalOpen={() => {
                  logSeriesTicketBoxClick(series.id);
                  setModalOpen(true);
                }} />
              </div>
            )}
            <SeriesTicketCart minAvailableTickets={minAvailableTickets} series={series} salons={salons} user={user} open={modalOpen} handleClose={() => setModalOpen(false)} />
            {device !== DeviceTypes.MOBILE && salons && <NextSalon user={user} salons={salons} />}
          </div>}
        </ContentWrapper>
        <StyledSimilarsContainer>
          <SimilarEvents tags={series.tags} salons={similarEvents} location={null} isSeries={true} />
          {device === DeviceTypes.MOBILE && <Divider sx={{ flexGrow: 1, mt: 0, mb: 3 }} />}
          <SimilarHosts />
          {device === DeviceTypes.MOBILE && <Divider />}
        </StyledSimilarsContainer>
      </MainContainer>
    </Layout>
  );
}
