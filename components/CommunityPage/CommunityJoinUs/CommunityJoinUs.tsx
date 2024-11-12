import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { JoinUsSection } from "@utils/contentfulTypes";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const CommunitySectionWrapper = styled(Box)`
  background-color: #FC714E;
  padding: 60px 130px;
  display: flex;
  justify-content: center;
  width: 100%;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const GridContainer = styled(Grid)`
  display: flex;
  justify-content: space-between;
  max-width: 1200px;
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
  gap: 20px;
  text-align: left;
  max-width: 560px;

  p {
    margin: 0;
  }
`;

const StyledTitle = styled(Typography)`
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

  a {
    width: 300px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  padding: "12px 0 !important";
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  gap: 35px;
  color: "#FFFFFF";
`;

const StyledContainer = styled(Container)`
  display: flex;
  justify-content: center;
  max-width: 1200px;
`;

interface ICommunityJoinUsProps {
  data: JoinUsSection;
}

export default function CommunityJoinUs(props: ICommunityJoinUsProps) {
  const {
    title,
    description,
    buttonText,
    buttonUrl,
    image,
  } = props.data;
  
  return (
    <CommunitySectionWrapper>
      <StyledContainer>
        <GridContainer container>
          <ImageWrapper>
            <Image src={image} alt="Community" layout="responsive" height={341} width={331} />
          </ImageWrapper>

          <Grid item md={6} sx={{ display: "flex", justifyContent: "center" }}>
            <ContentWrapper>
              <StyledTitle>
                {title}
              </StyledTitle>
              <StyledDescription>
                {description}
              </StyledDescription>
              <ButtonWrapper>
                <Link href={buttonUrl}>
                  <StyledButton variant="contained">
                    {buttonText}
                  </StyledButton>
                </Link>
              </ButtonWrapper>
            </ContentWrapper>
          </Grid>
        </GridContainer>
      </StyledContainer>
    </CommunitySectionWrapper>
  );
}