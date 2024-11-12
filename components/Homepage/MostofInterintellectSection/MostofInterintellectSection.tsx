import { MostOfInterintellectCard } from "@utils/contentfulTypes";
import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { Button } from "@mui/material";

const ServicesSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 0 130px 120px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 75px;
    padding: 0 20px 40px;
  }
`;

const ServiceCard = styled.div`
  background: #FFF6E3;
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: auto;
  max-width: 366px;

  img {
    width: 100px;
    height: 100px;
    position: absolute;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const ServiceCardTitle = styled.div`
  font-size: 24px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: 0.05em;
  text-align: center;
  margin: 120px 0 20px 0;
  color: #FC714E;
`;

const ServicesSectionTitle = styled.div`
    font-size: 40px;
    font-weight: 500;
    line-height: 48px;
    letter-spacing: 0.05em;
    text-align: center;
    color: #231F20;
    margin: 120px 130px;
    text-align: center;

    @media (max-width: 768px) {
        margin: 60px 20px;
        font-weight: 700;
        font-size: 32px;
        text-align: left;
  }
`;

const ServiceDescription = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 32px;
  letter-spacing: 0.02em;
  text-align: center;
  margin: 0 0 20px 0;
`;

const CardButton = styled(Button)`
  padding: 12px 51px;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  gap: 35px;
  border: 1.5px solid #231F20;
  cursor: pointer;
  margin-top: auto;
`;

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    button: { text: string, url: string };
}

const ServiceCardComponent: React.FC<ServiceCardProps> = ({ icon, title, description, button }) => (
  <ServiceCard>
    {icon}
    <ServiceCardTitle>{title}</ServiceCardTitle>
    <ServiceDescription>{description}</ServiceDescription>
    <CardButton variant="outlined" onClick={() => window.location.href = button.url}>{button.text}</CardButton>
  </ServiceCard>
);

interface IMostofInterintellectSectionProps {
    data: MostOfInterintellectCard[];
}

const MostofInterintellectSection: React.FC<IMostofInterintellectSectionProps> = (props) => {
  const cards = props.data;
  return (
    <>
      <ServicesSectionTitle>Make the Most of Interintellect</ServicesSectionTitle>
      <ServicesSection>
        {cards && cards.length > 0 && cards.map(card => {
          const {
            title,
            cardImg,
            buttonUrl,
            buttonTitle,
            description,
          } = card;
          return (
            <ServiceCardComponent
              key={title}
              icon={<Image src={cardImg} alt={title} width={100} height={100} />}
              title={title}
              description={description}
              button={{ text: buttonTitle, url: buttonUrl }}
            />
          );
        })}
      </ServicesSection>
    </>
  );
};

export default MostofInterintellectSection;
