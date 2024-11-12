import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { JoinCommunitySection } from "@utils/contentfulTypes";
import Image from "next/image";
import Link from 'next/link';
import styled from 'styled-components';

const CommunitySectionWrapper = styled(Box)`
  background-color: #FC714E;
  padding: 120px 130px;
  display: flex;
  justify-content: center;
  width: 100%;

  a {
    width: 100%;
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    height: 200px;
  }
`;

const GridContainer = styled(Grid)`
  display: flex;
  justify-content: space-between;
  max-width: 1400px;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    gap: 20px;
  }
`;

const ContentWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;
  text-align: left;
  max-width: 560px;
`;

const StyledTitle = styled(Typography)`
  font-family: Inter;
  font-size: 32px;
  font-weight: 500;
  line-height: 40px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #FFFFFF;
`;

const StyledDescription = styled(Typography)`
  margin-top: 1em;
  margin-bottom: 1em;
  color: #F1EFE2;
  font-size: 18px;
`;

const ButtonWrapper = styled(Box)`
  display: flex;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button) <{ padding: boolean }>`
  padding: "12px 0 !important";
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  gap: 35px;
  color: ${(props) => (props.padding ? "#231F20" : "#FFFFFF")};
  ${(props) => !props.padding && `
    border: 1.5px solid #FFFFFF;
  `}
`;

const SmallImageWrapper = styled.div`
  position: absolute;
  top: -41px;
  left: -43px;
  z-index: 100;
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
`;

interface ICommunitySectionProps {
  data: JoinCommunitySection;
}

export default function CommunitySection(props: ICommunitySectionProps) {
  const {
    title,
    description,
    imgUrl,
    buttons,
  } = props.data;
  
  return (
    <CommunitySectionWrapper>
      <StyledContainer maxWidth={false}>
        <GridContainer container>
          <ImageWrapper>
            <Image src={imgUrl} alt="Community" layout="responsive" height={288} width={420} />
          </ImageWrapper>
          <SmallImageWrapper>
              <Image src="/images/left-hand.svg" alt="Small Community" width={120} height={120} />
          </SmallImageWrapper>

          <Grid item md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <ContentWrapper>
              <StyledTitle>
                {title}
              </StyledTitle>
              <StyledDescription>
                {description}
              </StyledDescription>
              <ButtonWrapper>
                {buttons && buttons.length > 0 && buttons.map((button, index) => {
                  return (
                    <Link key={button.text + button.url} href={button.url}>
                      <StyledButton padding={index % 2 === 0} variant={index % 2 === 0 ? "contained" : "outlined"}>
                        {button.text}
                      </StyledButton>
                    </Link>
                  );
                })}
              </ButtonWrapper>
            </ContentWrapper>
          </Grid>
        </GridContainer>
      </StyledContainer>
    </CommunitySectionWrapper>
  );
}