import styled from "styled-components";
import { Grid, Typography } from "@mui/material";
import { Testimonial } from "@utils/contentfulTypes";

interface ITestimonialsProps {
  data: Testimonial[];
  isHomePage?: boolean;
}

const TestimonialsWrapper = styled.div<{ isHomePage: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 60px;
  margin-bottom: 120px;
  margin-top: 120px;
  margin-top: ${({ isHomePage }) => (isHomePage ? "0" : "120px")};

  @media (max-width: 768px) {
    margin-bottom: 40px;
    margin-top: ${({ isHomePage }) => (isHomePage ? "0" : "60px")};
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

const Quote = styled(Typography)`
  margin-bottom: 32px;
  font-size: 16px;
  font-weight: 500;
  line-height: 32px;
  letter-spacing: 0.02em;
  text-align: left;
  color: #231F20;
  flex: 1;
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

const JobTitle = styled(Typography)`
  font-family: Inter;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: 0.05em;
  text-align: left;
  color: #231F20;
`;

const ProfileGridItem = styled(Grid)`
  max-width: 340px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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

export default function Testimonials({ data, isHomePage }: ITestimonialsProps) {

  return (
    <TestimonialsWrapper isHomePage={isHomePage ? isHomePage : false}>
      <Title>
        Our community and hosts said about us...
      </Title>

      <TestimonialsContainer>
        {
          data.map((profile, index) => (
            <ProfileGridItem item key={index}>
              <Quote>
                {profile.comment}
              </Quote>
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.875 12.95V0H30V13.135C30 22.015 21.5625 23.125 21.5625 23.125L20.4375 20.535C20.4375 20.535 24.1875 19.98 24.9375 17.02C25.6875 14.8 24.1875 12.95 24.1875 12.95H16.875Z" fill="#FC714E" />
                <path d="M0 12.95V0H13.125V13.135C13.125 22.015 4.6875 23.125 4.6875 23.125L3.5625 20.535C3.5625 20.535 7.3125 19.98 8.0625 17.02C8.8125 14.8 7.3125 12.95 7.3125 12.95H0Z" fill="#FC714E" />
              </svg>
              <Name>
                {profile.name}
              </Name>
              <JobTitle>
                {profile.title}
              </JobTitle>
            </ProfileGridItem>
          ))
        }
      </TestimonialsContainer>
    </TestimonialsWrapper>
  );
}
