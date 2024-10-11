import { Box, Typography } from "@mui/material";
import DashboardLayout from "@components/Dashboard/Common/DashboardLayout/DashboardLayout";
import SalonCard from "@components/Common/SalonCard/SalonCard";
import LinkIcon from "@mui/icons-material/Link";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { fetchGetJSON } from "@utils/api-helpers";
import { copyTextToClipboard, handleFacebookShareClick, handleLinkedInShareClick, handleTwitterShareClick, getSalonShareUrl } from "@utils/frontend-helpers";
import DashboardNav from "@components/Dashboard/Common/DashboardNav/DashboardNav";
import { SALON_ENDPOINT, USER_ENDPOINT, USER_STATUS_ENDPOINT } from "@config";
import { frontEndAuthResponse } from "@utils/types";
import { showToast } from "@/store";
import { useDispatch } from "react-redux";
import { 
  ButtonContainer, 
  Container, 
  DraftOrSuccessMessageContainer, 
  FlexBox, 
  Heading, 
  ShareButton, 
  ShareIcon 
} from "../../styles/pages/DashboardSuccessPage.styles";

type SalonOrEpisode = "Salon" | "Episode";

function getEventType(salon: { type: string }): SalonOrEpisode {
  return salon.type === "SALON" ? "Salon" : "Episode";
}

const submitSalon = async (userId: string, id: string, dispatch: Function) => {
  try {
    const response = await fetch(`/api/salon/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ state: "SUBMITTED", userId: userId || null }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    dispatch(showToast({ message: "Salon successfully submitted!", success: true }));
    mutate(`${SALON_ENDPOINT}/${id}`, true);
  } catch (error) {
    dispatch(showToast({ message: "Error submitting salon!", success: false }));
  }
};


export default function SuccessPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { data: salon, error } = useSWR(id ? `${SALON_ENDPOINT}/${id}` : null, fetchGetJSON);
  const { data: userStatus, error: userStatusError } = useSWR<frontEndAuthResponse>(USER_STATUS_ENDPOINT, fetchGetJSON);
  const { data: user, error: userError } = useSWR(userStatus?.userId ? `${USER_ENDPOINT}/${userStatus.userId}` : null, fetchGetJSON);

  if (!id || error || !salon) {
    return (
      <DashboardLayout isLoading={false}>
        <Typography sx={{ justifySelf: "flex-start", fontWeight: "bold", textDecoration: "none" }}>
          {!id ? "Salon Id not provided" : error ? "Failed to Load Salon Info" : "Loading Salon Info"}
        </Typography>
      </DashboardLayout>
    );
  }

  if (userError || userStatusError) {
    return (
      <DashboardLayout isLoading={false}>
        <Typography sx={{ justifySelf: "flex-start", fontWeight: "bold", textDecoration: "none" }}>
          {userError ? "Failed to Load User Info" : userStatusError ? "Failed to Load User Status" : "Loading User Info"}
        </Typography>
      </DashboardLayout>
    );
  }

  const urlToShare = getSalonShareUrl(salon);
  return (
    <DashboardLayout isLoading={false}>
      <Container>
        <DraftOrSuccessMessageContainer>
          <DashboardNav salon={salon} />
          {salon.state === "DRAFT" ? (
            <>
              <Heading>
                Your {getEventType(salon)} is saved as a draft!
              </Heading>
              <Heading>
                Review and publish it when you&apos;re ready.
              </Heading>
            </>
          ) : (
            <>
              <Heading>
                You&apos;ve successfully created your event!
              </Heading>
              <Heading>
                Let&apos;s share it with the world.
              </Heading>
            </>
          )}
        </DraftOrSuccessMessageContainer>
        <FlexBox sx={{ mt: "1em" }}>
          <Box>
            <SalonCard salon={salon} />
          </Box>
          <ButtonContainer>
            <ShareButton variant="contained" onClick={() => copyTextToClipboard(urlToShare, dispatch)}>
              <LinkIcon sx={{ mr: 1 }} />
              Copy Link
            </ShareButton>
            {salon.state === "DRAFT" ? (
              <>
                <ShareButton variant="outlined" onClick={() => submitSalon(user.id, salon.id, dispatch)}>
                Submit {getEventType(salon)}
                </ShareButton>
              </>
            ) : (
              <>
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
              </>
            )}
          </ButtonContainer>
        </FlexBox>
      </Container>
    </DashboardLayout>
  );
}
