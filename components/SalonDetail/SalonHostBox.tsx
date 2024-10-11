import { useState } from "react";
import { Box, Button, Alert } from "@mui/material";
import { User } from "@prisma/client";
import Image from "next/image";
import { STRIPE_ENDPOINT } from "@config";
import { submitData } from "@utils/form-creation-helpers";
import { hostBoxStyle } from "@utils/style-helpers";
import { HTTPMethod, StripeSession } from "@utils/types";
import { getHostUrl } from "@utils/frontend-helpers";
import styled from "styled-components";

const HostInfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const HostName = styled.p`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 26px;
  }
`;

const GradientButton = styled(Button)`
  width: 50%;
  background: linear-gradient(to right, #a2e8f1, #d6cbff);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 23px;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const BioText = styled.p`
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 24px;
  }
`;

export default function SalonHostBox({ url, host }: { url: string, host: User }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const bioText = host.bio && host.bio.length > 200 ? host.bio.slice(0, 200) + "..." : host.bio;

  const handleButtonClick = async () => {
    const session = await submitData(`${STRIPE_ENDPOINT}/checkout?tip=true`, HTTPMethod.Post, { hostId: host.id, url: url, amount: 1 }, setIsLoading, setIsError, setErrorMessage) as StripeSession;
    if (session.url) window.location.href = session.url;
  };

  return (
    <Box sx={hostBoxStyle()}>
      <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        component="a"
        href={getHostUrl(host)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Image src={host.profileImageUrl!} width={88} height={88} alt="host image" />
        <HostInfoBox>
          <HostName>{host.fullname}</HostName>
        </HostInfoBox>
      </Box>

      <Box>
        <GradientButton
          variant="contained"
          onClick={handleButtonClick}
          disabled={isLoading}
        >
          Tip
        </GradientButton>
      </Box>
      {isError && <Box sx={{ mb: 2, width: "760px" }}>
        <Alert severity="error">{JSON.stringify(errorMessage)}</Alert>
      </Box>}

      {host.bio && <Box>
        <BioText>
          {host.bio}
        </BioText>
      </Box>}
    </Box>
  );
}
