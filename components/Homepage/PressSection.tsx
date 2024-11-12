import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Typography, Link } from "@mui/material";

const pressLogos = [
  { src: '/images/logos/vox.svg', alt: 'press img', width: 81, height: 40 },
  { src: '/images/logos/ny.png', alt: 'press img', width: 173, height: 46 },
  { src: '/images/logos/tablet.svg', alt: 'press img', width: 142, height: 23 },
];

const PressSectionWrapper = styled.section`
  padding: 120px 130px 0;
  text-align: center;

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;

const PressContainer = styled.div`
  /* margin-top: 4em; */
`;

const PressDescription = styled.div`
    margin-bottom: 40px;
    font-size: 16px;
    font-weight: 400;
    line-height: 32px;
    letter-spacing: 0.02em;
    text-align: center;
    color: #231F20;
`;

const LogosContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

const LogoGrid = styled.div`
  display: flex;
  width: 100%;
  gap: 40px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

const LogoItem = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 120px;
  background-color: #FFF6E3;
  text-decoration: none;
`;

const PressSection = () => {
  return (
    <PressSectionWrapper>
      <PressContainer>
        <PressDescription>
          See what the press is saying and get an inside look at our world. Read our press coverage now and stay informed!
        </PressDescription>
        <LogosContainer>
          <LogoGrid>
            {pressLogos.map((logo, index) => (
              <LogoItem href="#" key={index}>
                <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
              </LogoItem>
            ))}
          </LogoGrid>
        </LogosContainer>
      </PressContainer>
    </PressSectionWrapper>
  );
};

export default PressSection;
