import styled from "styled-components";
import { CommunityCollectiveSparkSection } from "@utils/contentfulTypes";
import { Grid, Typography } from "@mui/material";

interface IcommunityCollectiveSparkSectionProps {
    data: CommunityCollectiveSparkSection;
}

const AboutUsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  padding: 120px 0 0;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    padding: 40px 20px 0;
    gap: 40px;
    align-items: flex-start;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 0 auto;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Image = styled.img`
  height: auto;
  border-radius: 8px;
  max-height: 360px;
  width: 100%;
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 19px 0;
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Quote = styled(Typography)`
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #231F20;
  flex: 1;
`;

const Name = styled(Typography)`
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #FC714E;
  margin-bottom: 8px;
  margin-top: 16px;
`;

const JobTitle = styled(Typography)`
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #231F20;
`;

const ProfileGridItem = styled(Grid)`
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export default function CommunityAboutUs({ data }: IcommunityCollectiveSparkSectionProps) {
  const {
    image,
    text,
    name,
    jobTitle,
  } = data;
  return (
    <AboutUsWrapper>
      <Container>
        <ImageContainer>
          <Image src={image} alt="About Us" />
        </ImageContainer>
        <ContentContainer>
          <ProfileGridItem item>
            <Quote>
              {text}
            </Quote>
            <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.875 12.95V0H30V13.135C30 22.015 21.5625 23.125 21.5625 23.125L20.4375 20.535C20.4375 20.535 24.1875 19.98 24.9375 17.02C25.6875 14.8 24.1875 12.95 24.1875 12.95H16.875Z" fill="#FC714E" />
              <path d="M0 12.95V0H13.125V13.135C13.125 22.015 4.6875 23.125 4.6875 23.125L3.5625 20.535C3.5625 20.535 7.3125 19.98 8.0625 17.02C8.8125 14.8 7.3125 12.95 7.3125 12.95H0Z" fill="#FC714E" />
            </svg>
            <Name>
              {name}
            </Name>
            <JobTitle>
              {jobTitle}
            </JobTitle>
          </ProfileGridItem>
        </ContentContainer>
      </Container>
    </AboutUsWrapper>
  );
}