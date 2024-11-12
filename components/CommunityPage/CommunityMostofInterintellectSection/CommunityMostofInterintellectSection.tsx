import { CommunityEventsSection } from "@utils/contentfulTypes";
import React from "react";
import styled from "styled-components";
import Image from "next/image";

const ServicesSection = styled.section`
  display: flex;
  justify-content: center;
  gap: 32px;
  padding: 0 0 120px;
  max-width: 1200px;
  margin: 0 auto;

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
  }
`;

const ServicesSectionDescription = styled.div`
    font-size: 20px;
    font-weight: 400;
    line-height: 40px;
    letter-spacing: 0.02em;
    text-align: center;
    margin: -100px auto 120px;
    text-align: center;
    max-width: 850px;

    @media (max-width: 768px) {
        margin: -50px 20px 60px 20px;
        font-weight: 400;
        font-size: 14px;
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

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ServiceCardComponent: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
  <ServiceCard>
    {icon}
    <ServiceCardTitle>{title}</ServiceCardTitle>
    <ServiceDescription>{description}</ServiceDescription>
  </ServiceCard>
);

interface ICommunityMostofInterintellectSectionProps {
  data: CommunityEventsSection;
}

const CommunityMostofInterintellectSection: React.FC<ICommunityMostofInterintellectSectionProps> = (props) => {
  const { cards, title } = props.data;
  return (
    <>
      <ServicesSectionTitle>{title}</ServicesSectionTitle>
      {props.data?.description && <ServicesSectionDescription>{props.data?.description}</ServicesSectionDescription>}
      <ServicesSection>
        {cards && cards.length > 0 && cards.map(card => {
          const {
            title,
            imgUrl,
            description,
          } = card;
          return (
            <ServiceCardComponent
              key={title}
              icon={<Image src={imgUrl} alt={title} width={100} height={100} />}
              title={title}
              description={description}
            />
          );
        })}
      </ServicesSection>
    </>
  );
};

export default CommunityMostofInterintellectSection;
