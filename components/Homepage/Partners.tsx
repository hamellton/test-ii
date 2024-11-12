import React from "react";
import Image from "next/image";
import styled from "styled-components";
import { PartnersSection } from "@utils/contentfulTypes";

const PartnerSectionWrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  padding: 0 130px;
  margin: 80px 0;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;

  img {
    width: calc(100% - 130px) !important;
    position: relative;
    height: auto;
  }

  @media (max-width: 768px) {
    display: none;
    flex-direction: column;
    padding: 0 40px;
    margin: 20px 0;
    gap: 20px;

    img {
    width: 100% !important;
  }
  }
`;

const PartnerSectionTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #231F20;

  @media (max-width: 768px) {
    font-weight: 700;
    font-size: 32px;
    text-align: left;
  }
`;

interface IPartnerSectionProps {
  data: PartnersSection;
}

const PartnerSection = (props: IPartnerSectionProps) => {
  const { imageUrl, title } = props.data;

  return (
    <PartnerSectionWrapper>
      <PartnerSectionTitle>
        {title}
      </PartnerSectionTitle>
      <Image
        src={imageUrl}
        alt={title}
        width={100}
        height={40}
        layout="responsive"
      />
    </PartnerSectionWrapper>
  );
};

export default PartnerSection;
