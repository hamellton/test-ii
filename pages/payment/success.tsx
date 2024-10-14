import Layout from "@components/Layout/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchGetJSON } from "@utils/api-helpers";
import { EventCategories, EventNames, SALON_ENDPOINT, STRIPE_ENDPOINT, USER_PUBLIC_ENDPOINT } from "@config";
import Stripe from "stripe";
import LoadingModal from "@components/Dashboard/Modals/LoadingModal";
import { 
  ButtonContainer, 
  DraftOrSuccessMessageContainer, 
  FlexBox, 
  Heading, 
  ShareButton, 
  ShareIcon 
} from "../../styles/pages/DashboardSuccessPage.styles";
import SalonCard from "@components/Common/SalonCard/SalonCard";
import { Box } from "@mui/material";
import {
  copyTextToClipboard,
  getSalonShareUrl,
  handleFacebookShareClick,
  handleLinkedInShareClick,
  handleTwitterShareClick
} from "@utils/frontend-helpers";
import LinkIcon from "@mui/icons-material/Link";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";
import { ExtendedSalon } from "@utils/types";
import { logEvent } from "@utils/analytics";

const MEMBER_PURCHASE_SUCCESS_EVENT = {
  category: EventCategories.MEMBER_PURCHASE,
  name: EventNames.MEMBER_PAYMENT_SUCCESS,
  description: "Member purchase successful",
};

const SERIES_PURCHASE_SUCCESS_EVENT = {
  category: EventCategories.SERIES_PURCHASE,
  name: EventNames.SERIES_PAYMENT_SUCCESS,
  description: "Series purchase successful",
};

const SINGLE_TICKET_PURCHASE_SUCCESS_EVENT = {
  category: EventCategories.SINGLE_TICKET_PURCHASE,
  name: EventNames.SINGLE_TICKET_PAYMENT_SUCCESS,
  description: "Single ticket purchase successful",
};

const SuccessPageContainer = styled.div<{ isSeriesPurchase: boolean }>`
  max-width: ${({ isSeriesPurchase }) => (isSeriesPurchase ? "100%" : "720px")};
  margin: 64px auto 120px;
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const EpisodeContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
  margin-top: 2em;
`;

export default function Success() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { session_id, memberPurchase, salonId, salonSlug, accountId, seriesPurchase, selectedEpisodes } = router.query;

  const [episodeSalons, setEpisodeSalons] = useState<ExtendedSalon[]>([]);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState<boolean>(true);

  const { data: salon } = useSWR(salonSlug ? `${SALON_ENDPOINT}/slug/${salonSlug}` : salonId ? `${SALON_ENDPOINT}/${salonId}` : null, fetchGetJSON);
  const { data: host } = useSWR<User>(salon && "hostId" in salon ? `${USER_PUBLIC_ENDPOINT}/${salon.hostId}` : null, fetchGetJSON);
  const { data: payment, error } = useSWR<Stripe.PaymentIntent>(accountId && session_id ? `${STRIPE_ENDPOINT}/payment/id=${session_id}&accountId=${accountId}` : null, fetchGetJSON);
  
  useEffect(() => {
    if (memberPurchase === "true" && salon) {
      logEvent(MEMBER_PURCHASE_SUCCESS_EVENT.category, MEMBER_PURCHASE_SUCCESS_EVENT.name, MEMBER_PURCHASE_SUCCESS_EVENT.description, {
        eventTitle: salon.title,
      });
    }
  }, [salon, memberPurchase]);
  
  useEffect(() => {
    if (payment && seriesPurchase === "true") {
      logEvent(SERIES_PURCHASE_SUCCESS_EVENT.category, SERIES_PURCHASE_SUCCESS_EVENT.name, SERIES_PURCHASE_SUCCESS_EVENT.description, {
        seriesTitle: payment.description,
        amount: payment.amount,
        currency: payment.currency,
      });
    }
  }, [payment, seriesPurchase]);
  
  useEffect(() => {
    if (payment && !(memberPurchase === "true") && salon) {
      logEvent(SINGLE_TICKET_PURCHASE_SUCCESS_EVENT.category, SINGLE_TICKET_PURCHASE_SUCCESS_EVENT.name, SINGLE_TICKET_PURCHASE_SUCCESS_EVENT.description, {
        eventTitle: salon.title,
        amount: payment.amount,
        currency: payment.currency,
      });
    }
  }, [payment, memberPurchase, salon]);

  useEffect(() => {
    if (seriesPurchase === "true" && selectedEpisodes) {
      const episodeList = JSON.parse(selectedEpisodes as string);
      setIsLoadingEpisodes(true);

      Promise.all(
        episodeList.map((episode: ExtendedSalon) =>
          fetchGetJSON(`${SALON_ENDPOINT}/slug/${episode.slug}`)
        )
      )
        .then((results) => {
          setEpisodeSalons(results);
          setIsLoadingEpisodes(false);
        })
        .catch((error) => {
          console.error("Error fetching episode salons:", error);
          setIsLoadingEpisodes(false);
        });
    }
  }, [seriesPurchase, selectedEpisodes]);

  // if (!payment && (memberPurchase !== "true" || seriesPurchase !== "true")) return <LoadingModal isLoading={true} />;
  if (!payment && (memberPurchase !== "true")) return <LoadingModal isLoading={true} />;

  if (error) return <div>Failed to load payment</div>;

  const urlToShare = salon && getSalonShareUrl(salon);

  return (
    <Layout>
      <SuccessPageContainer isSeriesPurchase={seriesPurchase === "true"}>
        <DraftOrSuccessMessageContainer>
          <Heading isSeriesPurchase={seriesPurchase === "true"}>
            {seriesPurchase === "true" ? "You've successfully registered!" : "You've successfully registered for your event!"}
          </Heading>
          {seriesPurchase !== "true" && <Heading>
            Let&apos;s invite your friends.
          </Heading>}
        </DraftOrSuccessMessageContainer>
        {salon && (
          <FlexBox sx={{ mt: "1em" }}>
            <Box>
              <SalonCard salon={salon} host={host} />
            </Box>
            <ButtonContainer>
              <ShareButton variant="contained" onClick={() => copyTextToClipboard(urlToShare, dispatch)}>
                <LinkIcon sx={{ mr: 1 }} />
                Copy Link
              </ShareButton>
              <ShareButton variant="outlined" onClick={() => handleFacebookShareClick(urlToShare)}>
                <ShareIcon src="/icons/facebook-icon.svg" alt="Facebook" width={20} height={20} />
                Share to Facebook
              </ShareButton>
              <ShareButton variant="outlined" onClick={() => handleTwitterShareClick(urlToShare)}>
                <ShareIcon src="/icons/x-icon.svg" alt="x" width={20} height={20} />
                Share to X
              </ShareButton>
              <ShareButton variant="outlined" onClick={() => handleLinkedInShareClick(urlToShare)}>
                <ShareIcon src="/icons/linkedin-icon.svg" alt="instagram" width={20} height={20} />
                Share to LinkedIn
              </ShareButton>
            </ButtonContainer>
          </FlexBox>
        )}
        {seriesPurchase === "true" && (
          <EpisodeContainer>
            {isLoadingEpisodes ? (
              <LoadingModal isLoading={isLoadingEpisodes} />
            ) : (
              episodeSalons.map((salonData, index) => (
                <Box key={index}>
                  <SalonCard salon={salonData} host={host} />
                </Box>
              ))
            )}
          </EpisodeContainer>
        )}
      </SuccessPageContainer>
    </Layout>
  );
}
