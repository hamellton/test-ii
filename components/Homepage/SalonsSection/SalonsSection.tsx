import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import { Box, Button, CircularProgress } from "@mui/material";
import { SALON_ENDPOINT } from "@config";
import SalonCard from "./SalonCard/SalonCard";
import { ExtendedSalon } from "@utils/types";
import { SalonsSection } from "@utils/contentfulTypes";

const getSalonUrl = (slug: string) => `${SALON_ENDPOINT}/slug/${slug}`;

// Styles for the updated component
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 130px;
  margin: 0 auto;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Title = styled.h2`
  font-size: 40px;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 0.05em;
  text-align: center;
  color: #231F20;
  margin: 15px 0 60px;
`;

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 60px;
  border-bottom: 1px solid #e0e0e0;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background-color: transparent;
  color: ${props => props.active ? "#FC714E" : "#231F20"};
  border: none;
  padding: 20px 0;
  margin-right: 40px;
  cursor: pointer;
  font-size: 20px;
  font-weight: ${props => props.active ? "600" : "500"};
  position: relative;
  transition: color 0.3s ease;
  width: 100%;
  margin-right: 0;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: #FC714E;
    transform: scaleX(${props => props.active ? 1 : 0});
    transition: transform 0.3s ease;
  }

  &:hover {
    color: #FC714E;
  }
`;

const SalonGrid = styled.div`
  display: flex;
  justify-content: center;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 40px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SalonsSectionButton = styled(Button)`
  padding: 12px 100px;
  width: fit-content;
  font-size: 16px;
  font-weight: 500;
  line-height: 25.6px;
  text-align: left;
  color: #231F20;
  border: 1.5px solid #231F20;
  cursor: pointer;
  margin: 40px auto auto auto;
`;

const Salon: React.FC<{ data: SalonsSection }> = ({ data }) => {

  const [salons, setSalons] = useState<ExtendedSalon[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>(data.category1.title);

  const getSalonsFromCategory = (category: string) => {
    switch (category) {
    case data.category1.title:
      return data.category1.salons.map(slug => ({ slug, category }));
    case data.category2.title:
      return data.category2.salons.map(slug => ({ slug, category }));
    case data.category3.title:
      return data.category3.salons.map(slug => ({ slug, category }));
    case data.category4.title:
      return data.category4.salons.map(slug => ({ slug, category }));
    default:
      return [];
    }
  };

  const fetchSalonsForCategory = async (category: string) => {
    setIsLoading(true);
    setSalons([]);

    const salonsWithCategories = getSalonsFromCategory(category);
    const salonPromises = salonsWithCategories.map(async ({ slug, category }) => {
      const response = await fetch(getSalonUrl(slug));
      const salonData = await response.json();
      return { ...salonData, category };
    });

    const salonsData = await Promise.all(salonPromises);
    setSalons(salonsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchSalonsForCategory(activeTab);
  }, [activeTab]);

  const categories = [
    data.category1.title,
    data.category2.title,
    data.category3.title,
    data.category4.title
  ];

  return (
    <Container>
      <Image src="/images/book.svg" alt="book" width={95} height={93} />
      <Title>{data.sectionTitle}</Title>
      <TabsContainer>
        {categories.map(category => (
          <Tab key={category} active={activeTab === category} onClick={() => setActiveTab(category)}>
            {category}
          </Tab>
        ))}
      </TabsContainer>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <SalonGrid>
          {salons.length > 0 && salons.map((salon: ExtendedSalon) => {
            return (
              <SalonCard key={salon.id} salon={salon} host={salon.host} />
            );
          })}
        </SalonGrid>
      )}
      <SalonsSectionButton variant="outlined" onClick={() => window.location.href = data.button.url}>{data.button.text}</SalonsSectionButton>
    </Container>
  );
};

export default Salon;
