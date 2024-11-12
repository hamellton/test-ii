import React, { useState } from "react";
import styled from "styled-components";

const TabsContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 60px;
  border-bottom: 1px solid #e0e0e0;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tab = styled.button<{ active: boolean }>`
  background-color: transparent;
  color: ${props => props.active ? "#FC714E" : "#231F20"};
  border: none;
  padding: 20px 0;
  cursor: pointer;
  font-size: 20px;
  font-weight: ${props => props.active ? "600" : "500"};
  position: relative;
  transition: color 0.3s ease;
  width: 100%;

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

interface TabsProps {
  tabs: string[];
  onTabChange: (tab: string) => void;
}

const HostingTabs: React.FC<TabsProps> = ({ tabs, onTabChange }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <TabsContainer>
      {tabs.map(tab => (
        <Tab
          key={tab}
          active={activeTab === tab}
          onClick={() => handleTabClick(tab)}
        >
          {tab}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default HostingTabs;
