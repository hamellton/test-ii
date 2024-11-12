import styled from "styled-components";
import { AboutUsSection } from "@utils/contentfulTypes";

interface IAboutUsProps {
    data: AboutUsSection;
}

const AboutUsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 120px;
  padding: 240px 130px 0;
  margin: 0 auto;

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

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`

`;

const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;

  @media (min-width: 768px) {
    min-height: 423px;
    min-width: 570px;
  }
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 19px 0;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const Title = styled.h2`
    font-size: 40px;
    font-weight: 500;
    line-height: 48px;
    letter-spacing: 0.05em;
    text-align: center;
    color: #231F20;
    margin: 0;
`;

const LogoWrapper = styled.div`
  margin-bottom: 20px;
`;

const Logo = styled.img`
  width: 241px;
  height: auto;
`;

const SubTitle = styled.h3`
    font-size: 28px;
    font-weight: 500;
    line-height: 40px;
    letter-spacing: 0.05em;
    text-align: left;
    color: #FC714E;
    margin: 0 0 20px 0;
`;

const Description = styled.p`
    font-size: 16px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0.02em;
    text-align: left;
    color: #231F20;
    margin: 0;
`;

export default function AboutUs({ data }: IAboutUsProps) {
    return (
        <AboutUsWrapper>
        <Title>{data.title}</Title>
        <Container>
            <ImageContainer>
                <Image src={data.aboutUsImgUrl} alt="About Us" />
            </ImageContainer>
            <ContentContainer>
                <LogoWrapper>
                    <Logo src={data.logoUrl} alt="Logo" />
                </LogoWrapper>
                <SubTitle>{data.subTitle}</SubTitle>
                <Description>{data.description}</Description>
            </ContentContainer>
        </Container>
        </AboutUsWrapper>
    );
}