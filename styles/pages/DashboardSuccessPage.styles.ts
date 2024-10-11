import { Box, Button, Typography } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  max-width: 720px;
  margin: 25px 0;
`;

export const Heading = styled(Typography)<{ isSeriesPurchase?: boolean }>`
  font-weight: bold;
  font-size: 32px;
  line-height: 150%;
  text-align: ${({ isSeriesPurchase }) => (isSeriesPurchase ? "center" : "left")};

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

export const ButtonContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  max-width: 323px;
  gap: 16px;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 100%;
  }
`;

export const ShareButton = styled(Button)`
  width: 323px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const ShareIcon = styled.img`
  margin-right: 0.5em;
`;

export const FlexBox = styled(Box)`
  display: flex;
  gap: 64px;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 40px;
  }
`;

export const DraftOrSuccessMessageContainer = styled(Box)`
  margin: 0 0 2em 0;

  @media (max-width: 768px) {
    margin: 0 0 25px 0;
  }
`;