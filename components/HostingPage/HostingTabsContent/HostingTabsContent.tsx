import React, { useState } from "react";
import HostingTabs from "../HostingTabs/HostingTabs";
import styled from "styled-components";
import TabContent from "../HostingTabs/TabContent/TabContent";

const HostingTabsContentContainer = styled.div`
    margin: 120px auto;
    width: 100%;
    max-width: 1200px;
`;

const HostingTabsContentWrapper = styled.div`
    margin-top: 60px;
`;

interface Tab {
  title: string;
  content: string;
}

interface HostingTabsContentProps {
  tabs: Tab[];
}

const HostingTabsContent: React.FC<HostingTabsContentProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].title);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const activeTabContent = tabs.find(tab => tab.title === activeTab)?.content;

  return (
    <HostingTabsContentContainer>
      <HostingTabs tabs={tabs.map(tab => tab.title)} onTabChange={handleTabChange} />
      <HostingTabsContentWrapper>
        {activeTabContent && <TabContent content={activeTabContent} />}
      </HostingTabsContentWrapper>
    </HostingTabsContentContainer>
  );
};

export default HostingTabsContent;