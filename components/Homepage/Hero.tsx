import { Button } from "@mui/material";
import { HeroSection } from "@utils/contentfulTypes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";

const HeroContainerMobile = styled.div`
  display: flex;
  padding: 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const HeroContainerDesktop = styled.div<{ headerHeight: number }>`
  display: none;
  position: relative;
  width: 100%;
  height: ${({ headerHeight }) => `calc(100vh - ${headerHeight}px)`}; /* Dynamic height based on header */
  
  @media (min-width: 768px) {
    display: flex;
  }
`;

const ImageContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const ContentBox = styled.div`
  position: absolute;
  top: 39%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 850px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  z-index: 1;
`;

const Title = styled.div`
  font-size: 60px;
  font-weight: 500;
  line-height: 72px;
  letter-spacing: 0.05em;
  text-align: center;
  color: #FC714E;
`;

const SubTitle = styled.div`
  margin-top: 40px;
  font-size: 20px;
  font-weight: 400;
  line-height: 40px;
  letter-spacing: 0.02em;
  text-align: center;
  color: #231F20;
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

const StyledButton = styled(Button)<{ padding: boolean }>`
  padding: ${(props) => (props.padding ? "12px 44px" : "12px 51px")};
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  gap: 35px;
  ${(props) => !props.padding && `
    border: 1.5px solid #231F20;
  `}
`;

interface IHeroSectionProps {
  data: HeroSection;
}

export default function Hero(props: IHeroSectionProps) {
  const { buttons, title, subTitle } = props.data;
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  useEffect(() => {
    // Get the header element by ID and calculate its height
    const headerElement = document.getElementById("header");
    if (headerElement) {
      setHeaderHeight(headerElement.offsetHeight);
    }

    // Add event listener for window resize to recalculate height
    const handleResize = () => {
      if (headerElement) {
        setHeaderHeight(headerElement.offsetHeight);
      }
    };
    window.addEventListener("resize", handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Mobile Hero */}
      {/* <HeroContainerMobile>
        <Typography variant="h3">Top Picks</Typography>
      </HeroContainerMobile> */}

      {/* Desktop Hero */}
      <HeroContainerDesktop headerHeight={headerHeight}>
        <ImageContainer>
          <Image src="/images/left-hero.png" alt="left hero" width={571} height={394} />
          <Image src="/images/right-hero.png" alt="right hero" width={530} height={463} priority />
        </ImageContainer>
        <ContentBox>
          <Title>{title}</Title>
          <SubTitle>{subTitle}</SubTitle>
          <ButtonContainer>
            {buttons && buttons.length > 0 && buttons.map((button, index) => {
              return (
                <Link key={button.text + button.url} href={button.url}>
                  <StyledButton padding={index % 2 === 0} variant={index % 2 === 0 ? "contained" : "outlined"}>
                    {button.text}
                  </StyledButton>
                </Link>
              );
            })}
          </ButtonContainer>
        </ContentBox>
      </HeroContainerDesktop>
    </>
  );
}
