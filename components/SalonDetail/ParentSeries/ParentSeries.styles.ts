import styled from "styled-components";
import { Box } from "@mui/material";

export const ParentSeriesContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
  
  margin-bottom: 8px;

  @media (min-width: 768px) {
    font-family: "Abhaya Libre";
    margin-bottom: 104px;
  }
`;

export const AboutSeriesContent = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  width: 100%;
`;

export const AboutSeriesInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const AboutSeriesBadges = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: "Abhaya Libre" !important;
  font-size: 14px !important;

  p {
    font-size: 14px !important;
    font-family: "Abhaya Libre" !important;
  }
`;

export const AboutSeriesEpisodeCounter = styled.div`
  padding: 4px 8px 4px 8px;
  background-color: #fff;
  border-radius: 8px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
`;

export const AboutSeriesContainer = styled(Box)`
  padding: 20px;
  border-radius: 8px;

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 12px;
  }
`;

export const AboutSeriesMainTitle = styled.h2`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;

  @media (max-width: 768px) {
    font-size: 17px;
    line-height: 26px;
  }
`;

export const AboutSeriesTitle = styled.div`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
  color: #231F20;
`;

export const HostInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const HostBio = styled.p`
  font-family: "Abhaya Libre";
  font-size: 16px;
  font-weight: 700;
  line-height: 26px;
  letter-spacing: 0.01em;
  text-align: left;
  padding: 0;
  margin: 0;

  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 24px;
  }
`;

export const HostInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ReadMore = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  text-align: left;
  color: #231F20;
`;

export const HostTitle = styled.div`
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #605054;
`;

export const HostName = styled.div`
  font-family: "Abhaya Libre";
  font-size: 15px;
  font-weight: 700;
  line-height: 23px;
  text-align: left;
  color: #231F20;
`;

export const UpcomingEpisodesContainer = styled(Box)`

  h2 {
    margin: 0;
  }
`;

export const UpcomingEpisodesTitle = styled.h2`
  font-family: "Abhaya Libre";
  font-size: 20px;
  font-weight: 700;
  line-height: 30px;
  text-align: left;
`;

export const EpisodesList = styled.div<{ listAlign: string }>`
  display: flex;
  justify-content:  ${props => props.listAlign};
  gap: 20px;
  margin-top: 16px;
`;

export const EpisodeItem = styled.div`
  width: 215px;
`;

export const EpisodeItemTime = styled.div`
  font-size: 12px;
  font-weight: 700;
  line-height: 18px;
  text-align: left;
  color: #827A7A;
  text-transform: uppercase;
  margin-top: 12px;
`;

export const UpcomingEpisodesHeading = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const EpisodeLink = styled.a`
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  line-height: 21px;
  text-align: left;
  color: #231F20;

  &:hover {
    text-decoration: underline;
  }
`;

export const EpisodeType = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #605054;
  padding: 4px 0;
  margin-top: 4px;
`;

