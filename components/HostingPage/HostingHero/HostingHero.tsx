import { Button } from "@mui/material";
import { CommunityHeroSection } from "@utils/contentfulTypes";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const HeroContainerDesktop = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  max-width: 1200px;
  margin: 160px auto;
  
  @media (max-width: 768px) {
    margin-top: 50px;
    margin-bottom: 50px;
  }
`;

const ContentBox = styled.div`
  /* max-width: 850px; */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;
  margin: 0 auto;
`;

const Title = styled.div`
  font-size: 60px;
  font-weight: 500;
  line-height: 72px;
  letter-spacing: 0.05em;
  text-align: center;
  color: #FC714E;
  max-width: 1180px;

  @media (max-width: 768px) {
    font-size: 34px;
    font-weight: 500;
    line-height: 36px;
    padding: 0 20px;
  }
`;

const SubTitle = styled.div`
  margin-top: 40px;
  font-size: 20px;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #231F20;
  max-width: 850px;

  @media (max-width: 768px) {
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    padding: 0 20px 0 20px;
    margin-top: 28px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 20px;
  width: 100%;
  margin-top: 40px;
`;

const StyledButton = styled(Button)`
  padding: 12px 51px;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  gap: 35px;
`;

const ImageContainer = styled.div`
  position: absolute;
  z-index: 0;

  @media (max-width: 768px) {
    display: none;
  }
`;

const CatImage = styled(ImageContainer)`
  top: -124px;
  right: 83px;
`;

const PlanetImage = styled(ImageContainer)`
  top: 109px;
  left: -53px;
`;

const AmpulhetaImage = styled(ImageContainer)`
  bottom: -50px;
  right: -45px;
`;

interface IHostingHeroSectionProps {
  data: CommunityHeroSection;
}

export default function HostingHero(props: IHostingHeroSectionProps) {
  const { buttonText, buttonUrl, title, subTitle } = props.data;

  return (
    <HeroContainerDesktop>
      <CatImage>
        <Image src="/images/community/cat.png" alt="cat" width={82} height={137} />
      </CatImage>
      <AmpulhetaImage>
        <Image src="/images/community/ampulheta.png" alt="ampulheta" objectFit="contain" width={120} height={157} />
      </AmpulhetaImage>
      <PlanetImage>
        <Image src="/images/community/planet.png" alt="planet" width={105} height={293} />
      </PlanetImage>
      <ContentBox>
        <Title>{title}</Title>
        <SubTitle>{subTitle}</SubTitle>
        <ButtonContainer>
          <Link href={buttonUrl}>
            <StyledButton variant="contained">
              {buttonText}
            </StyledButton>
          </Link>
        </ButtonContainer>
      </ContentBox>
    </HeroContainerDesktop>
  );
}
