import styled from "styled-components";
import { Box, Divider, Typography } from "@mui/material";
import Image from "next/image";

export const Container = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const MobileContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: auto;
  @media (min-width: 900px) {
    display: none;
  }

  @media (max-width: 600px) {
    /* gap: 22px; */
    margin-top: 23px;
  }
`;

export const ImageContainer = styled(Box)`
  width: 400px;
  height: 400px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  bottom: -40px;

    @media (max-width: 600px) {
      width: 300px;
      height: 300px;
      margin: auto;
  }
`;

export const ImageStyle = styled(Image)`
  position: absolute;
  bottom: 40px;
  object-fit: cover;
`;

export const ImageContainerMobile = styled(Box)`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  margin: auto;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 85%);
`;

export const ImageStyleMobile = styled(Image)`
  object-fit: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
`;


export const NameTypography = styled(Typography)`
  font-family: "Abhaya Libre";
  font-size: 60px;
  font-weight: 700;
  line-height: 72px;
  text-align: left;
  color: #231F20;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    font-family: "Abhaya Libre";
    font-size: 40px;
    line-height: 48px;
    text-align: center;
  }
`;

export const DesktopContainer = styled(Box)`
  display: none;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  @media (min-width: 900px) {
    display: flex;
    padding: 0 172px 0 48px;
  }
`;

export const DividerStyle = styled(Divider)`
  background-color: #460B2466;
  height: 2px;
`;

export const BioTypography = styled(Typography)<{ centerOnMobile?: boolean }>`
  font-size: 1.5rem;
  margin-top: 1rem;
  text-align: ${({ centerOnMobile }) => (centerOnMobile ? "center" : "left")};
`;

export const QuoteTypography = styled(Typography)<{ centerOnMobile?: boolean }>`
  font-size: 2.8rem;
  margin-bottom: 2rem;
  text-align: ${({ centerOnMobile }) => (centerOnMobile ? "center" : "left")};
`;

export const SalonsContainer = styled(Box)<{ centerOnMobile?: boolean }>`
  display: flex;
  justify-content: ${({ centerOnMobile }) => (centerOnMobile ? "center" : "space-between")};
  flex-wrap: wrap;
  margin-top: 42px;
  gap: 10px;

  @media (max-width: 600px) {
    text-align: ${({ centerOnMobile }) => (centerOnMobile ? "center" : "left")};
  }
`;

export const OuterBox = styled(Box)`
  margin-bottom: 4rem;
`;

export const InnerBox = styled(Box)`
  padding: 45px 31px;

  @media (max-width: 600px) {
    padding: 0;
  }
`;

export const SectionTitle = styled(Typography)<{ centerOnMobile?: boolean, isUpcomingSalons?: boolean }>`
  font-family: "Abhaya Libre";
  font-size: 48px;
  font-weight: 700;
  line-height: 58px;
  text-align: left;
  color: #231F20;

  @media (max-width: 600px) {
    text-align: ${({ centerOnMobile }) => (centerOnMobile ? "center" : "left")};
    margin-top: ${({ isUpcomingSalons }) => (isUpcomingSalons ? "49px" : "0")};
  }
`;

export const UserContentWrapper = styled(Box)`
  padding: 48px;

  @media (max-width: 600px) {
    padding: 30px 32px;
  }
`;

export const UserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 47px;

  @media (max-width: 600px) {
    justify-content: flex-start;
    flex-direction: column;
    gap: 20px;
  }
`;

export const UserBioItem = styled.div`
  width: 100%;
  padding-right: 40px;
  
  p {
    font-family: "Abhaya Libre";
    font-size: 30px;
    font-weight: 700;
    line-height: 44px;
    letter-spacing: 0.01em;
    text-align: left;
    color: #231F20;
    margin: 0;

    @media (max-width: 600px) {
      font-size: 13px;
      line-height: 19px;
      letter-spacing: 0.01em;
      text-align: center;
    }
  }

  @media (max-width: 600px) {
    padding-right: 0;
    text-align: center;
  }
`;

export const UserQuoteGridItem = styled.div`
  width: 100%;
  padding-right: 13px;

  p {
    font-family: "Abhaya Libre";
    font-size: 40px;
    font-weight: 700;
    line-height: 58px;
    letter-spacing: 0.01em;
    text-align: left;
    color: #231F20;

    @media (max-width: 600px) {
      font-size: 20px;
      line-height: 29px;
      letter-spacing: 0.01em;
      text-align: center;
      margin-bottom: 0;
    }
  }

  @media (max-width: 600px) {
    padding-right: 0;
  }
`;

export const LinksContainer = styled(Box)`
  display: flex;
  align-items: center;
  position: relative;
  
  &::before, &::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 100%;
    height: 2px;
    background-color: #460B2466;
    z-index: -1;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`;

export const LinkItem = styled(Box)`
  width: 111px;
  text-align: center;
  z-index: 1;
  margin: 0 50px;
  background: #f1efe3;
  padding: 16px;
  font-family: "Abhaya Libre";
  font-size: 18px;
  font-weight: 700;
  line-height: 22px;
  text-align: center;
`;

export const LinksContainerMobile = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: stretch;
`;

export const LinkBoxMobile = styled(Box)`
  background: #f1efe3;
  padding: 16px;
  border: 1px solid black;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  &:nth-child(5) {
    grid-column: span 2;
  }
`;

export const TipSection = styled(Box)`
  display: flex;
  align-items: center;
  gap: 30px;
  width: fit-content;
  margin-bottom: 17px;

  span {
    font-family: "Abhaya Libre";
    font-size: 30px;
    font-weight: 700;
    line-height: 45px;
    text-align: left;
    color: #460B24CC;
  }

  button {
    padding: 14px 54px;
    max-height: 40px;
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    text-align: left;
    color: #231F20;
  }

  @media (max-width: 600px) {
      flex-direction: column;
      margin: 0 auto;
    }
`;
