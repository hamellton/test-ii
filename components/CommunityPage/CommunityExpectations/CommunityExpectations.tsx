import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { MembershipList } from "../../../styles/pages/MembershipStyles";
import { ExpectationsSection } from "@utils/contentfulTypes";

interface ICommunityExpectationsProps {
  data: ExpectationsSection;
}

const TestimonialsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 60px;
  margin: 120px auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    margin: 40px 0;
    gap: 40px;
  }
`;

const Title = styled.div`
  font-size: 40px;
  font-weight: 500;
  line-height: 48px;
  letter-spacing: 0.05em;
  text-align: center;
  color: #231F20;
`;

const Name = styled(Typography)`
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #FC714E;
  margin-bottom: 8px;
`;

const ProfileGridItem = styled(Grid)`
  max-width: 340px;
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const TestimonialsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 80px;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    padding: 0 20px;
    gap: 20px;
  }
`;

export default function CommunityExpectations({ data }: ICommunityExpectationsProps) {

  const sections = [
    { title: data.column1Title, list: data.column1List },
    { title: data.column2Title, list: data.column2List },
    { title: data.column3Title, list: data.column3List },
  ];

  return (
    <TestimonialsWrapper>
      <Title>{data.title}</Title>

      <TestimonialsContainer>
        {sections.map((section, index) => (
          <ProfileGridItem item key={index}>
            <Name>{section.title}</Name>
            <MembershipList>
              {section.list.map((item, i) => (
                <li key={i}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.66667 1.45703V14.7904M12.3807 3.40965L2.95262 12.8377M14.3333 8.1237H1M12.3807 12.8377L2.95262 3.40965" stroke="#FC714E" strokeWidth="1.81818" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </MembershipList>
          </ProfileGridItem>
        ))}
      </TestimonialsContainer>
    </TestimonialsWrapper>
  );
}
